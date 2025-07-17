"use client";

import { useEffect, useRef, useState } from "react";
import {  Store } from "lucide-react";

import { Button } from "@supervisor/components/ui/button";
import {
  Card,
  CardContent,
} from "@supervisor/components/ui/card";
import { getCookie } from "cookies-next";

export default function PageAdminCardapio() {
  // "produtos" | "promocoes" | "categorias" | "secoes" | null
  const [openSheet, setOpenSheet] = useState<"Loja" | "promocoes" | "categorias" | "secoes" | null>(null);
    
  const linkProd = "https://mercado-integrado-monorepo-cardapio.vercel.app/?via=supervisor"
  const linkDev = "http://localhost:3000/?via=supervisor"

  const iframeRef = useRef<HTMLIFrameElement>(null);

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
  }, []);

  

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-background p-4 flex flex-col gap-4">
        <h3 className="text-lg font-semibold mb-2">Menu</h3>

        <Button
          variant="ghost"
          className="justify-start"
          onClick={() => setOpenSheet("Loja")}
        >
          <Store className="w-5 h-5 mr-2" /> Loja
        </Button>
      </aside>

      <main className="flex-1 p-6 justify-start">
        <Card className="h-full flex flex-col ">

          <CardContent className="flex-1 flex justify-start items-center min-h-0">
            <div className="flex flex-col w-[390px] h-full min-h-0 border rounded-xl overflow-hidden shadow-md bg-white">
              <div className="bg-gray-100 p-2 text-sm font-medium text-center">
                Preview do cardápio
              </div>
              <iframe
                ref={iframeRef}
                src={linkProd}
                className="w-full flex-1"
              />
            </div>
          </CardContent>
        </Card>
      </main>

    </div>
  );
}