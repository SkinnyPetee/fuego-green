// app/api/v1/auth/resend-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { otps } from "@/db/schema";
import { eq, desc, and, gte } from "drizzle-orm";

import { successResponse, errorResponse } from "@/lib/apiResponse";
import { nodemailer_transporter } from "@/lib/nodemailer";
import { formatZodErrors, sendOtpSchema } from "@/db/validation/sendOtp";
import { cleanupExpiredOtps, generateOtp } from "@/util/otp";

// Rate limiting configuration
const RESEND_DELAY_SECONDS = 60; // 1 minute delay between resends
const MAX_RESENDS_PER_HOUR = 5; // Maximum 5 resends per hour
const MAX_RESENDS_PER_DAY = 10; // Maximum 10 resends per day

interface ResendRateLimit {
  allowed: boolean;
  message: string;
  waitTime?: number; // seconds to wait
  resendCount?: number;
}

async function canResendOtp(email: string): Promise<ResendRateLimit> {
  console.log(`Checking resend rate limit for email: ${email}`);

  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const resendDelayAgo = new Date(now.getTime() - RESEND_DELAY_SECONDS * 1000);

  try {
    // Check for recent OTP (within delay period)
    const recentOtp = await db
      .select()
      .from(otps)
      .where(and(eq(otps.email, email), gte(otps.sentAt, resendDelayAgo)))
      .orderBy(desc(otps.sentAt))
      .limit(1);

    if (recentOtp.length > 0) {
      const lastSent = recentOtp[0].sentAt;
      const timeDiff = Math.ceil(
        (RESEND_DELAY_SECONDS * 1000 - (now.getTime() - lastSent.getTime())) /
          1000,
      );
      console.log(`Recent OTP found, wait time: ${timeDiff} seconds`);

      return {
        allowed: false,
        message: `Please wait ${timeDiff} seconds before requesting another OTP.`,
        waitTime: timeDiff,
      };
    }

    // Check hourly limit
    const hourlyOtps = await db
      .select()
      .from(otps)
      .where(and(eq(otps.email, email), gte(otps.sentAt, oneHourAgo)));

    console.log(`OTPs sent in last hour: ${hourlyOtps.length}`);

    if (hourlyOtps.length >= MAX_RESENDS_PER_HOUR) {
      return {
        allowed: false,
        message: `Too many OTP requests. You can request up to ${MAX_RESENDS_PER_HOUR} OTPs per hour. Please try again later.`,
        resendCount: hourlyOtps.length,
      };
    }

    // Check daily limit
    const dailyOtps = await db
      .select()
      .from(otps)
      .where(and(eq(otps.email, email), gte(otps.sentAt, oneDayAgo)));

    console.log(`OTPs sent in last 24 hours: ${dailyOtps.length}`);

    if (dailyOtps.length >= MAX_RESENDS_PER_DAY) {
      return {
        allowed: false,
        message: `Daily OTP limit exceeded. You can request up to ${MAX_RESENDS_PER_DAY} OTPs per day. Please try again tomorrow.`,
        resendCount: dailyOtps.length,
      };
    }

    console.log(`Resend allowed for email: ${email}`);
    return {
      allowed: true,
      message: "Resend allowed",
      resendCount: dailyOtps.length,
    };
  } catch (error) {
    console.error("Error checking resend rate limit:", error);
    return {
      allowed: false,
      message: "Unable to verify rate limit. Please try again.",
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log("Resend OTP request received");

    const body = await req.json();
    console.log("Request body:", { email: body.email });

    const parsed = sendOtpSchema.safeParse(body);

    if (!parsed.success) {
      console.log("Validation failed:", parsed.error.issues);
      const fieldErrors = formatZodErrors(parsed.error.issues);
      return NextResponse.json(
        errorResponse("Validation failed", fieldErrors),
        { status: 400 },
      );
    }

    const email = parsed.data.email;
    console.log(`Processing resend OTP request for: ${email}`);

    // Clean up expired OTPs first
    await cleanupExpiredOtps();
    console.log("Expired OTPs cleaned up");

    // Check resend rate limits
    const rateLimit = await canResendOtp(email);

    if (!rateLimit.allowed) {
      console.log(`Rate limit exceeded for ${email}: ${rateLimit.message}`);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorData: any = { message: rateLimit.message };

      // Add additional info to help with UI
      if (rateLimit.waitTime) {
        errorData.waitTime = rateLimit.waitTime;
      }
      if (rateLimit.resendCount !== undefined) {
        errorData.resendCount = rateLimit.resendCount;
      }

      return NextResponse.json(errorResponse(rateLimit.message, errorData), {
        status: 429,
      });
    }

    console.log(`Rate limit check passed for ${email}, generating new OTP`);

    // Generate new OTP
    const otp = generateOtp();
    console.log(`Generated OTP for ${email}: ${otp.substring(0, 2)}****`);

    // Store new OTP in database
    const otpResult = await db
      .insert(otps)
      .values({
        email: email,
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min expiry
        sentAt: new Date(),
      })
      .returning();

    console.log(`OTP stored in database with ID: ${otpResult[0]?.id}`);

    // Send email
    console.log(`Sending resend OTP email to: ${email}`);

    await nodemailer_transporter.sendMail({
      from: `Fuego App <team@fuego.com>`,
      to: email,
      subject: "Your New OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your New OTP Code</h2>
          <p>You requested a new OTP code. Here it is:</p>
          <div style="font-size: 24px; font-weight: bold; color: #007bff; padding: 20px; background-color: #f8f9fa; border-radius: 8px; text-align: center; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #666;">
            This code will expire in <strong>5 minutes</strong>. Please use it to complete your verification.
          </p>
          <p style="color: #666; font-size: 14px;">
            If you didn't request this code, please ignore this email.
          </p>
        </div>
      `,
      text: `Your new OTP code is ${otp}. It expires in 5 minutes. If you didn't request this code, please ignore this email.`,
    });

    console.log(`Resend OTP email sent successfully to: ${email}`);

    // Get current resend count for response
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const dailyOtps = await db
      .select()
      .from(otps)
      .where(and(eq(otps.email, email), gte(otps.sentAt, oneDayAgo)));

    return NextResponse.json(
      successResponse(
        {
          email: email,
          expiresIn: 300, // 5 minutes in seconds
          resendCount: dailyOtps.length,
          maxResends: MAX_RESENDS_PER_DAY,
          nextResendAvailableIn: RESEND_DELAY_SECONDS,
        },
        "New OTP sent successfully",
      ),
      { status: 200 },
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Resend OTP error:", error);
    console.error("Error stack:", error.stack);

    // More detailed error logging in development
    if (process.env.NODE_ENV === "development") {
      console.error("Full error object:", JSON.stringify(error, null, 2));
    }

    return NextResponse.json(
      errorResponse(
        process.env.NODE_ENV === "development"
          ? `Error: ${error.message}`
          : "Failed to resend OTP. Please try again.",
      ),
      { status: 500 },
    );
  }
}
