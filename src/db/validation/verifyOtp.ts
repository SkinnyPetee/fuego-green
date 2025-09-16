import { z } from "zod";

export const verifyOtpSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  otp: z.string().length(6),
});