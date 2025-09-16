import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Define schemas for each step
const emailSchema = z.object({
  email: z.email("Invalid email address"),
});

const otpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});

// Define form value types
export type EmailValues = z.infer<typeof emailSchema>;
export type OtpValues = z.infer<typeof otpSchema>;

export function useSigninForm() {
  const emailForm = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const otpForm = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  return {
    emailForm,
    otpForm,
  };
}
