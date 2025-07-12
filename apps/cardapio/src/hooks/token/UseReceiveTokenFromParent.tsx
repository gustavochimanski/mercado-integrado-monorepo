// @packs/auth/src/UseReceiveTokenFromParent.ts
"use client";

import { useEffect } from "react";
import { setToken } from "./tokenStore";

export function useReceiveTokenFromParent(onTokenReceived?: () => void) {
  useEffect(() => {
    window.parent.postMessage({ type: "ready_for_token" }, "*");

    const listener = (event: MessageEvent) => {
      const { type, token } = event.data || {};
      if (type === "auth_token" && token) {
        console.log("🔐 Token recebido:", token);
        setToken(token);

        // chama callback (tipo um reload do usuário)
        onTokenReceived?.();
      }
    };

    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, []);
}
