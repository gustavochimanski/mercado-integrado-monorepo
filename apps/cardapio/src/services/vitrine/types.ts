// @cardapio/services/vitrine/types.ts

// Tipos alinhados ao backend
export type VitrineOut = {
  id: number;
  cod_categoria: number; // se houver chance de null no back, mude para number | null
  titulo: string;
  slug: string;
  ordem: number;
  is_home: boolean;
};

export type CreateVitrinePayload = {
  cod_categoria: number;
  titulo: string;
  ordem?: number;
  is_home?: boolean;
};

export type CreateVitrineDTO = CreateVitrinePayload & { empresa_id?: number };

export type VitrineSearchItem = {
  id: number;
  cod_categoria: number | null;
  titulo: string;
  slug: string;
  ordem: number;
  is_home: boolean;
};

