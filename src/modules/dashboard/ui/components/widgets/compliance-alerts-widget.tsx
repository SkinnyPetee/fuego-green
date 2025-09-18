"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

const ComplianceAlertsWidget = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>asfasfsdfs</CardTitle>
        <CardDescription>Important deadlines and reminders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <div className="h-2 w-2 rounded-full bg-primary"></div>
            <div className="flex-1">
              <p className="font-medium">asfsdfsdf</p>
              <p className="text-sm text-muted-foreground">
                GSTR-1 for November 2024 - avsdvsdvdsv
              </p>
            </div>
            <Button size="sm" variant="outline">
              avdsvdsfs
            </Button>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <div className="flex-1">
              <p className="font-medium">svdsvsvs</p>
              <p className="text-sm text-muted-foreground">
                Quarterly TDS return - ascasdsdf
              </p>
            </div>
            <Button size="sm" variant="outline">
              advssdsdfv
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceAlertsWidget;
