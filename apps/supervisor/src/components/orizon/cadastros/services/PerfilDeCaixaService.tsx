
import { PatchConfPerfilPayload, TypePerfilPdv } from '../types/typesPDVS';
import api from "@supervisor/lib/api/apiOrizon";



// ======================================================================================
// ================================ CLIENT ==============================================

//=========== BUSCA TODOS PERFIS DE CAIXA ============
//====================================================
export const fetchAllPerfis = async (): Promise<TypePerfilPdv[]> => {
  const response = await api.get('/v1/config/perfilpdv');
  return response.data;
};

//============== BUSCA PERFIL POR ID =================
//====================================================
export const fetchPerfilById = async (id: string): Promise<TypePerfilPdv> => {
  const response = await api.get(`/v1/config/perfilpdv/${id}`);
  return response.data;
};

//=========== INSERIR PERFIL POR DESCRICAO ===========
//====================================================
export const postNewPerfilPdv = async (
  descricao: string,
) => {
  const payload = {
    id: 0, // ou null, depende se a API ignora esse campo pra criação
    descricao,
  };

  const response = await api.post("/v1/config/perfilpdv", payload);
  return response.data;
};

//============== DELETE PERFIL POR ID  ===============
//====================================================
export const deletePerfilById = async (id: string) => {
  const response = await api.delete(`/v1/config/perfilpdv/${id}`);
  return response.data;
};

//============ ATUALIZA CONFIGS POR ID ===============
//====================================================
export const putConfPerfilById = async (idPerfil: string, payload: PatchConfPerfilPayload) => {
  const response = await api.put(`/v1/config/confperfil/${idPerfil}`, payload);
  return response.data;
};

//================ ATUALIZA DESCRICAO ================
//====================================================
export const patchAlteraDescricaoById = async (idPerfil: string, descricao: string) => {
  const response = await api.patch(`/v1/config/perfilpdv/${idPerfil}`, { descricao });
  return response.data;
};



// ======================================================================================
// ================================== SSR ===============================================
// ======================================================================================

export const fetchAllPerfisSSR = async (): Promise<TypePerfilPdv[]> => {
  const response = await api.get("config/perfilpdv")
  return response.data
};

