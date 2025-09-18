export type TMe = {
  user: {
    email: string;
    emailVerified: boolean;
    accountVerified: boolean;
  };
  account: {
    id: string;
    accountType: "individual" | "business";
    firstName: string;
    lastName: string;
    phoneNumber: string;
    contactMedium: "email" | "phone";
  };
};

export const me = async (data: { token: string }) => {
  const response = await fetch(`/api/v1/user/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "User not found");
  }

  return await response.json();
};
