"use client";

import type React from "react";
import { useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import RevenueWidget from "./widgets/revenue-widget";
import GSTWidget from "./widgets/gst-widget";
import InvoicesWidget from "./widgets/invoices-widget";
import StockWidget from "./widgets/stock-widget";
import RecentInvoiceskWidget from "./widgets/recent-invoices-widget";
import QuickActionsWidget from "./widgets/quick-actions-widget";
import ComplianceAlertsWidget from "./widgets/compliance-alerts-widget";
import WelcomeWidget from "./widgets/welcome-widget";
import { TBusinessData } from "@/modules/businesses/actions";
import { NoBusiness } from "@/modules/dashboard/ui/components/no-business";
//import { useUserContext } from "@/modules/auth/user/ui/auth-wrapper";

// Widget types
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

// Available widgets to add
const availableWidgets: Omit<Widget, "id">[] = [
  { type: "revenue", title: "Total Revenue", gridCols: 1 },
  { type: "gst", title: "Pending GST", gridCols: 1 },
  { type: "invoices", title: "Outstanding Invoices", gridCols: 1 },
  { type: "stock", title: "Low Stock Items", gridCols: 1 },
  { type: "recent-invoices", title: "Recent Invoices", gridCols: 1 },
  { type: "quick-actions", title: "Quick Actions", gridCols: 1 },
  { type: "compliance-alerts", title: "Compliance Alerts", gridCols: 2 },
];

// Widget content components
const WidgetContent: React.FC<{ widget: Widget }> = ({ widget }) => {
  switch (widget.type) {
    case "revenue":
      return <RevenueWidget />;

    case "gst":
      return <GSTWidget />;

    case "invoices":
      return <InvoicesWidget />;

    case "stock":
      return <StockWidget />;

    case "recent-invoices":
      return <RecentInvoiceskWidget />;

    case "quick-actions":
      return <QuickActionsWidget />;

    case "compliance-alerts":
      return <ComplianceAlertsWidget />;

    case "welcome":
      return <WelcomeWidget />;

    default:
      return <div>unknown widget</div>;
  }
};

// Draggable widget wrapper
const DraggableWidget: React.FC<{
  widget: Widget;
  onRemove: (id: string) => void;
}> = ({ widget, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${
        widget.gridCols === 2 ? "md:col-span-2" : ""
      }`}
    >
      {/* Drag handle and remove button */}
      <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="h-6 w-6 bg-white/90 hover:bg-white"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Drag n Drop</p>
          </TooltipContent>
        </Tooltip>

        <Button
          variant="destructive"
          size="icon"
          className="h-6 w-6"
          onClick={() => onRemove(widget.id)}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      <WidgetContent widget={widget} />
    </div>
  );
};

// Add widget dialog
const AddWidgetDialog: React.FC<{
  widgets: Widget[];
  onAddWidget: (widget: Omit<Widget, "id">) => void;
}> = ({ widgets, onAddWidget }) => {
  const [open, setOpen] = useState(false);

  const existingTypes = widgets.map((w) => w.type);
  const availableToAdd = availableWidgets.filter(
    (w) => !existingTypes.includes(w.type)
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-amber-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Widget
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>asfasfcsd</DialogTitle>
          <DialogDescription>asfasfasf</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          {availableToAdd.map((widget) => (
            <Button
              key={widget.type}
              variant="outline"
              className="justify-start"
              onClick={() => {
                onAddWidget(widget);
                setOpen(false);
              }}
            >
              {widget.title}
            </Button>
          ))}
          {availableToAdd.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              avssdvsvsf
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

type TProps = {
  data: TBusinessData[];
};

// Main draggable dashboard component
export const DraggableDashboard: React.FC<TProps> = ({ data }) => {
  return <>{data.length === 0 ? <NoBusiness show /> : <DashboardContent />}</>;
};

const DashboardContent = () => {
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: "revenue", type: "revenue", title: "Total Revenue", gridCols: 1 },
    { id: "gst", type: "gst", title: "Pending GST", gridCols: 1 },
    {
      id: "invoices",
      type: "invoices",
      title: "Outstanding Invoices",
      gridCols: 1,
    },
    { id: "stock", type: "stock", title: "Low Stock Items", gridCols: 1 },
    {
      id: "recent-invoices",
      type: "recent-invoices",
      title: "Recent Invoices",
      gridCols: 1,
    },
    {
      id: "quick-actions",
      type: "quick-actions",
      title: "Quick Actions",
      gridCols: 1,
    },
    {
      id: "compliance-alerts",
      type: "compliance-alerts",
      title: "Compliance Alerts",
      gridCols: 2,
    },
  ]);

  //const ctx = useUserContext();

  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  };

  const handleRemoveWidget = (id: string) => {
    setWidgets((items) => items.filter((item) => item.id !== id));
  };

  const handleAddWidget = (widget: Omit<Widget, "id">) => {
    const newWidget: Widget = {
      ...widget,
      id: `${widget.type}-${Date.now()}`,
    };
    setWidgets((items) => [...items, newWidget]);
  };

  const activeWidget = widgets.find((widget) => widget.id === activeId);
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Fixed Welcome Section - Full Width, Unremovable, Undraggable */}
      <div className="rounded-lg bg-gradient-to-r from-primary to-primary/50 p-6 text-white">
        <h1 className="text-2xl font-bold">
          {/* {ctx.user?.firstName} {ctx.user?.lastName} */}
        </h1>
        <p className="text-amber-100">sacascs</p>
      </div>

      {/* Add Widget Button */}
      <div className="flex justify-end">
        <AddWidgetDialog widgets={widgets} onAddWidget={handleAddWidget} />
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={widgets.map((w) => w.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {widgets.map((widget) => (
              <DraggableWidget
                key={widget.id}
                widget={widget}
                onRemove={handleRemoveWidget}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeWidget ? (
            <div className={activeWidget.gridCols === 2 ? "md:col-span-2" : ""}>
              <WidgetContent widget={activeWidget} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
