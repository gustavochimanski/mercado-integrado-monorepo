// @supervisor/services/mensura/useEmpresas.ts
import { useQuery } from "@tanstack/react-query";
import apiMensura from "@supervisor/lib/api/apiMensura";
import { EmpresaMensura } from "@supervisor/types/empresas/TypeEmpresasMensura";

type ListParams = { skip?: number; limit?: number };

export function useEmpresas({ skip = 0, limit = 100 }: ListParams = {}) {
  return useQuery<EmpresaMensura[], Error>({
    queryKey: ["empresas", skip, limit],
    queryFn: async () => {
      // Rotas do seu FastAPI: /api/mensura/empresas
      const { data } = await apiMensura.get("api/mensura/empresas/", {
        params: { skip, limit },
      });
      return data;
    },
    staleTime: 60_000, 
  });
}

export function useEmpresa(id?: number) {
  return useQuery<EmpresaMensura, Error>({
    queryKey: ["empresa", id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await apiMensura.get(`api/mensura/empresas/${id}`);
      return data;
    },
  });
}
