// @cardapio/services/banners/types.ts

export interface Banner {
  id: number;
  nome: string;
  parceiro_id: number;
  parceiro_nome: string;
  tipo_banner: "V" | "H";
  ativo: boolean;
  href_destino: string | null;
  imagem: string;
  created_at: string;
  updated_at: string;
}

