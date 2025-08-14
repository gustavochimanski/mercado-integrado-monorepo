// app/(admin)/cardapio/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Store } from "lucide-react";
import { getCookie } from "cookies-next";

import { Button } from "@supervisor/components/ui/button";
import { Card, CardContent } from "@supervisor/components/ui/card";
import { useEmpresas } from "@supervisor/services/global/useGetEmpresasMensura";
import { EmpresaMensura } from "@supervisor/types/empresas/TypeEmpresasMensura";

// Ajuste aqui seus links de ambiente
const LINK_PROD = "https://mercado-integrado-monorepo-cardapio.vercel.app";
const LINK_DEV = "http://localhost:3000";
const IS_DEV = true;

// Coerção segura: se vier "001" => 1; se vier number => mantém
function toIntId(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export default function PageAdminCardapio() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Carrega empresas via React Query
  const { data: empresas = [], isLoading, error } = useEmpresas({ skip: 0, limit: 100 });

  // Estado da empresa selecionada
  const [empresaId, setEmpresaId] = useState<number | null>(null);

  // Preseleciona a primeira da lista (opcional)
  useEffect(() => {
    if (!empresaId && empresas.length > 0) {
      const coerced = toIntId(empresas[0]?.id);
      if (coerced) setEmpresaId(coerced);
    }
  }, [empresas, empresaId]);

  // Monta URL do iframe com base na empresa e ambiente
  const iframeUrl = useMemo(() => {
    if (!empresaId) return "";
    const base = IS_DEV ? LINK_DEV : LINK_PROD;
    return `${base}/?via=supervisor&empresa=${empresaId}`;
  }, [empresaId]);

  // Envia token ao iframe quando ele sinalizar que está pronto
  useEffect(() => {
    const token = getCookie("access_token") as string | undefined;
    const listener = (event: MessageEvent) => {
      if (event.data?.type !== "ready_for_token") return;
      if (!iframeRef.current || !token) return;

      const src = iframeRef.current.getAttribute("src");
      const targetOrigin = src ? new URL(src).origin : "*";

      // Segurança: enviar somente para a origem do iframe
      iframeRef.current.contentWindow?.postMessage(
        { type: "auth_token", token },
        targetOrigin
      );
    };

    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [empresaId]);

  // Render helpers
  const renderSidebar = () => {
    if (isLoading) {
      return <span className="text-muted-foreground text-sm">Carregando empresas...</span>;
    }
    if (error) {
      return <span className="text-red-600 text-sm">Erro: {error.message}</span>;
    }
    if (!empresas?.length) {
      return <span className="text-muted-foreground text-sm">Nenhuma empresa encontrada.</span>;
    }

    return empresas.map((empresa: EmpresaMensura) => {
      const coerced = toIntId(empresa.id);
      const selected = coerced !== null && empresaId === coerced;

      return (
        <Button
          key={`${empresa.id}-${empresa.slug}`}
          variant={selected ? "default" : "ghost"}
          className="justify-start"
          aria-pressed={selected}
          onClick={() => coerced && setEmpresaId(coerced)}
        >
          <Store className="w-5 h-5 mr-2" />
          {empresa.nome}
        </Button>
      );
    });
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar com seleção de empresas */}
      <aside className="w-64 border-r bg-background p-4 flex flex-col gap-4">
        <h3 className="text-lg font-semibold mb-2">Empresas</h3>
        {renderSidebar()}
      </aside>

      {/* Conteúdo principal com o cardápio */}
      <main className="flex-1 p-6 justify-start">
        <Card className="h-full flex flex-col">
          <CardContent className="flex-1 flex justify-start items-center min-h-0">
            {empresaId ? (
              <div className="flex flex-col w-[390px] h-full min-h-0 border rounded-xl overflow-hidden shadow-md bg-white">
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
      </main>
    </div>
  );
}
