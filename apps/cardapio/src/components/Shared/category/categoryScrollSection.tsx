// components/Shared/section/categoryScrollSection.tsx
"use client";
import React from "react";
import type { CategoriaComProdutos } from "@cardapio/types/CardapioTypes";
import CardAdminAddCategoria from "@cardapio/components/admin/card/CardAdminAddCategoria";
import { CategoryCard } from "@cardapio/components/Shared/category/CategoryCard";

interface Props {
  categorias: CategoriaComProdutos[];
  titulo?: string;
  parentSlug?: string | null;
  empresaId: number;
  activeId?: number | null;
}

export default function CategoryScrollSection({ categorias, titulo, parentSlug = null, empresaId, activeId }: Props) {
  return (
    <section className="mb-4">
      {categorias.length > 1 && (
        <div className="flex justify-between items-center px-2">
          <h2 className="text-xl font-bold mb-2">{titulo ?? "Categorias"}</h2>
        </div>
      )}
      <div className="relative px-2">
        {/* Linha colorida só no topo */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary/20 to-primary  rounded-t-xl z-10" />

        <div className="relative flex overflow-x-auto gap-4 pb-2 hide-scrollbar rounded-xl z-20 px-4 py-2">
          {categorias.map((cat) => (
            <CategoryCard
              key={cat.id}
              id={cat.id}
              label={cat.label}
              image={cat.imagem}
              href={cat.slug_pai ? `/categoria/${cat.slug_pai}/${cat.slug}` : `/categoria/${cat.slug}`}
              empresaId={empresaId}
              isActive={activeId === cat.id}
            />
          ))}
          <CardAdminAddCategoria parentSlug={parentSlug} />
        </div>
      </div>


    </section>
  );
}