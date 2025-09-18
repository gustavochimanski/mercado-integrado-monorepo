"use client";

import { useEffect, useMemo, useRef } from "react";
import { getCookie } from "cookies-next";
import { Card, CardContent } from "@supervisor/components/ui/card";
import { useEmpresaById } from "@supervisor/services/useQueryEmpresasMensura";

const LINK_DEV = "http://localhost:3000";
const IS_DEV = true;

interface PreviewAdminCardapioProps {
  empresaId: number | null;
}

export default function PreviewAdminCardapio({ empresaId }: PreviewAdminCardapioProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { data: data_empresa_atual } = useEmpresaById(empresaId ?? undefined);

  const iframeUrl = useMemo(() => {
    if (!empresaId) return "";

    // 🔹 Regra: usa dev se IS_DEV for true, senão usa o link do banco.
    // Se não tiver link no banco, fallback para LINK_DEV.
    const base = IS_DEV
      ? LINK_DEV
      : data_empresa_atual?.cardapio_link ?? LINK_DEV;

    return `${base}/?via=supervisor&empresa=${empresaId}`;
  }, [empresaId, data_empresa_atual]);

  useEffect(() => {
    const token = getCookie("access_token") as string | undefined;

    const listener = (event: MessageEvent) => {
      if (event.data?.type !== "ready_for_token") return;
      if (!iframeRef.current || !token) return;

      const src = iframeRef.current.getAttribute("src");
      let targetOrigin = "*";

      if (src) {
        try {
          targetOrigin = new URL(src).origin;
        } catch {
          console.warn("⚠️ URL inválida no iframe src:", src);
        }
      }

      iframeRef.current.contentWindow?.postMessage(
        { type: "auth_token", token },
        targetOrigin
      );
    };

    window.addEventListener("message", listener);

    // 🔹 Se já houver iframe, envia token imediatamente
    if (iframeRef.current && token) {
      const src = iframeRef.current.getAttribute("src");
      let targetOrigin = "*";

      if (src) {
        try {
          targetOrigin = new URL(src).origin;
        } catch {
          console.warn("⚠️ URL inválida no iframe src:", src);
        }
      }

      iframeRef.current.contentWindow?.postMessage(
        { type: "auth_token", token },
        targetOrigin
      );
    }

    return () => window.removeEventListener("message", listener);
  }, [iframeUrl]);

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
