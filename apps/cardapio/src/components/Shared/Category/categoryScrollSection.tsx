"use client";

import React from "react";
import type { CategoriaComProdutos } from "../../../types/CardapioTypes";

import CardAddCategoria from "../../admin/card/CardAddCategoria";
import { CategoryCard } from "../card/CategoryCard";

interface Props {
  categorias: CategoriaComProdutos[];
  titulo?: string;
  parentSlug?: string | null;
  empresaId: number;
}

export default function CategoryScrollSection({
  categorias,
  titulo,
  parentSlug = null,
  empresaId,
}: Props) {
  return (
    <section className="mb-4">
      {categorias.length > 1 && (
        <div className="flex justify-between items-center px-2">
          <h2 className="text-xl font-bold mb-2">Categorias</h2>
        </div>
      )}
      <div className="flex overflow-x-auto gap-4 pb-2 hide-scrollbar px-2">
        {categorias.map((cat) => (
          <CategoryCard
            key={cat.id}
            id={cat.id}
            label={cat.descricao}
            image={cat.imagem}
            href={
              cat.slug_pai
                ? `/categoria/${cat.slug_pai}/${cat.slug}`
                : `/categoria/${cat.slug}`
            }
            empresaId={empresaId}
          />
        ))}
        <CardAddCategoria parentSlug={parentSlug} />
      </div>
    </section>
  );
}
