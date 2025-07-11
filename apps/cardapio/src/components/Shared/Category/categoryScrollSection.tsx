"use client";

import React from "react";
import type { CategoriaComProdutos } from "../../../types/Categorias";
import { CategoryCard } from "./CategoryCard";
import AdminCategoryControls from "../../../components/admin/controlls/CategoriaControlls";
import CardAddCategoria from "../../..//components/admin/card/CardAddCategoria";

interface Props {
  categorias: CategoriaComProdutos[];
  titulo?: string;
}

export default function CategoryScrollSection({ categorias, titulo }: Props) {

  

  return (
    <section className="mb-4">
      <div className="flex justify-between items-center px-2">
        {titulo && <h2 className="text-xl font-bold mb-2">{titulo}</h2>}
        <AdminCategoryControls/>
      </div>

      <div className="flex overflow-x-auto gap-4 pb-2 hide-scrollbar px-2">
        {categorias.map((cat) => (
          <div key={cat.id} className="">
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
        <CardAddCategoria/>

      </div>
    </section>
  );
}