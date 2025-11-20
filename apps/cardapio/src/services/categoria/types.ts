// @cardapio/services/categoria/types.ts
import { CategoriaMini } from "../home/types";

export interface CreateCategoriaBody {
  descricao: string;
  cod_empresa: number;
  parent_id?: number | null;
  slug?: string;
  posicao?: number;
}

export interface UpdateCategoriaBody extends CreateCategoriaBody {
  id: number;
}

export interface UploadImagemBody {
  id: number;
  cod_empresa: number;
  imagem: File;
}

export interface CategoriaSearchItem {
  id: number;
  descricao: string;
  slug: string;
  parent_id: number | null;
  slug_pai: string | null;
  imagem?: string | null;
}

export type { CategoriaMini };

