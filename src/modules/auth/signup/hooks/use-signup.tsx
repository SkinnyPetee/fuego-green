import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Define schemas for each step
const basicInfoSchema = z.object({
  email: z.email("Invalid email address"),
});

const otpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});

const additionalInfoSchema = z
  .object({
    accountType: z.enum(["individual", "business"], {
      message: "Please select an account type",
    }),
    organizationName: z.string().optional(), // Optional field
    organizationType: z.string().optional(), // Optional field
    title: z.enum(["mr", "ms", "mrs", "dr", "prof"], {
      message: "Please select a title",
    }),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    address: z.string().min(1, "Address is required"),
    contactMedium: z.enum(["email", "phone"], {
      message: "Please select a contact medium",
    }),
    phoneNumber: z
      .string()
      .min(10, "Phone number must be 10 digits")
      .max(10, "Phone number must be 10 digits"),
  })
  .superRefine((data, ctx) => {
    if (data.accountType === "business") {
      if (!data.organizationName || data.organizationName.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Organization name is required for business accounts",
          path: ["organizationName"],
        });
      }
      if (!data.organizationType || data.organizationType.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Organization type is required for business accounts",
          path: ["organizationType"],
        });
      }
    }
  });

export type BasicInfoValues = z.infer<typeof basicInfoSchema>;
export type OtpValues = z.infer<typeof otpSchema>;
export type AdditionalInfoValues = z.infer<typeof additionalInfoSchema>;

export function useSignupForm() {
  const basicInfoForm = useForm<BasicInfoValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const otpForm = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
    mode: "onChange",
  });

  const additionalInfoForm = useForm<AdditionalInfoValues>({
    resolver: zodResolver(additionalInfoSchema),
    defaultValues: {
      accountType: "business",
      organizationName: "",
      organizationType: "",
      title: "mr",
      firstName: "",
      lastName: "",
      address: "",
      contactMedium: "email",
      phoneNumber: "",
    },
    mode: "onChange",
  });

  return {
    basicInfoForm,
    otpForm,
    additionalInfoForm,
  };
}
