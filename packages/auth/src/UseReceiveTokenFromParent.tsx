"use client";

import { useEffect } from "react";
import { setCookie, getCookie } from "cookies-next";

export function useReceiveTokenFromParent() {
  const linkProd = "https://mercado-integrado-monorep-git-b5640c-gustavochimanskis-projects.vercel.app";
  const linkDev = "http://localhost:3001";

  useEffect(() => {
    const allowedOrigins = [linkProd, linkDev];

    const listener = (event: MessageEvent) => {
      if (!allowedOrigins.includes(event.origin)) return;

      const { type, token } = event.data || {};
      if (type === "auth_token" && token) {
        const existing = getCookie("access_token");

        if (existing === token) {
          console.log("✅ Token já está salvo. Ignorando reload.");
          return;
        }

        console.log("🔐 Novo token recebido via postMessage:", token);

        setCookie("access_token", token, {
          path: "/",
          sameSite: "none",
          secure: true,
          maxAge: 60 * 30,
        });

        console.log("♻️ Token atualizado. Recarregando...");
        window.location.reload();
      }
    };

    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, []);
}
