export type TBusinessData = {
  businessID: string;
  businessName: string;
};

export type TCreateBusinessData = {
  businessName: string;
  registrationNumber: string;
  businessEmail: string;
  address: string;
  accountId: string;
  businessSize: string;
  pan: string;
  tan: string;
  gstin: string;
  phoneNumber: string;
};

export const createBusiness = async (
  data: TCreateBusinessData & {
    accountId: string;
    token: string;
  }
) => {
  const response = await fetch(`/api/v1/businesses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.token}`,
    },
    body: JSON.stringify({
      businessName: data.businessName,
      registrationNumber: data.registrationNumber,
      businessEmail: data.businessEmail,
      address: data.address,
      accountId: data.accountId,
      businessSize: data.businessSize,
      pan: data.pan,
      tan: data.tan,
      gstin: data.gstin,
      phoneNumber: data.phoneNumber,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw Error(errorData.error || "Oops! Something went wrong");
  }

  return response.json();
};
