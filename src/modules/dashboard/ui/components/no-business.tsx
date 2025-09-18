"use client";
import { Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export const NoBusiness = ({ show }: { show: boolean }) => {
  if (!show) {
    return <></>;
  }

  return (
    <>
      <div className="p-4 bg-white">
        <div className="rounded-lg bg-gradient-to-r from-primary to-primary/60 p-6 text-white">
          <h1 className="text-2xl font-bold">Welcome User!</h1>
          <p className="text-primary-foreground">
            Get started by creating your default business
          </p>
        </div>
        <div className="m-4 md:m-20 flex justify-center items-center">
          <div className="flex flex-col items-center gap-2">
            <Building2 className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">No businesses found</p>
            <Button asChild>
              <Link href="/businesses/new">Add your first business</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
