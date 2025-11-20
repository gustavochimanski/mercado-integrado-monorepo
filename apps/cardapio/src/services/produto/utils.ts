// @cardapio/services/produto/utils.ts
import type { CreateProdutoInput, UpdateProdutoInput } from "./types";

function decimalToForm(v: number | string | null | undefined, decimals: number) {
  if (v === null || v === undefined || v === "") return undefined;
  const n = typeof v === "string" ? Number(v.replace(",", ".")) : Number(v);
  if (Number.isNaN(n)) return undefined;
  return n.toFixed(decimals);
}

export function buildProdutoFormData(input: CreateProdutoInput | UpdateProdutoInput) {
  const fd = new FormData();

  fd.append("cod_empresa", String(input.cod_empresa));
  if (!("cod_barras" in input) || (input as any)._method === "POST") {
    fd.append("cod_barras", String((input as any).cod_barras ?? ""));
  }

  fd.append("descricao", input.descricao.trim());
  fd.append("cod_categoria", String(input.cod_categoria));

  const preco = decimalToForm(input.preco_venda, 2);
  if (preco !== undefined) fd.append("preco_venda", preco);

  const custo = decimalToForm(input.custo ?? undefined, 5);
  if (custo !== undefined) fd.append("custo", custo);

  if (input.vitrine_id !== undefined && input.vitrine_id !== null) {
    fd.append("vitrine_id", String(input.vitrine_id));
  }

  if (input.data_cadastro) {
    const iso = typeof input.data_cadastro === "string"
      ? input.data_cadastro
      : input.data_cadastro.toISOString().slice(0, 10);
    fd.append("data_cadastro", iso);
  }

  if (input.imagem) fd.append("imagem", input.imagem);

  return fd;
}

