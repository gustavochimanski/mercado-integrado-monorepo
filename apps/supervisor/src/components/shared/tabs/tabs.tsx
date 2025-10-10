"use client";

import { useDraggableScroll } from "@supervisor/utils/effects/useDraggableScroll";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import React, { useState } from "react";
import { cn } from "@supervisor/lib/utils";

interface TabItemBase {
  value: string;
  label: React.ReactNode;
}

export interface TabItemWithComponent extends TabItemBase {
  Component: () => React.ReactNode; // usado no client (dinâmico)
}

export interface TabItemWithContent extends TabItemBase {
  content: React.ReactNode; // usado no server (estático)
}

export type TabItem = TabItemWithComponent | TabItemWithContent;

interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  containerClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

const Tabs: React.FC<TabsProps> = ({
  items,
  defaultValue,
  containerClassName,
  triggerClassName,
  contentClassName,
}) => {
  const {
    scrollRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    moved,
  } = useDraggableScroll();

  const [activeTab, setActiveTab] = useState(defaultValue || items[0].value);

  const activeItem = items.find((item) => item.value === activeTab);

  return (
    <TabsPrimitive.Root
      defaultValue={defaultValue || items[0].value}
      onValueChange={setActiveTab}
      className={cn("flex flex-col h-full w-full border border-input", containerClassName)}
    >
      <TabsPrimitive.List
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        className={cn(
          "flex w-full overflow-x-auto flex-nowrap scrollbar-hide bg-muted text-muted-foreground rounded-xl",
          triggerClassName
        )}
        style={{ cursor: moved.current ? "grabbing" : "grab" }}
      >
        {items.map((item) => (
          <TabsPrimitive.Trigger
            key={item.value}
            value={item.value}
            className={cn(
              "hover:bg-background h-10 rounded-t-xl px-5 text-xs font-bold whitespace-nowrap text-center",
              "data-[state=active]:text-primary data-[state=active]:bg-card data-[state=active]:border-b-2 border-none"
            )}
          >
            {item.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>

      <div className="flex-1 overflow-hidden">
        {activeItem && (
          <TabsPrimitive.Content
            key={activeItem.value}
            value={activeItem.value}
            className={cn("h-full w-full overflow-auto p-4 bg-background", contentClassName)}
          >
            {"Component" in activeItem
              ? activeItem.Component()
              : activeItem.content}
          </TabsPrimitive.Content>
        )}
      </div>
    </TabsPrimitive.Root>
  );
};

export default Tabs;
