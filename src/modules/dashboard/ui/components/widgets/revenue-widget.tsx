"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

const RevenueWidget = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">vzxdvxcv</CardTitle>
        <span className="text-2xl">₹</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">₹12,45,678</div>
        <p className="text-xs text-muted-foreground">+20.1% asdgfsdgdf</p>
      </CardContent>
    </Card>
  );
};

export default RevenueWidget;
