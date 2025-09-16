// app/api/v1/auth/signin/route.ts
import { NextResponse } from "next/server";
import { verifyOtpSchema } from "@/db/validation/verifyOtp";
import { formatZodErrors } from "@/db/validation/sendOtp";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { db } from "@/db/drizzle";
import { otps, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import jwt from "jsonwebtoken";

const MAX_ATTEMPTS = 5;

// Make sure to set these environment variables
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "30d"; // 30 days default

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

export async function POST(req: Request) {
  try {
    // Debug: Log the request
    console.log("Sign-in OTP verification request received");

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

    // Check if user exists and is verified - required for sign-in
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    console.log("User lookup result:", {
      found: existingUser.length > 0,
      email: email,
    });

    if (existingUser.length === 0) {
      console.log("User not found for sign-in with email:", email);
      return NextResponse.json(
        errorResponse("User not found. Please sign up first."),
        { status: 404 },
      );
    }

    const user = existingUser[0];
    console.log("User found:", {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    });

    // Check if user's email is verified
    if (!user.emailVerified) {
      console.log("User email not verified for sign-in:", email);
      return NextResponse.json(
        errorResponse("Email not verified. Please verify your email first."),
        { status: 403 },
      );
    }

    console.log(
      "User exists and is verified, proceeding with OTP verification for sign-in",
    );

    // Get the most recent OTP for the email
    const otpRecords = await db
      .select()
      .from(otps)
      .where(eq(otps.email, email))
      .orderBy(desc(otps.sentAt))
      .limit(1);

    console.log("Found OTP records for sign-in:", otpRecords.length);

    const otpRecord = otpRecords[0];

    if (!otpRecord) {
      console.log("No OTP record found for sign-in with email:", email);
      return NextResponse.json(
        errorResponse("OTP not found. Please request a new one."),
        { status: 404 },
      );
    }

    console.log("OTP record found for sign-in:", {
      id: otpRecord.id,
      email: otpRecord.email,
      expiresAt: otpRecord.expiresAt,
      hasAttempts: "attempts" in otpRecord,
    });

    // Check if OTP has expired
    const now = new Date();
    if (otpRecord.expiresAt < now) {
      console.log("OTP expired for sign-in, cleaning up");
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

    console.log("Current OTP attempts for sign-in:", attempts);

    if (attempts >= MAX_ATTEMPTS) {
      console.log("Max attempts exceeded for sign-in, cleaning up");
      await db.delete(otps).where(eq(otps.id, otpRecord.id));
      return NextResponse.json(
        errorResponse("Too many failed attempts. Please request a new OTP."),
        { status: 429 },
      );
    }

    // Simple OTP comparison (no timing-safe for now to avoid complexity)
    const isValidOtp = otpRecord.otp === otp;
    console.log("OTP comparison result for sign-in:", isValidOtp);

    if (!isValidOtp) {
      console.log("Invalid OTP for sign-in, incrementing attempts");

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
    console.log("OTP is valid for sign-in, deleting record");
    await db.delete(otps).where(eq(otps.id, otpRecord.id));

    // Update user's last login timestamp (optional - you might want to add this field)
    try {
      await db
        .update(users)
        .set({
          updatedAt: new Date(), // This updates the last activity
        })
        .where(eq(users.id, user.id));
      console.log("Updated user last activity timestamp");
    } catch (updateError) {
      console.error("Failed to update user timestamp:", updateError);
      // Continue without failing the sign-in
    }

    // Generate JWT token for sign-in
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      verified: user.emailVerified,
      signInTime: Math.floor(Date.now() / 1000), // Add sign-in timestamp
    };

    console.log("Generating JWT token for sign-in with payload:", {
      userId: user.id,
      email: user.email,
      verified: user.emailVerified,
    });

    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: "Fuego App",
      subject: user.email,
    } as jwt.SignOptions);

    console.log(`Sign-in successful for email: ${email}, userId: ${user.id}`);

    return NextResponse.json(
      successResponse(
        {
          token: token,
          user: {
            email: user.email,
            emailVerified: user.emailVerified,
          },
        },
        "Sign-in successful. Welcome back!",
      ),
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Sign-in OTP verification error:", error);
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
