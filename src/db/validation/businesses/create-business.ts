import z from "zod";

export const createBusinessSchema = z.object({
  businessName: z.string().min(2),
  registrationNumber: z.string().min(1),
  businessEmail: z.email(),
  address: z.string().min(2),
  accountId: z.uuid(),
  businessSize: z.enum(["small", "medium", "large", "enterprise"]),
  pan: z.string().length(10),
  tan: z.string().length(10),
  gstin: z.string().length(15),
  phoneNumber: z.string().regex(/^[0-9]{10}$/),
});
