// hooks/useScrollSpy.ts
// Pequeno hook para observar várias <section> e devolver o ID atualmente visível
import { useCallback, useEffect, useRef, useState } from "react";

export interface SpyOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

export function useScrollSpy<T extends string | number>(opts: SpyOptions = {
  root: null,
  rootMargin: "-30% 0px -30% 0px",
  threshold: 0.1,
}) {
  const [activeId, setActiveId] = useState<T | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsMap = useRef<Map<T, Element>>(new Map());

  // Registra / cancela elementos
  const register = useCallback(
    (id: T) => (el: Element | null) => {
      if (!el) {
        // unmount
        const current = elementsMap.current.get(id);
        if (current && observerRef.current) {
          observerRef.current.unobserve(current);
        }
        elementsMap.current.delete(id);
        return;
      }

      elementsMap.current.set(id, el);
      if (!observerRef.current) {
        observerRef.current = new IntersectionObserver((entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          if (visible.length) {
            const target = visible[0].target as HTMLElement;
            const found = [...elementsMap.current.entries()].find(([, node]) => node === target);
            if (found) setActiveId(found[0]);
          }
        }, opts);
      }
      observerRef.current.observe(el);
    },
    [opts]
  );

  // Cleanup geral ao desmontar a página
  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  return { activeId, register } as const;
}