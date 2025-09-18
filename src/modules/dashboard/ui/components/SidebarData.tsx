// app/DataContext.tsx
"use client";

import { createContext, useContext } from "react";
import { TBusinessData } from "../../../businesses/actions";

// Define the context shape
interface DataContextType {
  businesses: TBusinessData[] | undefined;
  selectedBusinessID: string | null | undefined;
  onBusinessSelect: (business: TBusinessData) => void;
  authDetails: TAuthDetails;
}

export type TAuthDetails = {
  accountId: string | null;
  token: string | null;
  isLoaded: boolean;
};

// Create the context with an initial undefined value
const DataContext = createContext<DataContextType | undefined>(undefined);

// DataProvider component to provide the context
export function DataProvider({
  children,
  businesses,
  selectedBusinessID,
  onBusinessSelect = () => {},
  authDetails, // Default to no-op function
}: {
  children: React.ReactNode;
  businesses?: TBusinessData[];
  selectedBusinessID?: string | null;
  onBusinessSelect?: (business: TBusinessData) => void;
  authDetails: TAuthDetails;
}) {
  return (
    <DataContext.Provider
      value={{ businesses, selectedBusinessID, onBusinessSelect, authDetails }}
    >
      {children}
    </DataContext.Provider>
  );
}

// Custom hook to access the context
export function useSidebarLayoutData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useSidebarLayoutData must be used within a DataProvider");
  }
  return context;
}
