"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { setEmpresaId } from "./empresaStore";

export function useReceiveEmpresaFromQuery(onReceived?: () => void) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = Number(searchParams.get("empresa"));
    if (id) {
      setEmpresaId(id);
      onReceived?.();
    }
  }, [searchParams, onReceived]);
}
