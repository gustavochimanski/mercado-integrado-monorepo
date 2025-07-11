export interface CategoryApi {
  id: number;
  label: string;            // Nome legível da categoria
  slug: string;             // Identificador único para URL
  slug_pai: string | null;  // Slug do pai (ou null se for raiz)
  imagem?: string;          // URL da imagem da categoria (opcional)
  href?: string;            // Link customizado (opcional)
}

// Define o formato da árvore gerada
export interface CategoryNode {
  id: number;               // Mesmo ID do CategoryApi
  label: string;            // Nome legível (reaproveitando label)
  slug: string;             // Mesmo slug do CategoryApi
  imagem?: string;          // URL da imagem (opcional)
  children: CategoryNode[]; // Lista de nós filhos
}
