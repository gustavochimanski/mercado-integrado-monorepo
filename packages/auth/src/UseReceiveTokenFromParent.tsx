"use client";

import { useEffect } from "react";
import { setCookie } from "cookies-next";

export function useReceiveTokenFromParent() {
  // Sem query string!
  const linkProd = "https://mercado-integrado-monorep-git-b5640c-gustavochimanskis-projects.vercel.app";
  const linkDev = "http://localhost:3001";

  useEffect(() => {
    const allowedOrigins = [linkProd, linkDev];

    const listener = (event: MessageEvent) => {
      if (!allowedOrigins.includes(event.origin)) return;

      const { type, token } = event.data || {};
      if (type === "auth_token" && token) {
        console.log("🔐 Token recebido via postMessage:", token);

        setCookie("access_token", token, {
          path: "/",
          sameSite: "none",  // 🔥 Isso aqui é ESSENCIAL
          secure: true,
          maxAge: 60 * 30,
        });

        window.location.reload();
      }
    };

    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, []);
}
