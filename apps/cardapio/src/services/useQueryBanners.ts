import { apiClienteAdmin } from "@cardapio/app/api/apiClienteAdmin";
import {  useQuery, useQueryClient } from "@tanstack/react-query";

// 🔎 Tipo do banner
export interface Banner {
  id: number;
  nome: string;
  parceiro_id: number;
  parceiro_nome: string;
  tipo_banner: "V" | "H";
  ativo: boolean;
  href_destino: string | null
  imagem: string;
  created_at: string;
  updated_at: string;
}

// ✅ Buscar todos os banners
export function useBanners(enabled = true) {
  const qc = useQueryClient();
  return useQuery<Banner[]>({
    queryKey: ["banners"],
    queryFn: async () => {
      const { data } = await apiClienteAdmin.get<Banner[]>("/delivery/public/banners");
      return data;
    },
    enabled,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}