"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
// import { useTranslations } from "next-intl";
import { useState, useEffect, useMemo } from "react";
import { Building2, ChevronDown, ChevronUp } from "lucide-react";
import { TBusinessData } from "../../../businesses/actions";
import { toast } from "sonner";

type TProps = {
  businesses: TBusinessData[] | undefined | null; // Allow undefined/null for robustness
  onBusinessSelect: (business: TBusinessData) => void;
  selectedBusinessID: string | undefined | null;
};

const BusinessSelector = ({
  businesses = [], // Default to empty array
  onBusinessSelect,
  selectedBusinessID,
}: TProps) => {
  const [selectedBusiness, setSelectedBusiness] = useState<
    TBusinessData | undefined
  >(undefined);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Ensure businesses is an array
  const safeBusinesses = useMemo(() => {
    return Array.isArray(businesses) ? businesses : [];
  }, [businesses]);

  // Update selectedBusiness when businesses or selectedBusinessID changes
  useEffect(() => {
    if (safeBusinesses.length > 0) {
      if (selectedBusinessID) {
        const foundBusiness = safeBusinesses.find(
          (b) => b.businessID === selectedBusinessID
        );
        setSelectedBusiness(foundBusiness || safeBusinesses[0]);
      } else {
        setSelectedBusiness(safeBusinesses[0]); // Default to first business
      }
    } else {
      setSelectedBusiness(undefined); // No businesses available
    }
  }, [safeBusinesses, selectedBusinessID]);

  const handleSelectChange = (businessID: string) => {
    const selected = safeBusinesses.find((b) => b.businessID === businessID);
    if (selected) {
      setSelectedBusiness(selected);
      toast.success(`You selected ${selected.businessName} business.`);
      onBusinessSelect(selected);
    }
  };

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger
              asChild
              disabled={safeBusinesses.length === 0} // Disable if no businesses
            >
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-white">
                  <Building2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {safeBusinesses.length > 0
                      ? selectedBusiness?.businessName || "No Business Selected"
                      : "No Business Created"}
                  </span>
                </div>
                <div className="ml-auto flex flex-col items-center">
                  <ChevronUp className="size-3" />
                  <ChevronDown className="size-3 -mt-1" />
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side="bottom"
              align="start"
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                current-business
              </DropdownMenuLabel>
              <div className="px-2 py-1.5">
                <div className="font-medium">
                  {selectedBusiness?.businessName || "no-business-selected"}
                </div>
              </div>
              {safeBusinesses.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    switch-business
                  </DropdownMenuLabel>
                  {safeBusinesses.map((business) => (
                    <DropdownMenuItem
                      key={business.businessID}
                      onClick={() => handleSelectChange(business.businessID)}
                      className="gap-2 p-2"
                    >
                      <div className="flex size-6 items-center justify-center rounded-sm border bg-primary text-white">
                        <Building2 className="size-3" />
                      </div>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                          {business.businessName}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};

export default BusinessSelector;
