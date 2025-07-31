"use client";

import { useEffect, useRef, useState } from "react";
import { Store } from "lucide-react";

import { Button } from "@supervisor/components/ui/button";
import {
  Card,
  CardContent,
} from "@supervisor/components/ui/card";
import { getCookie } from "cookies-next";

// Tipo da empresa simulada
type Empresa = {
  id: number;
  nome: string;
};

export default function PageAdminCardapio() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresaId, setEmpresaId] = useState<number | null>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // MOCK de fetch de empresas
  useEffect(() => {
    setTimeout(() => {
      setEmpresas([
        { id: 1, nome: "Supermercado Brasil" },
        { id: 2, nome: "Loja do João" },
        { id: 3, nome: "Mercadinho da Esquina" },
      ]);
    }, 500);
  }, []);

  // Envio de token pro iframe quando estiver pronto
  useEffect(() => {
    const token = getCookie("access_token");

    const listener = (event: MessageEvent) => {
      if (event.data?.type === "ready_for_token" && iframeRef.current && token) {
        console.log("🤝 Iframe pronto. Enviando token...");
        iframeRef.current.contentWindow?.postMessage(
          { type: "auth_token", token },
          "*"
        );
      }
    };

    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [empresaId]);

  // Links do cardápio
  const linkProd = "https://mercado-integrado-monorepo-cardapio.vercel.app";
  const linkDev = "http://localhost:3000";
  const isDev = true;

  // Monta URL do iframe com base na empresa e ambiente
  const iframeUrl = empresaId
    ? `${isDev ? linkDev : linkProd}/?via=supervisor&empresa=${empresaId}`
    : "";

  return (
    <div className="flex h-screen">
      {/* Sidebar com seleção de empresas */}
      <aside className="w-64 border-r bg-background p-4 flex flex-col gap-4">
        <h3 className="text-lg font-semibold mb-2">Empresas</h3>

        {empresas.length === 0 && (
          <span className="text-muted-foreground text-sm">Carregando empresas...</span>
        )}

        {empresas.map((empresa) => (
          <Button
            key={empresa.id}
            variant={empresaId === empresa.id ? "default" : "ghost"}
            className="justify-start"
            onClick={() => setEmpresaId(empresa.id)}
          >
            <Store className="w-5 h-5 mr-2" />
            {empresa.nome}
          </Button>
        ))}
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
