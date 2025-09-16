import { z } from "zod";

// Zod schema for send-otp
export const sendOtpSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
});

// Transform Zod issues into a simple field-error object
export function formatZodErrors(
  errors: z.core.$ZodIssue[],
): Record<string, string> {
  return errors.reduce(
    (acc, issue) => {
      const field =
        typeof issue.path[0] === "string" || typeof issue.path[0] === "number"
          ? String(issue.path[0])
          : "unknown";
      acc[field] = acc[field]
        ? `${acc[field]}, ${issue.message}`
        : issue.message;
      return acc;
    },
    {} as Record<string, string>,
  );
}
