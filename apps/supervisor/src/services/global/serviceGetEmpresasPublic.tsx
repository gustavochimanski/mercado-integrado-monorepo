import apiMensura from "@supervisor/lib/api/apiMensura";
import { TypeEmpresas } from "@supervisor/types/empresas/TypeEmpresasPublic";


export async function fetchEmpresasDetalhes(): Promise<TypeEmpresas[]> {
    try {
      const { data } = await apiMensura.get("api/public/empresas/detalhes");

      return data;
    } catch (err: any) {
      if (err.response) {
        throw new Error(err.response.data.detail || "Erro na API");
      } else {
        throw new Error("Erro de rede ou API está fora");
      }
    }
}
  