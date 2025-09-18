"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const businessSchema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters")
    .max(100, "Business name must be less than 100 characters"),
  pan: z
    .string()
    .length(10, "PAN must be exactly 10 characters")
    .regex(
      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      "Invalid PAN format (e.g., ABCDE1234F)"
    ),
  phoneNumber: z
    .string()
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^[0-9]+$/, "Phone number must contain only digits"),
  businessEmail: z.email("Invalid email address"),
  registrationNumber: z
    .string()
    .min(1, "Registration number is required")
    .max(50, "Registration number must be less than 50 characters"),
  address: z
    .string()
    .min(1, "Address is required")
    .max(200, "Address must be less than 200 characters"),
  //   accountId: z
  //     .string()
  //     .min(1, "Account ID is required")
  //     .max(255, "Account ID must be less than 255 characters"),
  businessSize: z.string().min(1, "Business size is required"),
  tan: z
    .string()
    .length(10, "TAN must be exactly 10 characters")
    .regex(/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/, "Invalid TAN format"),
  gstin: z
    .string()
    .length(15, "GSTIN must be exactly 15 characters")
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Invalid GSTIN format"
    ),
});

export type CreateBusinessFormData = z.infer<typeof businessSchema>;

export function useCreateBusinessForm() {
  const createBusinessform = useForm<CreateBusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      businessName: "",
      pan: "",
      phoneNumber: "",
      businessEmail: "",
      registrationNumber: "",
      address: "",
      //   accountId: "",
      businessSize: "",
      tan: "",
      gstin: "",
    },
  });

  return {
    createBusinessform,
  };
}
