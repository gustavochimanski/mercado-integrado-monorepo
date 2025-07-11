// utils/buildTree.ts

import { CategoryApi, CategoryNode } from "../../../types/categoriasDeliveryType";

export function buildCategoryTree(categorias: CategoryApi[]): CategoryNode[] {
  const map = new Map<string, CategoryNode>();

  // Inicializa os nós com children vazios
  categorias.forEach((cat) =>
    map.set(cat.slug, {
      id: cat.id,
      label: cat.label,
      slug: cat.slug,
      imagem: cat.imagem,
      children: [],
    })
  );

  const tree: CategoryNode[] = [];

  map.forEach((node, slug) => {
    const original = categorias.find((c) => c.slug === slug);
    if (original?.slug_pai) {
      const pai = map.get(original.slug_pai);
      pai?.children.push(node);
    } else {
      tree.push(node);
    }
  });

  return tree;
}
