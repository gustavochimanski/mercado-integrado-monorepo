// hooks/useModoSupervisorFallback.ts
"use client";
import { useEffect, useState } from "react";

export function useModoSupervisor() {
  const [isSupervisor, setIsSupervisor] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsSupervisor(params.get("via") === "supervisor");
  }, []);

  return isSupervisor;
}
