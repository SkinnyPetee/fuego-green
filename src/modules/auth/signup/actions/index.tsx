export type TRegisterData = {
  email: string;
  accountType: string;
  title: string;
  firstName: string;
  lastName: string;
  address: string;
  contactMedium: string;
  phoneNumber: string;
  organizationName?: string;
  organizationType?: string;
};

// services/auth.ts
export const sendOtp = async (data: { email: string }) => {
  const response = await fetch(`/api/v1/auth/send-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: data.email }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `Couldn't send otp, Please try again.`
    );
  }

  return response.json();
};

export const verifyOtp = async (data: { email: string; otp: string }) => {
  const response = await fetch(`api/v1/auth/verify-otp`, {
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
    throw new Error(
      errorData.message || `Couldn't verify otp, Please try again.`
    );
  }

  return response.json();
};

// export const register = async (data: TRegisterData & { token: string }) => {
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_API_BASE_URL}/account`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${data.token}`,
//       },
//       body: JSON.stringify({
//         email: data.email,
//         accountType: data.accountType,
//         title: data.title,
//         firstName: data.firstName,
//         lastName: data.lastName,
//         address: data.address,
//         contactMedium: data.contactMedium,
//         phoneNumber: data.phoneNumber,
//         organizationType: data.organizationType,
//         organizationName: data.organizationName,
//       }),
//     }
//   );

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(
//       errorData.message || `Registration failed, Please try again.`
//     );
//   }

//   return response.json();
// };
