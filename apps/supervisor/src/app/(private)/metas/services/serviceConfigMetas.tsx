import axios from "axios";
import { TypeIncluiMetaResponse, TypeIncluirMetaRequest } from "../types/typeConfigMetas";

export const postNewMeta = async (payload: TypeIncluirMetaRequest): Promise<TypeIncluiMetaResponse> => {
  try {
    const { data } = await axios.post<TypeIncluiMetaResponse>(
      "http://localhost:8000/metas/insert",
      payload, // aqui o body da requisição
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(data)
    return data;
  } catch (erro: any) {
    console.error("Erro ao inserir meta:", erro);
    throw new Error(erro.response?.data?.detail || "Erro ao salvar meta.");
  }
};
