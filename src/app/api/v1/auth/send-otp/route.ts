// app/api/v1/auth/send-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { otps } from "@/db/schema"; // you need an otps table

import { successResponse, errorResponse } from "@/lib/apiResponse";
import { nodemailer_transporter } from "@/lib/nodemailer";
import { formatZodErrors, sendOtpSchema } from "@/db/validation/sendOtp";
import { canSendOtp, cleanupExpiredOtps, generateOtp } from "@/util/otp";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = sendOtpSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors = formatZodErrors(parsed.error.issues);
      return NextResponse.json(
        errorResponse("Validation failed", fieldErrors),
        { status: 400 },
      );
    }

    const email = parsed.data.email;

    await cleanupExpiredOtps();

    const rate = await canSendOtp(email);
    if (!rate.allowed) {
      return NextResponse.json(errorResponse(rate.message), { status: 429 });
    }

    const otp = generateOtp();

    // store in DB (replace with your schema)
    await db.insert(otps).values({
      email: parsed.data.email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min expiry
      sentAt: new Date(),
    });

    // send email (example with nodemailer)

    await nodemailer_transporter.sendMail({
      from: `Fuego App <team@fuego.com>`,
      to: email,
      subject: "Your New OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your New OTP Code</h2>
          <p>You requested a OTP code. Here it is:</p>
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

    return NextResponse.json(successResponse(null, "OTP sent successfully"), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(errorResponse("Failed to send OTP"), {
      status: 500,
    });
  }
}
