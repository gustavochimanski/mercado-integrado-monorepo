"use client";

import { useEffect } from "react";
import { setToken } from "@packs/auth/src/tokenStore";



export function useReceiveTokenFromParent() {
  useEffect(() => {
    window.parent.postMessage({ type: "ready_for_token" }, "*");

    const listener = (event: MessageEvent) => {
      const { type, token } = event.data || {};
      if (type === "auth_token" && token) {
        console.log("🔐 Token recebido:", token);
        setToken(token); 
      }
    };

    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, []);
}
