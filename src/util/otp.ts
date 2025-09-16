import { db } from "@/db/drizzle";
import { otps } from "@/db/schema";
import { eq, lt, desc } from "drizzle-orm";

// Generate 6-digit OTP
export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Cleanup expired OTPs
export async function cleanupExpiredOtps() {
  const now = new Date();
  await db.delete(otps).where(lt(otps.expiresAt, now));
}

// Check rate-limit: max 1 OTP per minute, max 5 per hour
export async function canSendOtp(email: string) {
  const now = new Date();
  const oneMinuteAgo = new Date(now.getTime() - 1 * 60 * 1000);
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  const recentOtps = await db.select().from(otps)
    .where(eq(otps.email, email))
    .orderBy(desc(otps.sentAt));

  const lastOtp = recentOtps[0];
  const lastHourOtps = recentOtps.filter(o => o.sentAt > oneHourAgo);

  if (lastOtp && lastOtp.sentAt > oneMinuteAgo) {
    return { allowed: false, message: "You can request a new OTP after 1 minute" };
  }

  if (lastHourOtps.length >= 5) {
    return { allowed: false, message: "You have exceeded 5 OTPs per hour" };
  }

  return { allowed: true };
}
