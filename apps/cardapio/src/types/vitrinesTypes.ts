
export interface VitrineDelivery {
  id: number;
  cod_empresa: number;
  cod_categoria: number;
  titulo: string;
  slug: string;
  ordem: number;
}


export interface CreateVitrineDTO {
  cod_empresa: number;
  cod_categoria: number;
  titulo: string;
  ordem: number;
}
