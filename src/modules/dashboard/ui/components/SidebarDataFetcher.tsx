// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { DataProvider } from "./SidebarData";
// import { allBusiness, TBusinessData } from "../../../businesses/actions";
// import { useEffect, useState } from "react";

// export default function SidebarDataFetcher({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [authDetails, setAuthDetails] = useState<{
//     accountId: string | null;
//     token: string | null;
//     isLoaded: boolean;
//   }>({ accountId: null, token: null, isLoaded: false });

//   const [selectedBusinessID, setSelectedBusinessID] = useState<string | null>(
//     null
//   );

//   // Load auth details from localStorage on mount
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const accountId = localStorage.getItem("fuego_accountId");
//       const token = localStorage.getItem("auth_token");
//       setAuthDetails({ accountId, token, isLoaded: true });
//     }
//   }, []);

//   const {
//     data: businessData,
//     isLoading,
//     isSuccess,
//     error,
//   } = useQuery({
//     queryKey: ["businesses", "all"],
//     queryFn: () =>
//       allBusiness({
//         accountId: authDetails.accountId!,
//         token: authDetails.token!,
//       }),
//     enabled: !!authDetails.accountId && !!authDetails.token,
//   });

//   // Log businessData when query is successful
//   if (isSuccess) {
//     console.log("business data from data fetcher", businessData);
//   }

//   // Set selectedBusinessID when businessData is available
//   useEffect(() => {
//     if (isSuccess && businessData?.data?.data?.length && !selectedBusinessID) {
//       setSelectedBusinessID(businessData.data.data[0].businessID);
//     }
//   }, [businessData, isSuccess, selectedBusinessID]);

//   const handleBusinessSelect = (business: TBusinessData) => {
//     setSelectedBusinessID(business.businessID);
//   };

//   // Handle loading or uninitialized authDetails
//   if (!authDetails.isLoaded || isLoading) {
//     return <></>;
//   }

//   // Handle missing auth details
//   if (!authDetails.accountId || !authDetails.token) {
//     return <div>Please log in to view business data</div>;
//   }

//   // Handle query error
//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   // Handle case where businessData is undefined or empty
//   if (!businessData || !businessData.data?.data) {
//     return <div>No business data available</div>;
//   }

//   return (
//     <DataProvider
//       businesses={businessData.data.data}
//       selectedBusinessID={selectedBusinessID}
//       onBusinessSelect={handleBusinessSelect}
//       authDetails={authDetails}
//     >
//       {children}
//     </DataProvider>
//   );
// }
