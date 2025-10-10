
export type TypeIncluirMetaRequest = {
    empresa: string
    data: string
    tipo: TipoMeta
    valor: number
}


export type TipoMeta = "metaVenda" | "metaMargem" | "limiteCompra";


export type TypeIncluiMetaResponse = { mensagem: string };