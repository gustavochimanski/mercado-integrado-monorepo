"use client";

import { useEffect, useState } from "react";
import { Apple, Tag, List, Grid } from "lucide-react";

import {
  Sheet,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@supervisor/components/ui/sheet";


import { Button } from "@supervisor/components/ui/button";
import {
  Card,
  CardContent,
} from "@supervisor/components/ui/card";

import { getCookie } from "cookies-next";
import ComponentProdutos from "./components/produtos/ComponentProdutosCardapio";
import CategoriaComponent from "./components/categorias/ComponentCategoria";
import ComponentSecoes from "./components/secoes/ComponentSecoes";

export default function PageAdminCardapio() {
  // "produtos" | "promocoes" | "categorias" | "secoes" | null
  const [openSheet, setOpenSheet] = useState<"produtos" | "promocoes" | "categorias" | "secoes" | null>(null);
  
  // 2) estado para o token
  const [supervisorToken, setSupervisorToken] = useState<string>("");

  useEffect(() => {
    // aqui lemos o cookie que o TokenHandler gravou
    const t = getCookie("access_token");
    if (typeof t === "string") setSupervisorToken(t);
  }, []);
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-background p-4 flex flex-col gap-4">
        <h3 className="text-lg font-semibold mb-2">Menu</h3>

        <Button
          variant="ghost"
          className="justify-start"
          onClick={() => setOpenSheet("produtos")}
        >
          <Apple className="w-5 h-5 mr-2" /> Produtos
        </Button>

        <Button
          variant="ghost"
          className="justify-start"
          onClick={() => setOpenSheet("promocoes")}
        >
          <Tag className="w-5 h-5 mr-2" /> Promoções
        </Button>

        <Button
          variant="ghost"
          className="justify-start"
          onClick={() => setOpenSheet("categorias")}
        >
          <List className="w-5 h-5 mr-2" /> Categorias
        </Button>

        <Button
          variant="ghost"
          className="justify-start"
          onClick={() => setOpenSheet("secoes")}
        >
          <Grid className="w-5 h-5 mr-2" /> Seções
        </Button>
      </aside>

      <main className="flex-1 p-6 justify-start">
        <Card className="h-full flex flex-col">

          <CardContent className="flex-1 flex justify-start items-start min-h-0">
            <div className="flex flex-col w-[360px] h-full min-h-0 border rounded-xl overflow-hidden shadow-md bg-white">
              <div className="bg-gray-100 p-2 text-sm font-medium text-center">
                Preview do cardápio
              </div>
              <iframe
                src={`https://mensura-monorepo-cardapio.vercel.app`}
                className="w-full flex-1"
              />
            </div>
          </CardContent>
        </Card>
      </main>




      {/* Sheet de Produtos */}
      <Sheet
        open={openSheet === "produtos"}
        onOpenChange={(open) => setOpenSheet(open ? "produtos" : null)}
        modal={false}
      >
        <SheetOverlay className="fixed inset-0 bg-black/30 pointer-events-none z-40" />
        <SheetContent
          side="right"
        >
          <SheetHeader className="flex items-center justify-between p-4 border-b">
            <SheetTitle>Produtos</SheetTitle>
          </SheetHeader>
          <ComponentProdutos />
        </SheetContent>
      </Sheet>

      {/* Sheet de Promoções */}
      <Sheet
        open={openSheet === "promocoes"}
        onOpenChange={(open) => setOpenSheet(open ? "promocoes" : null)}
        modal={false}
      >
        <SheetOverlay className="fixed inset-0 bg-black/30 pointer-events-none z-40" />
        <SheetContent
          side="right"
        >
          <SheetHeader className="flex items-center justify-between p-4 border-b">
          </SheetHeader>
          Promocoes
        </SheetContent>
      </Sheet>

      {/* Sheet de Categorias */}
      <Sheet
        open={openSheet === "categorias"}
        onOpenChange={(open) => setOpenSheet(open ? "categorias" : null)}
        modal={false}
      >
        <SheetOverlay className="fixed inset-0 bg-black/30 pointer-events-none z-40" />
        <SheetContent
          side="right"
          className="fixed top-0 right-0 h-screen w-[500px] bg-background z-50 overflow-auto"
        >
          <SheetHeader className="flex items-center justify-between p-4 border-b">
            <SheetTitle>Categorias</SheetTitle>
          </SheetHeader>
          <CategoriaComponent />
        </SheetContent>
      </Sheet>

      {/* Sheet de Seções */}
      <Sheet
        open={openSheet === "secoes"}
        onOpenChange={(open) => setOpenSheet(open ? "secoes" : null)}
        modal={false}
      >
        <SheetOverlay className="fixed inset-0 bg-black/30 pointer-events-none z-40" />
        <SheetContent
          side="right"
          className="fixed top-0 right-0 h-screen w-[500px] bg-background z-50 overflow-auto"
        >
          <SheetHeader className="flex items-center justify-between p-4 border-b">
            <SheetTitle>Seções</SheetTitle>
          </SheetHeader>
          <ComponentSecoes empresaId={1}/>
        </SheetContent>
      </Sheet>
    </div>
  );
}