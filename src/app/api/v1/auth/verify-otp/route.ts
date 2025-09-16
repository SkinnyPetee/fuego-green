import { NextRequest, NextResponse } from "next/server";
import { verifyOtpSchema } from "@/db/validation/verifyOtp";
import { formatZodErrors } from "@/db/validation/sendOtp";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { db } from "@/db/drizzle";
import { otps, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import jwt, { SignOptions } from "jsonwebtoken";

const MAX_ATTEMPTS = 5;

// Make sure to set these environment variables
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "30d"; // 7 days default

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

export async function POST(req: NextRequest) {
  try {
    // Debug: Log the request
    console.log("OTP verification request received");

    const body = await req.json();
    console.log("Request body:", {
      email: body.email,
      otpLength: body.otp?.length,
    });

    const parsed = verifyOtpSchema.safeParse(body);

    if (!parsed.success) {
      console.log("Validation failed:", parsed.error.issues);
      const fieldErrors = formatZodErrors(parsed.error.issues);
      return NextResponse.json(
        errorResponse("Validation failed", fieldErrors),
        { status: 400 },
      );
    }

    const { email, otp } = parsed.data;
    console.log("Parsed data:", { email, otpLength: otp.length });

    // Check if user already exists - only proceed if user is NOT registered
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      if (existingUser[0].emailVerified === true) {
        console.log("User has already verified use another email:", email);
        return NextResponse.json(
          errorResponse(
            "User already verified with this email. Please use new email to verify.",
          ),
          { status: 409 },
        );
      }
    }

    console.log(
      "No existing user found, proceeding with OTP verification for new user",
    );

    // Get the most recent OTP for the email
    const otpRecords = await db
      .select()
      .from(otps)
      .where(eq(otps.email, email))
      .orderBy(desc(otps.sentAt))
      .limit(1);

    console.log("Found OTP records:", otpRecords.length);

    const otpRecord = otpRecords[0];

    if (!otpRecord) {
      console.log("No OTP record found for email:", email);
      return NextResponse.json(
        errorResponse("OTP not found. Please request a new one."),
        { status: 404 },
      );
    }

    console.log("OTP record found:", {
      id: otpRecord.id,
      email: otpRecord.email,
      expiresAt: otpRecord.expiresAt,
      hasAttempts: "attempts" in otpRecord,
    });

    // Check if OTP has expired
    const now = new Date();
    if (otpRecord.expiresAt < now) {
      console.log("OTP expired, cleaning up");
      await db.delete(otps).where(eq(otps.id, otpRecord.id));
      return NextResponse.json(
        errorResponse("OTP has expired. Please request a new one."),
        { status: 400 },
      );
    }

    // Check attempts only if the column exists
    let attempts = 0;
    if ("attempts" in otpRecord && otpRecord.attempts !== null) {
      attempts = otpRecord.attempts;
    }

    if (attempts >= MAX_ATTEMPTS) {
      console.log("Max attempts exceeded, cleaning up");
      await db.delete(otps).where(eq(otps.id, otpRecord.id));
      return NextResponse.json(
        errorResponse("Too many failed attempts. Please request a new OTP."),
        { status: 429 },
      );
    }

    // Simple OTP comparison (no timing-safe for now to avoid complexity)
    const isValidOtp = otpRecord.otp === otp;
    console.log("OTP comparison result:", isValidOtp);

    if (!isValidOtp) {
      console.log("Invalid OTP, incrementing attempts");

      // Only increment attempts if the column exists
      if ("attempts" in otpRecord) {
        try {
          await db
            .update(otps)
            .set({ attempts: attempts + 1 })
            .where(eq(otps.id, otpRecord.id));
          console.log("Attempts incremented to:", attempts + 1);
        } catch (updateError) {
          console.error("Failed to update attempt count:", updateError);
          // Continue without failing the request
        }
      }

      return NextResponse.json(
        errorResponse("Invalid OTP.", {
          attemptsRemaining: String(MAX_ATTEMPTS - attempts - 1),
        }),
        { status: 400 },
      );
    }

    // ✅ OTP is valid - delete it to prevent reuse
    console.log("OTP is valid, deleting record");
    await db.delete(otps).where(eq(otps.id, otpRecord.id));

    // Create new user after successful OTP verification
    const newUser = await db
      .insert(users)
      .values({
        email: email,
        emailVerified: true, // Set to true since they just verified via OTP
      })
      .returning();

    const createdUser = newUser[0];
    console.log(
      `New user created with id: ${createdUser.id} for email: ${email}`,
    );

    // Generate JWT token
    const tokenPayload = {
      userId: createdUser.id,
      email: email,
      verified: true,
    };

    // Alternative approach if the above doesn't work
    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: "Fuego App",
      subject: email,
    } as SignOptions);

    console.log(`OTP verified successfully for email: ${email}`);

    return NextResponse.json(
      successResponse(
        {
          token: token,
          user: {
            email: createdUser.email,
          },
        },
        "OTP verified successfully. User verified.",
      ),
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("OTP verification error:", error);
    console.error("Error stack:", error.stack);

    // More detailed error logging in development
    if (process.env.NODE_ENV === "development") {
      console.error("Full error object:", JSON.stringify(error, null, 2));
    }

    return NextResponse.json(
      errorResponse(
        process.env.NODE_ENV === "development"
          ? `Error: ${error.message}`
          : "Something went wrong. Please try again.",
      ),
      { status: 500 },
    );
  }
}
