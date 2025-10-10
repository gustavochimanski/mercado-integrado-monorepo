//============= BUSCA TODOS OS USUARIOS ==============
import api from "@supervisor/lib/api/apiOrizon";


import { TypeUsuario, TypeUsuariosResponse } from "../types/typesUsuarios";

//====================================================
export const fetchAllUsers = async (): Promise<TypeUsuariosResponse> => {
  const response = await api.get('/v1/config/usuario');
  return response.data;
};

export const postNewUser= async (payload: TypeUsuario): Promise<TypeUsuario> => {
  const response = await api.post('/v1/config/usuario', payload);
  return response.data
}
