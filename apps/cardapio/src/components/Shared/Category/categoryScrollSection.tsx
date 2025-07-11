"use client";

import React from "react";
import type { CategoriaComProdutos } from "../../../types/Categorias";
import { CategoryCard } from "./CategoryCard";
import AdminCategoryControls from "../../admin/controlls/AdminCategoryControlls";
import CardAddCategoria from "../../admin/card/CardAddCategoria"; // corrigido o path

interface Props {
  categorias: CategoriaComProdutos[];
  titulo?: string;
  parentSlug?: string | null; // 👈 adiciona aqui
}

export default function CategoryScrollSection({
  categorias,
  titulo,
  parentSlug = null,
}: Props) {
  return (
    <section className="mb-4">
      <div className="flex justify-between items-center px-2">
        {titulo && <h2 className="text-xl font-bold mb-2">{titulo}</h2>}
        <AdminCategoryControls parentSlug={parentSlug} />
      </div>

      <div className="flex overflow-x-auto gap-4 pb-2 hide-scrollbar px-2">
        {categorias.map((cat) => (
          <div key={cat.id}>
            <CategoryCard
              label={cat.descricao}
              image={cat.imagem}
              href={
                cat.slug_pai
                  ? `/categoria/${cat.slug_pai}/${cat.slug}`
                  : `/categoria/${cat.slug}`
              }
            />
          </div>
        ))}

        {/* Botão de adicionar categoria visual */}
        <CardAddCategoria parentSlug={parentSlug} />
      </div>
    </section>
  );
}
