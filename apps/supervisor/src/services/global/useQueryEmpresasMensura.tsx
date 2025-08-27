// @supervisor/services/mensura/useEmpresas.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiMensura from "@supervisor/lib/api/apiMensura";
import { EmpresaMensura } from "@supervisor/types/empresas/TypeEmpresasMensura";
import { toastErro, toastSucess } from "@supervisor/lib/toast"; // <- seus helpers

type ListParams = { skip?: number; limit?: number };

export interface EmpresaForm {
  nome: string;
  cnpj?: string;
  slug: string;
  logo?: FileList;
  endereco: {
    logradouro: string;
    numero: string;
    bairro?: string;
    cidade?: string;
    cep?: string;
  };
}

// -- Queries existentes
export function useEmpresas({ skip = 0, limit = 100 }: ListParams = {}) {
  return useQuery<EmpresaMensura[], Error>({
    queryKey: ["empresas", skip, limit],
    queryFn: async () => {
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

// -- Função utilitária para montar FormData
const buildFormData = (data: EmpresaForm) => {
  const formData = new FormData();
  formData.append("nome", data.nome);
  formData.append("cnpj", data.cnpj ?? "");
  formData.append("slug", data.slug);
  if (data.logo && data.logo[0]) {
    formData.append("logo", data.logo[0]);
  }
  formData.append("endereco", JSON.stringify(data.endereco));
  return formData;
};

// -- Mutations com toast
export function useCreateEmpresa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: EmpresaForm) => {
      const formData = buildFormData(data);
      const { data: response } = await apiMensura.post("/api/mensura/empresas/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empresas"] });
      toastSucess("Empresa cadastrada com sucesso!");
    },
    onError: (err) => {
      console.error(err);
      toastErro("Erro ao cadastrar empresa");
    },
  });
}

export function useUpdateEmpresa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: EmpresaForm }) => {
      const formData = buildFormData(data);
      const { data: response } = await apiMensura.put(`/api/mensura/empresas/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["empresas"] });
      queryClient.invalidateQueries({ queryKey: ["empresa", id] });
      toastSucess("Empresa atualizada com sucesso!");
    },
    onError: (err) => {
      console.error(err);
      toastErro("Erro ao atualizar empresa");
    },
  });
}
