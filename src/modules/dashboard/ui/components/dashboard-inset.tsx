"use client";
import { Bell, ChevronDown, Search, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import Logo from "@/modules/commons/ui/components/logo";

//import { logout } from "@/modules/auth/login/actions";

//import { useRouter } from "@/i18n/navigation";
//import { useUserContext } from "@/modules/auth/user/ui/auth-wrapper";

const DashboardInset = ({ children }: { children: React.ReactNode }) => {
  // const router = useRouter();
  // const ctx = useUserContext();
  return (
    <>
      <SidebarInset>
        {/* Header/Navbar */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b  px-4 bg-white">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />

          {/* Logo for mobile */}
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center gap-2 lg:hidden">
              <div className="flex aspect-square size-6 items-center justify-center rounded bg-primary text-white">
                <span className="text-xs font-bold">F</span>
              </div>
              {/* <span className="font-semibold">BizManager</span> */}
            </div>

            <div className="lg:flex items-center gap-2 hidden">
              <Logo />
              {/* <span className="font-semibold">BizManager</span> */}
            </div>

            {/* Search - Desktop only */}
            <div className="hidden lg:flex md:flex-1 items-center gap-2 px-3">
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="asdasfdsdf"
                  className="pl-8"
                />
              </div>
            </div>

            {/* Right side navigation */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary text-[10px] font-medium text-white flex items-center justify-center">
                  3
                </span>
              </Button>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="/placeholde.svg?height=32&width=32"
                        alt="Profile"
                      />
                      <AvatarFallback className="bg-primary text-white">
                        short name
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-medium">
                        {/* {ctx.user?.firstName} */}firstname
                      </span>
                      <span className="text-xs text-muted-foreground">
                        role
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>Company Settings</DropdownMenuItem>
                  <DropdownMenuItem>Billing & Subscription</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Help & Support</DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => {
                      //logout();
                      //router.push("/login");
                    }}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Mobile Search - Below navbar */}
        <div className="lg:hidden border-b bg-white p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="search"
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>

        {/* Draggable Dashboard Content */}
        {/* <DraggableDashboard data={data} /> */}
        <div className="p-4 md:p-6 min-h-[calc(100vh-4rem)] bg-white">
          {children}
        </div>
      </SidebarInset>
    </>
  );
};

export default DashboardInset;
