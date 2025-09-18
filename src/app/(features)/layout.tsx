import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardInset from "@/modules/dashboard/ui/components/dashboard-inset";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboarddnd-sidebar";
//import SidebarDataFetcher from "@/modules/dashboard/ui/components/SidebarDataFetcher";
import ClientAuthWrapper from "@/modules/auth/user/ui/provider/client-auth-wrapper";

type TProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: TProps) {
  return (
    <>
      <ClientAuthWrapper unprotectedRoutes={["/login", "/register", "/"]}>
        {/* <SidebarDataFetcher> */}
        <SidebarProvider>
          <DashboardSidebar />
          <DashboardInset>{children}</DashboardInset>
        </SidebarProvider>
        {/* </SidebarDataFetcher> */}
      </ClientAuthWrapper>
    </>
  );
}
