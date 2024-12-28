"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type ViewType } from "@/types/view";

interface ViewLayoutProps {
  title: string;
  actions?: ReactNode;
  viewType: ViewType;
  onViewTypeChange: (type: ViewType) => void;
  children: ReactNode;
  className?: string;
}

const viewTypes: { label: string; value: ViewType }[] = [
  { label: "概要", value: "overview" },
  { label: "リスト", value: "list" },
  { label: "ボード", value: "board" },
  { label: "タイムライン", value: "timeline" },
  { label: "ガント", value: "gantt" },
  { label: "カレンダー", value: "calendar" },
];

export function ViewLayout({
  title,
  actions,
  viewType,
  onViewTypeChange,
  children,
  className,
}: ViewLayoutProps) {
  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {actions}
      </div>
      <div className="border-b px-6">
        <Tabs
          value={viewType}
          onValueChange={(v) => onViewTypeChange(v as ViewType)}
        >
          <TabsList>
            {viewTypes.map((type) => (
              <TabsTrigger key={type.value} value={type.value}>
                {type.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="flex-1 overflow-auto p-6">{children}</div>
    </div>
  );
}
