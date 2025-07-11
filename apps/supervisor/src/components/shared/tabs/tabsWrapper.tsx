// components/shared/TabsWrapper.tsx
'use client';

import Tabs from "@supervisor/components/shared/tabs/tabs";

interface TabsWrapperProps {
  items: any[];
}

export default function TabsWrapper({ items }: TabsWrapperProps) {
  return (
    <Tabs
      items={items}
      containerClassName="w-full rounded-sm shadow h-full flex flex-col"
      triggerClassName="transition-colors"
      contentClassName=" rounded-sm flex-1 h-full overflow-hidden"
    />
  );
}
