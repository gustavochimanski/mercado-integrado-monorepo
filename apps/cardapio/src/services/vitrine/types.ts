// @cardapio/services/vitrine/types.ts

// Tipos alinhados ao backend
export type VitrineOut = {
  id: number;
  cod_categoria: number | null;
  titulo: string;
  slug: string;
  ordem: number;
  is_home: boolean;
};

export type CreateVitrinePayload = {
  empresa_id: number;
  cod_categoria?: number | null;
  titulo: string;
  ordem?: number;
  is_home?: boolean;
  landing?: boolean;
};

export type CreateVitrineDTO = Omit<CreateVitrinePayload, "empresa_id"> & { empresa_id?: number };

export type VitrineSearchItem = {
  id: number;
  cod_categoria: number | null;
  titulo: string;
  slug: string;
  ordem: number;
  is_home: boolean;
};

