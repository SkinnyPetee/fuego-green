"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type WidgetType =
  | "revenue"
  | "gst"
  | "invoices"
  | "stock"
  | "recent-invoices"
  | "quick-actions"
  | "compliance-alerts"
  | "welcome";

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  gridCols: number;
}

const RecentInvoiceskWidget = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>saddsfdsf</CardTitle>
        <CardDescription>asfasfsdf</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">INV-2024-001</p>
            <p className="text-sm text-muted-foreground">Acme Corp Ltd.</p>
          </div>
          <div className="text-right">
            <p className="font-medium">₹25,000</p>
            <p className="text-sm text-green-600">Paid</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">INV-2024-002</p>
            <p className="text-sm text-muted-foreground">Tech Solutions Pvt.</p>
          </div>
          <div className="text-right">
            <p className="font-medium">₹18,500</p>
            <p className="text-sm text-amber-600">Pending</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">INV-2024-003</p>
            <p className="text-sm text-muted-foreground">Global Enterprises</p>
          </div>
          <div className="text-right">
            <p className="font-medium">₹32,750</p>
            <p className="text-sm text-red-600">Overdue</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentInvoiceskWidget;
