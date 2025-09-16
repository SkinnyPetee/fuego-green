// lib/apiResponse.ts
export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>; // field-level errors (from Zod, etc.)
};

export function successResponse<T>(data: T, message = "Success"): ApiResponse<T> {
  return { success: true, message, data };
}

export function errorResponse(message = "Something went wrong", errors?: Record<string, string>): ApiResponse {
  return { success: false, message, errors };
}
