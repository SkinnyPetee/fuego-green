export const resendOtp = async (data: { email: string }) => {
  const response = await fetch(`/api/v1/auth/resend-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: data.email,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Failed to resend OTP. Please try again."
    );
  }

  return response.json();
};
