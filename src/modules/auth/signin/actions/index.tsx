export type LoginValid = {
  success: boolean;
  data: {
    accountID: string;
    message: string;
    token: string;
  };
};

export type LoginErrors = {
  success: boolean;
  error: string;
};

export type TLoginData = {
  emailID: string;
  otp: string;
};

export const sendOtp = async (data: { email: string }) => {
  const response = await fetch(`/api/v1/auth/send-otp`, {
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
      errorData.message || `Failed to send otp, Please try again.`
    );
  }

  return response.json();
};

export const signin = async (data: { email: string; otp: string }) => {
  const response = await fetch(`/api/v1/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: data.email,
      otp: data.otp,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Invalid Otp, Please try again.");
  }
  return response.json();
};

export const signout = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("fuego_accountId");
};
