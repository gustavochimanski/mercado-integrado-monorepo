// components/Shared/scrollspy/HorizontalSpy.tsx
"use client";
import React, { useEffect, useRef } from "react";

interface SpyItem {
  id: number;
  titulo: string;
}

interface HorizontalSpyProps {
  items: SpyItem[];
  activeId: number | null;
  onClickItem?: (id: number) => void;
}

export function HorizontalSpy({ items, activeId, onClickItem }: HorizontalSpyProps) {
  if (!items.length) return null;

  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  const setItemRef = (id: number) => (el: HTMLButtonElement | null) => {
    itemRefs.current[id] = el;
  };

  // Mantém o item ativo visível
  useEffect(() => {
    if (activeId == null) return;
    const btn = itemRefs.current[activeId];
    const parent = listRef.current;
    if (!btn || !parent) return;

    const btnLeft = btn.offsetLeft;
    const btnRight = btnLeft + btn.offsetWidth;
    const visibleStart = parent.scrollLeft;
    const visibleEnd = visibleStart + parent.clientWidth;

    if (btnLeft < visibleStart) {
      parent.scrollTo({ left: btnLeft - 16, behavior: "smooth" });
    } else if (btnRight > visibleEnd) {
      parent.scrollTo({ left: btnRight - parent.clientWidth + 16, behavior: "smooth" });
    }
  }, [activeId]);

  return (
    <nav className="sticky top-0 z-30 bg-background/80 backdrop-blur p-4 border-b">
      <ul
        ref={listRef}
        className="flex flex-nowrap gap-2 whitespace-nowrap overflow-x-auto hide-scrollbar scroll-smooth"
      >
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id} className="shrink-0">
              <button
                ref={setItemRef(item.id)}
                onClick={() => onClickItem?.(item.id)}
                className={`px-3 py-1 rounded-full text-sm transition border whitespace-nowrap
                  ${isActive ? "bg-primary text-background border-primary" : "bg-muted hover:bg-muted/80 border-transparent"}
                `}
              >
                {item.titulo}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
