"use client";

import { createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { me, TMe } from "@/modules/auth/user/actions";

interface ClientAuthWrapperProps {
  children: React.ReactNode;
  unprotectedRoutes?: string[];
}

interface UserContextType {
  user: TMe | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export default function ClientAuthWrapper({
  children,
  unprotectedRoutes = [],
}: ClientAuthWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isUnprotectedRoute = unprotectedRoutes.includes(pathname);

  const {
    data: usersAccountData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("No auth token found");
      return me({ token });
    },
    enabled: !isUnprotectedRoute,
    retry: false,
  });

  // Derive authentication state
  const isAuthenticated = isUnprotectedRoute
    ? true
    : !!usersAccountData?.data && !error;

  // Redirect immediately if not authenticated on protected routes
  if (!isUnprotectedRoute && !isLoading && !isAuthenticated) {
    router.push("/signin");
    return null;
  }

  // Still loading? Don’t render dashboard yet
  if (isLoading) {
    return <></>; // or your <LoadingScreen />
  }

  return (
    <UserContext.Provider
      value={{
        user: usersAccountData?.data ?? null,
        isAuthenticated,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
