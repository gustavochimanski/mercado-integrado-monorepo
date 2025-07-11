// src/services/categoriaDeliveryService.ts

import { api } from "../app/api/api";
import { CategoriaComProdutos } from "../types/Categorias";


export async function fetchCategoriasDelivery(empresaId: number): Promise<CategoriaComProdutos[]> {
  const { data } = await api.get("/mensura/cardapio", {
    params: { empresaId }
  });
  return data;
}
