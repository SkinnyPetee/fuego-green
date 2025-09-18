/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type * as React from "react";

import {
  Building2,
  Calculator,
  ChevronRight,
  FileText,
  Home,
  Package,
  Receipt,
  Settings,
  TrendingUp,
  UserRoundPen,
  Users,
  Wallet,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import Link from "next/link";
import BusinessSelector from "@/modules/dashboard/ui/components/businessSelector";
import { useSidebarLayoutData } from "./SidebarData";

const data = {
  navMain: [
    {
      titleKey: "Dashboard",
      url: "#",
      icon: Home,
      isActive: true,
    },
    {
      titleKey: "Businesses",
      url: "/businesses",
      icon: Building2,
      items: [
        { titleKey: "All Businesses", url: "/businesses" },
        { titleKey: "Create Business", url: "/businesses/new" },
        //{ titleKey: "businesses.edit_business", url: "/businesses/edit" },
        {
          titleKey: "businesses.resources.title",
          url: "/resources/businesses",
          items: [
            {
              titleKey: "businesses.resources.all_resources",
              url: "/resources/businesses",
            },
            {
              titleKey: "businesses.resources.create_resource",
              url: "/resources/new/businesses",
            },
            {
              titleKey: "businesses.resources.edit_resource",
              url: "/resources/edit/businesses",
            },
          ],
        },
      ],
    },
    {
      titleKey: "gst_management.title",
      url: "#",
      icon: Calculator,
      items: [
        { titleKey: "gst_management.gst_filing", url: "#" },
        { titleKey: "gst_management.gst_returns", url: "#" },
        { titleKey: "gst_management.input_tax_credit", url: "#" },
        { titleKey: "gst_management.gst_reports", url: "#" },
      ],
    },
    {
      titleKey: "invoicing.title",
      url: "#",
      icon: Receipt,
      items: [
        { titleKey: "invoicing.create_invoice", url: "#" },
        { titleKey: "invoicing.invoice_templates", url: "#" },
        { titleKey: "invoicing.recurring_invoices", url: "#" },
        { titleKey: "invoicing.payment_tracking", url: "#" },
      ],
    },
    {
      titleKey: "inventory.title",
      url: "#",
      icon: Package,
      items: [
        {
          titleKey: "inventory.products.title",
          url: "#",
          items: [
            { titleKey: "inventory.products.all_products", url: "/products" },
            {
              titleKey: "inventory.products.create_product",
              url: "/products/new",
            },
            {
              titleKey: "inventory.products.edit_products",
              url: "/products/edit",
            },
          ],
        },
        { titleKey: "inventory.stock_management", url: "#" },
        {
          titleKey: "inventory.purchase_orders.title",
          url: "#",
          items: [
            {
              titleKey: "inventory.purchase_orders.all_purchase_orders",
              url: "/purchase-orders",
            },
            {
              titleKey: "inventory.purchase_orders.create_purchase_order",
              url: "/purchase-orders/new",
            },
            {
              titleKey: "inventory.purchase_orders.edit_purchase_orders",
              url: "/purchase-orders/edit",
            },
          ],
        },
        {
          titleKey: "inventory.suppliers.title",
          url: "#",
          items: [
            {
              titleKey: "inventory.suppliers.all_suppliers",
              url: "/suppliers",
            },
            {
              titleKey: "inventory.suppliers.create_supplier",
              url: "/suppliers/new",
            },
            {
              titleKey: "inventory.suppliers.edit_supplier",
              url: "/suppliers/edit",
            },
          ],
        },
      ],
    },
    {
      titleKey: "customers.title",
      url: "#",
      icon: Users,
      items: [
        { titleKey: "customers.customer_list", url: "#" },
        { titleKey: "customers.customer_groups", url: "#" },
        { titleKey: "customers.credit_management", url: "#" },
      ],
    },
    {
      titleKey: "financial_reports.title",
      url: "#",
      icon: TrendingUp,
      items: [
        { titleKey: "financial_reports.profit_loss", url: "#" },
        { titleKey: "financial_reports.balance_sheet", url: "#" },
        { titleKey: "financial_reports.cash_flow", url: "#" },
        { titleKey: "financial_reports.tax_reports", url: "#" },
      ],
    },
    {
      titleKey: "compliance.title",
      url: "#",
      icon: FileText,
      items: [
        { titleKey: "compliance.tds_returns", url: "#" },
        { titleKey: "compliance.esi_pf", url: "#" },
        { titleKey: "compliance.annual_filings", url: "#" },
        { titleKey: "compliance.audit_trail", url: "#" },
      ],
    },
    {
      titleKey: "banking.title",
      url: "#",
      icon: Wallet,
      items: [
        { titleKey: "banking.bank_accounts", url: "#" },
        { titleKey: "banking.reconciliation", url: "#" },
        { titleKey: "banking.payment_gateway", url: "#" },
      ],
    },
  ],
  settings: [
    { titleKey: "settings.company_profile", url: "#", icon: UserRoundPen },
    { titleKey: "settings.settings", url: "#", icon: Settings },
  ],
};

type SidebarProps = React.ComponentProps<typeof Sidebar>;

export function DashboardSidebar({ ...props }: SidebarProps) {
  //const t = useTranslations("dash-sidebar");
  //const BusinessesContext = useSidebarLayoutData();

  // Recursive function to render menu items with nested dropdowns

  const renderMenuItems = (items: any[]) => {
    return items.map((item) => (
      <Collapsible
        key={item.titleKey}
        asChild
        // defaultOpen={
        //   item.title === "GST Management" || item.title === "Inventory"
        // }
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={item.titleKey} isActive={item.isActive}>
              {item.icon && <item.icon />}
              <span>{item.titleKey}</span>
              {item.items && (
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              )}
            </SidebarMenuButton>
          </CollapsibleTrigger>
          {item.items?.length ? (
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items.map((subItem: any) => (
                  <SidebarMenuSubItem key={subItem.titleKey}>
                    {subItem.items ? (
                      // Nested dropdown for items with sub-items (like Products)
                      <Collapsible asChild className="group/nested-collapsible">
                        <div>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuSubButton className="w-full">
                              <span>{subItem.titleKey}</span>
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/nested-collapsible:rotate-90" />
                            </SidebarMenuSubButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub className="ml-4">
                              {subItem.items.map((nestedItem: any) => (
                                <SidebarMenuSubItem key={nestedItem.titleKey}>
                                  <SidebarMenuSubButton asChild>
                                    <Link href={nestedItem.url}>
                                      <span>{nestedItem.titleKey}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    ) : (
                      // Regular sub-item without nested dropdown
                      <SidebarMenuSubButton asChild>
                        <Link href={subItem.url}>
                          <span>{subItem.titleKey}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    )}
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          ) : null}
        </SidebarMenuItem>
      </Collapsible>
    ));
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* <BusinessSelector
        businesses={BusinessesContext.businesses || []}
        onBusinessSelect={BusinessesContext.onBusinessSelect}
        selectedBusinessID={BusinessesContext.selectedBusinessID}
      /> */}
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel>Business Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderMenuItems(data.navMain)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {data.settings.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton asChild tooltip={item.titleKey}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.titleKey}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
