// @cardapio/services/vitrine/utils.ts
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function useLandingpageTrue() {
  const pathname = usePathname();
  return pathname.startsWith("/landingpage-store");
}

