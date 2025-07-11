"use client";

import { useCategorias } from "../../hooks/useCategorias";
import { BotaoNovaCategoria } from "./BotaoNovaCateg";
import { buildCategoryTree } from "./tree/buildTree";
import { TreeCategoriaNode } from "./tree/TreeCategNode";

export default function CategoriaComponent() {
  const { data = [], isLoading } = useCategorias();

  if (isLoading) return <p>Carregando categorias...</p>;

  const tree = buildCategoryTree(data);

  return (
    <main className="p-6 h-full flex flex-col gap-6">
      <BotaoNovaCategoria />

      <div className="space-y-4">
        {tree.map((node) => (
          <TreeCategoriaNode key={node.slug} node={node} />
        ))}
      </div>
    </main>
  );
}
