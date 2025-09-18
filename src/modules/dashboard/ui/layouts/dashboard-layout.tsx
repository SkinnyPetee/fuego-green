"use client";

//import { useSidebarLayoutData } from "@/modules/dashboard/ui/components/SidebarData";
//import { BusinessSidebar } from "../components/dashboarddnd-sidebar";
import { DraggableDashboard } from "@/modules/dashboard/ui/components/dashboard";

export default function Dashboard() {
  // const t = useTranslations("dash-layout");
  //const { businesses } = useSidebarLayoutData();

  //return <DraggableDashboard data={(businesses && businesses) || []} />;

  return <DraggableDashboard data={[]} />;
}
