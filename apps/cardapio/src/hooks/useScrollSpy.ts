// hooks/useScrollSpy.ts
// Observa várias <section> e devolve o ID atualmente “ativo” com base na posição de scroll.
// Usa scroll + getBoundingClientRect para evitar instabilidade ao rolar (ex.: badges bugando).
import { useCallback, useEffect, useRef, useState } from "react";

export interface SpyOptions {
  /** Linha (px from top) considerada “limite” para a seção ativa. Acima dela = já passou. */
  triggerOffset?: number;
  /** Throttle do listener de scroll (ms). */
  throttleMs?: number;
}

const defaultTrigger = 250; // header + badges (~40 + ~60) + pequena margem
const defaultThrottle = 80;

export function useScrollSpy<T extends string | number>(opts: SpyOptions = {}) {
  const trigger = opts.triggerOffset ?? defaultTrigger;
  const throttle = opts.throttleMs ?? defaultThrottle;

  const [activeId, setActiveId] = useState<T | null>(null);
  const elementsMap = useRef<Map<T, Element>>(new Map());
  const rafRef = useRef<number | null>(null);
  const lastRun = useRef(0);

  const compute = useCallback(() => {
    const map = elementsMap.current;
    if (!map.size) {
      setActiveId(null);
      return;
    }

    const entries = [...map.entries()].map(([id, el]) => {
      const rect = el.getBoundingClientRect();
      return { id, top: rect.top, bottom: rect.bottom };
    });

    // Ordenar por top (posição na tela).
    entries.sort((a, b) => a.top - b.top);

    // Seção ativa: a última cujo top já “passou” da linha de trigger (ou a primeira, se todas abaixo).
    let best: T | null = null;
    for (const { id, top } of entries) {
      if (top <= trigger) best = id;
      else break;
    }
    if (best === null && entries.length) best = entries[0].id;

    setActiveId(best);
  }, [trigger]);

  const onScroll = useCallback(() => {
    const now = Date.now();
    if (now - lastRun.current < throttle) {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        lastRun.current = Date.now();
        compute();
      });
      return;
    }
    lastRun.current = now;
    compute();
  }, [throttle, compute]);

  const register = useCallback(
    (id: T) => (el: Element | null) => {
      if (!el) {
        elementsMap.current.delete(id);
        return;
      }
      elementsMap.current.set(id, el);
      setTimeout(compute, 0);
    },
    [compute]
  );

  useEffect(() => {
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [compute, onScroll]);

  return { activeId, register } as const;
}
