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
    <section className="mb-6">
      {categorias.length > 1 && (
        <div className="flex justify-between items-center px-4 mb-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Categorias
          </h2>
        </div>
      )}

      <div className="relative">
        <div className={`relative flex overflow-x-auto gap-4 px-4 py-2 ${isAdmin ? "": "hide-scrollbar"}`}>
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
