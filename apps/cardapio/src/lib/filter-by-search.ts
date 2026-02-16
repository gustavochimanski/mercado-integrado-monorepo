import type { ProdutoEmpMini } from "@cardapio/types/Produtos";
import type {
  CategoriaMini,
  VitrineComProdutosResponse,
  ComboMiniDTO,
  ReceitaMiniDTO,
} from "@cardapio/services/home";

function normalizeString(s: string): string {
  // Remover acentuação e normalizar para comparação case-insensitive
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function matchesTerm(text: string | null | undefined, term: string): boolean {
  if (!text || !term) return false;
  return normalizeString(text).includes(normalizeString(term));
}

export function filterCategoriasBySearch(
  categorias: CategoriaMini[],
  q: string
): CategoriaMini[] {
  const term = (q ?? "").trim();
  if (!term) return categorias;
  return categorias.filter(
    (c) =>
      matchesTerm(c.label, term) ||
      matchesTerm(c.descricao, term) ||
      matchesTerm(c.slug, term)
  );
}

function filterProdutos(produtos: ProdutoEmpMini[], term: string): ProdutoEmpMini[] {
  if (!term) return produtos;
  return produtos.filter((p) => matchesTerm(p.produto?.descricao, term));
}

function filterCombos(combos: ComboMiniDTO[] | null, term: string): ComboMiniDTO[] | null {
  if (!combos) return null;
  if (!term) return combos;
  const out = combos.filter(
    (c) => matchesTerm(c.titulo, term) || matchesTerm(c.descricao, term)
  );
  return out.length ? out : null;
}

function filterReceitas(
  receitas: ReceitaMiniDTO[] | null,
  term: string
): ReceitaMiniDTO[] | null {
  if (!receitas) return null;
  if (!term) return receitas;
  const out = receitas.filter(
    (r) => matchesTerm(r.nome, term) || matchesTerm(r.descricao, term)
  );
  return out.length ? out : null;
}

export function filterVitrinesBySearch(
  vitrines: VitrineComProdutosResponse[],
  q: string
): VitrineComProdutosResponse[] {
  const term = (q ?? "").trim();
  if (!term) return vitrines;

  return vitrines
    .map((v) => {
      const tituloMatch = matchesTerm(v.titulo, term);
      const produtosF = filterProdutos(v.produtos ?? [], term);
      const combosF = filterCombos(v.combos ?? null, term);
      const receitasF = filterReceitas(v.receitas ?? null, term);
      const hasMatch =
        tituloMatch ||
        produtosF.length > 0 ||
        (combosF?.length ?? 0) > 0 ||
        (receitasF?.length ?? 0) > 0;
      if (!hasMatch) return null;
      return {
        ...v,
        produtos: tituloMatch ? (v.produtos ?? []) : produtosF,
        combos: tituloMatch ? v.combos : combosF,
        receitas: tituloMatch ? v.receitas : receitasF,
      };
    })
    .filter((v): v is VitrineComProdutosResponse => v != null);
}
