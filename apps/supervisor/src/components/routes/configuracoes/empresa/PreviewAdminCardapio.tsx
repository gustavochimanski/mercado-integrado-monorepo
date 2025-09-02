"use client";

import { useEffect, useMemo, useRef } from "react";
import { getCookie } from "cookies-next";
import { Card, CardContent } from "@supervisor/components/ui/card";

const LINK_PROD = "https://mi-cardapio.vercel.app";
const LINK_DEV = "http://localhost:3000";
const IS_DEV = true;

interface PreviewAdminCardapioProps {
  empresaId: number | null;
}

export default function PreviewAdminCardapio({ empresaId }: PreviewAdminCardapioProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const iframeUrl = useMemo(() => {
    if (!empresaId) return "";
    const base = IS_DEV ? LINK_DEV : LINK_PROD;
    return `${base}/?via=supervisor&empresa=${empresaId}`;
  }, [empresaId]);

  useEffect(() => {
    const token = getCookie("access_token") as string | undefined;

    const listener = (event: MessageEvent) => {
      if (event.data?.type !== "ready_for_token") return;
      if (!iframeRef.current || !token) return;

      const src = iframeRef.current.getAttribute("src");
      const targetOrigin = src ? new URL(src).origin : "*";

      iframeRef.current.contentWindow?.postMessage(
        { type: "auth_token", token },
        targetOrigin
      );
    };

    window.addEventListener("message", listener);

    // 🔹 Se já houver iframe, envia token imediatamente
    if (iframeRef.current && token) {
      const src = iframeRef.current.getAttribute("src");
      const targetOrigin = src ? new URL(src).origin : "*";
      iframeRef.current.contentWindow?.postMessage(
        { type: "auth_token", token },
        targetOrigin
      );
    }

    return () => window.removeEventListener("message", listener);
  }, [iframeUrl]); // ⚠️ Dependência agora é iframeUrl

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex-1 flex justify-start items-center min-h-0">
        {empresaId ? (
          <div className="flex flex-col w-full h-full min-h-0 border rounded-xl overflow-hidden shadow-md bg-white">
            <div className="bg-gray-100 p-2 text-sm font-medium text-center">
              Preview do cardápio
            </div>
            <iframe
              ref={iframeRef}
              src={iframeUrl}
              title="Pré-visualização do Cardápio"
              className="w-full flex-1"
            />
          </div>
        ) : (
          <div className="text-muted-foreground text-sm">
            Selecione uma empresa para visualizar o cardápio
          </div>
        )}
      </CardContent>
    </Card>
  );
}
