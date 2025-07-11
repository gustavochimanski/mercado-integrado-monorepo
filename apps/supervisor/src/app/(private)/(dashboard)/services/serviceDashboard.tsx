// src/services/serviceDashboard.ts
import { TypeDashboardResponse, TypeFiltroDashboard } from "../types/typeDashboard";
import apiMensura from "@supervisor/lib/api/apiMensura";

export const postHeaderDashboard = async (
  payload: TypeFiltroDashboard
): Promise<TypeDashboardResponse> => {
  try {
    const { data } = await apiMensura.post<TypeDashboardResponse>(
      "/bi/dashboard/periodo",
      payload
    );
    return data;
  } catch (err: any) {
    if (err.response) {
      throw new Error(err.response.data.detail || "Erro na API");
    } else {
      throw new Error("Erro de rede ou API está fora");
    }
  }
};
