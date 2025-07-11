
export interface SecaoDelivery {
  id: number;
  cod_empresa: number;
  cod_categoria: number;
  titulo: string;
  slug: string;
  ordem: number;
}


export interface CreateSecaoDTO {
  cod_empresa: number;
  cod_categoria: number;
  titulo: string;
  ordem: number;
}
