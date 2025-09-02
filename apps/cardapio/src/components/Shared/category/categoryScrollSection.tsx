"use client";

import React from "react";
import CardAdminAddCategoria from "@cardapio/components/admin/card/CardAdminAddCategoria";
import { CategoryCard } from "@cardapio/components/Shared/category/CategoryCard";
import type { CategoriaMini } from "@cardapio/services/useQueryHome";
import { useUserContext } from "@cardapio/hooks/auth/userContext";

interface Props {
  categorias: CategoriaMini[];
  parentId?: number | null;
  empresaId: number;
}

export default function CategoryScrollSection({
  categorias,
  parentId = null,
  empresaId,
}: Props) {

  const {isAdmin} = useUserContext()
  return (
    <section className="mb-4  rounded-xl">
      {categorias.length > 1 && (
        <div className="flex justify-between items-center px-2 bg-primary rounded-t-xl">
          <h2 className="text-base font-semibold my-1 text-background">
            Categorias
          </h2>
        </div>
      )}

      <div className="relative  border-2 border-primary/20 rounded-b-xl">
        {/* Linha colorida no topo */}

        <div className={`relative flex overflow-x-auto gap-4 pb-2 rounded-xl z-20 px-4 py-2 ${isAdmin ? "": "hide-scrollbar"}`}>
          {categorias.map((cat) => (
            <CategoryCard
              key={cat.id}
              id={cat.id}
              label={cat.label}
              image={cat.imagem!}
              href={
                cat.slug_pai
                  ? `/categoria/${cat.slug_pai}/${cat.slug}`
                  : `/categoria/${cat.slug}`
              }
              empresaId={empresaId}
            />
          ))}

          {/* Botão admin para criar nova categoria */}
          <CardAdminAddCategoria
            parentID={parentId}
            empresaId={empresaId}
          />
        </div>
      </div>
    </section>
  );
}
