import { z } from "zod";

// Validation schema
export const createAccountSchema = z
  .object({
    accountType: z.enum(["individual", "business"]),
    organizationName: z.string().optional(),
    organizationType: z
      .enum([
        "corporation",
        "llc",
        "partnership",
        "sole proprietorship",
        "non-profit",
        "other",
      ])
      .optional(),
    title: z.enum(["mr", "ms", "mrs", "dr", "prof", "other"]),
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name too long"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name too long"),
    address: z
      .string()
      .min(10, "Address must be at least 10 characters")
      .max(500, "Address too long"),
    phoneNumber: z
      .string()
      .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
    contactMedium: z.enum(["email", "phone"]),
  })
  .refine(
    (data) => {
      // Business accounts must have organization details
      if (data.accountType === "business") {
        return data.organizationName && data.organizationType;
      }
      return true;
    },
    {
      message: "Organization name and type are required for business accounts",
      path: ["organizationName", "organizationType"],
    },
  );
