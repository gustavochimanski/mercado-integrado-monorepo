// components/Shared/ui/tabs/index.tsx (ou onde está teu Tabs)
"use client";

import { cn } from "@cardapio/lib/utils";
import { useDraggableScroll } from "@cardapio/utils/effects/useDraggableScroll";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import React, { useMemo, useState } from "react";

interface TabItemBase {
  value: string;
  label: React.ReactNode;
  disabled?: boolean; // 👈 novo
}

export interface TabItemWithComponent extends TabItemBase {
  Component: () => React.ReactNode;
}

export interface TabItemWithContent extends TabItemBase {
  content: React.ReactNode;
}

export type TabItem = TabItemWithComponent | TabItemWithContent;

interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  value?: string; // 👈 novo (controlado)
  onValueChange?: (v: string) => void; // 👈 novo (controlado)
  containerClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

const Tabs: React.FC<TabsProps> = ({
  items,
  defaultValue,
  value,
  onValueChange,
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

  // estado interno apenas se não-controlado
  const [internal, setInternal] = useState(defaultValue || items[0].value);
  const isControlled = typeof value === "string";
  const current = isControlled ? (value as string) : internal;

  const activeItem = useMemo(
    () => items.find((i) => i.value === current),
    [items, current]
  );

  const handleChange = (next: string) => {
    const target = items.find((i) => i.value === next);
    if (target?.disabled) return; // bloqueia troca p/ aba desabilitada
    onValueChange?.(next);
    if (!isControlled) setInternal(next);
  };

  return (
    <TabsPrimitive.Root
      value={current}
      defaultValue={defaultValue || items[0].value}
      onValueChange={handleChange}
      className={cn("flex flex-col h-full w-full border rounded-2xl border-input", containerClassName)}
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
          "flex w-full overflow-x-auto flex-nowrap scrollbar-hide bg-muted text-muted-foreground rounded-xl hide-scrollbar",
          triggerClassName
        )}
        style={{ cursor: moved.current ? "grabbing" : "grab" }}
      >
        {items.map((item) => (
          <TabsPrimitive.Trigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            aria-disabled={item.disabled || undefined}
            className={cn(
              "flex-1 hover:bg-background h-10 rounded-t-xl px-2 text-xs font-bold whitespace-nowrap text-center cursor-pointer",
              "data-[state=active]:text-primary data-[state=active]:bg-card data-[state=active]:border-b-2 border-none",
              "data-[disabled]:opacity-50 data-[disabled]:pointer-events-none" // 👈 estilo p/ disabled
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
            {"Component" in activeItem ? activeItem.Component() : activeItem.content}
          </TabsPrimitive.Content>
        )}
      </div>
    </TabsPrimitive.Root>
  );
};

export default Tabs;
