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

const QuickActionsWidget = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>asfasfsf</CardTitle>
        <CardDescription>sdvsdfsdfvf</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          className="w-full justify-start bg-primary hover:bg-amber-600"
          size="sm"
        >
          sdavfsdfsdf
        </Button>
        <Button variant="outline" className="w-full justify-start" size="sm">
          dsffsdfsdf
        </Button>
        <Button variant="outline" className="w-full justify-start" size="sm">
          asfasfasf
        </Button>
        <Button variant="outline" className="w-full justify-start" size="sm">
          asdfdsfsf
        </Button>
        <Button variant="outline" className="w-full justify-start" size="sm">
          asfafsdfs
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActionsWidget;
