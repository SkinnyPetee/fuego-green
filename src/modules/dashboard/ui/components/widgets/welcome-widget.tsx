import React from "react";

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

const WelcomeWidget = () => {
  return (
    <div className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
      <h1 className="text-2xl font-bold">Welcome back, Rajesh!</h1>
      <p className="text-amber-100">
        {"Here's what's happening with your business today."}
      </p>
    </div>
  );
};

export default WelcomeWidget;
