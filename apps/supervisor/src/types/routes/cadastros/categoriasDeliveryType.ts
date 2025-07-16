
export interface CategoryResponse {
  children?: any;
  id: number;
  label: string;            // Nome legível da categoria
  slug: string;             // Identificador único para URL
  slug_pai: string | null;  // Slug do pai (ou null se for raiz)
  imagem?: string | null;          // URL da imagem da categoria (opcional)
  href?: string;            // Link customizado (opcional)
}
