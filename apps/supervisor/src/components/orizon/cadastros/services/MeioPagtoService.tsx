// services/meioPagamentoService.ts
import api from "@supervisor/lib/api/apiOrizon";
import { ConfiguracaoMeioPag, MeioPgto } from "../types/typesMeioPag";

//====================================================
//=========== BUSCA MEIO DE PAGAMENTO POR ID =========
//====================================================
export const fetchByIdMeioPgto = async (id: string) => {
  const response = await api.get<MeioPgto>(`/v1/config/meiospgto/${id}`)
  return response.data
}

//====================================================
//======== BUSCA TODOS OS MEIOS DE PAGAMENTO =========
//====================================================
export const fetchAllMeioPgto = async () => {
  const response = await api.get<MeioPgto[]>("/v1/config/meiospgto")
  return response.data
}

//====================================================
//======== ATUALIZA DESCRICAO MEIO PAGAMENTO =========
//====================================================
export const atualizarDescricaoMeioPgto = async (id: string, novaDescricao: string ): Promise<MeioPgto> => {
  const response = await api.patch<MeioPgto>(`/v1/config/meiospgto/${id}`, {
    descricao: novaDescricao,
  });
  return response.data;
};

//====================================================
//======== ATUALIZA CONFIGS MEIO DE PAGAMENTO ========
//====================================================
export const atualizarConfigMeioPgto = async (payload: ConfiguracaoMeioPag[]): Promise<ConfiguracaoMeioPag[]> => {
  const response = await api.put<ConfiguracaoMeioPag[]>('/v1/config/confmeiospgto', payload)
  return response.data
}

//====================================================
//============ INCLUI MEIO DE PAGAMENTO ==============
//====================================================
export const incluiMeioPgtoById = async (descricao: string, tipoMeioPgto: string): Promise<MeioPgto> => {
  const payload = {
    descricao,
    tipoMeioPgto,
  };
  
  const response = await api.post(`/v1/config/meiospgto`, payload);
  return response.data;
};