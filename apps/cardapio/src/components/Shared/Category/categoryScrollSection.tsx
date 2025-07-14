"use client";

import React, { useState } from "react";
import type { CategoriaComProdutos } from "../../../types/CardapioTypes";

import CardAddCategoria from "../../admin/card/CardAddCategoria";
import { ModalEditCategoria } from "@cardapio/components/admin/modals/ModalEditCategoria";
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
  const [editOpen, setEditOpen] = useState(false);
  const [categoriaIdSelecionada, setCategoriaIdSelecionada] = useState<number | null>(null);

  function openEditModal(id: number) {
    setCategoriaIdSelecionada(id);
    setEditOpen(true);
  }

  // stub move functions
  function moveLeft(id: number) { /* seu handler */ }
  function moveRight(id: number) { /* seu handler */ }

  return (
    <section className="mb-4">
      {titulo && (
        <div className="flex justify-between items-center px-2">
          <h2 className="text-xl font-bold mb-2">{titulo}</h2>
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
            onEdit={openEditModal}
            onMoveLeft={moveLeft}
            onMoveRight={moveRight}
          />
        ))}

        <CardAddCategoria parentSlug={parentSlug} />
      </div>

      {categoriaIdSelecionada !== null && (
        <ModalEditCategoria
          open={editOpen}
          onOpenChange={setEditOpen}
          empresaId={empresaId}
          categoriaId={categoriaIdSelecionada}
        />
      )}
    </section>
  );
}
