export const resendOtp = async (data: { email: string }) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/resend-otp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
      }),
    }
  );

  return response.json();
};
