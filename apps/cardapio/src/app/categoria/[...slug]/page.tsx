"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useCategoriasDelivery } from "@cardapio/hooks/useCategoriasDelivery";
import type { ProdutoEmpMini } from "@cardapio/types/Produtos";
import { Button } from "@cardapio/components/Shared/ui/button";
import CategorySection from "@cardapio/components/Shared/Category/categorySection";
import HeaderComponent from "@cardapio/components/Shared/Header";
import CategoryScrollSection from "@cardapio/components/Shared/Category/categoryScrollSection";
import { SheetAdicionarProduto } from "@cardapio/components/Shared/Sheet/SheetAddProduto";
import { CircleArrowLeft } from "lucide-react";
import CardAddSecaoSubCateg from "@cardapio/components/admin/card/CardAddSecaoSubCateg";

export default function CategoriaPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoEmpMini | null>(null);

  const router = useRouter()

  const empresaId = 1;
  const params = useParams<{ slug?: string | string[] }>();
  const slugAtual = Array.isArray(params.slug)
    ? params.slug[params.slug.length - 1]
    : params.slug ?? "";

  const { data: categorias = [], isLoading } = useCategoriasDelivery(empresaId);

  const categoriaAtual = categorias.find((cat) => cat.slug === slugAtual);
  const subcategorias = categorias.filter((cat) => cat.slug_pai === slugAtual);
  const vitrines = categoriaAtual?.vitrines ?? [];

  const produtosDeTodasCategorias = categorias.flatMap((cat) => cat.produtos);

  const blocosVitrine = vitrines.map((vitrine) => {
    const produtosFiltrados = produtosDeTodasCategorias.filter((produto) => {
      const mesmaCategoria = produto.produto.cod_categoria === vitrine.cod_categoria;
      const mesmaSubcategoria = produto.subcategoria_id === vitrine.id;
      return mesmaCategoria && mesmaSubcategoria;
    });

    return (
      <CategorySection
        key={vitrine.id}
        categoriaLabel={vitrine.titulo}
        produtos={produtosFiltrados}
        onAdd={handleOpenSheet}
        subcategoriaId={vitrine.id} 
        codCategoria={vitrine.cod_categoria}      
      />
    );
  });


  function handleOpenSheet(produto: ProdutoEmpMini) {
    setProdutoSelecionado(produto);
    setSheetOpen(true);
  }

  function handleAdd(produto: ProdutoEmpMini, quantity: number) {
    alert(`Adicionado: ${produto.produto.descricao} x${quantity}`);
    setSheetOpen(false);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-lg">Carregando categoria e produtos…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col gap-4">
      <HeaderComponent />

      <Button onClick={router.back} variant={"link"} className="mr-auto"> <CircleArrowLeft/>Voltar</Button>
      <main className="flex-1 p-2">
        {categoriaAtual && (
          <CategoryScrollSection
            categorias={subcategorias}
            titulo={categoriaAtual?.descricao}
            parentSlug={categoriaAtual?.slug}
          />

        )}


        {blocosVitrine}
        {categoriaAtual && (
          <CardAddSecaoSubCateg
            empresaId={empresaId}
            codCategoria={categoriaAtual.id}
          />
        )}

        
      </main>

      {produtoSelecionado && (
        <SheetAdicionarProduto
          produto={produtoSelecionado}
          isOpen={sheetOpen}
          onAdd={handleAdd}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </div>
  );
}
