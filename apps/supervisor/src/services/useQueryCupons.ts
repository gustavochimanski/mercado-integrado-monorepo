import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import apiMensura from "@supervisor/lib/api/apiMensura";
import { useToast } from "@supervisor/hooks/use-toast";
import { getErrorMessage } from "@supervisor/lib/getErrorMessage";

// -----------------------------
// 🔧 Utilitários
// -----------------------------
/**
 * Gera automaticamente o link do cardápio com o código do cupom como parâmetro
 * @param codigo - Código do cupom
 * @param cardapioLink - Link do cardápio da empresa (vem da API)
 * @param empresaId - ID da empresa (opcional, para logs)
 * @returns Link formatado: CARDAPIO_LINK/?cupom=CODIGO_DO_CUPOM
 * 
 * @example
 * generateCupomLink("DESCONTO10", "https://cardapio.empresa.com.br", 1) 
 * // Retorna: "https://cardapio.empresa.com.br/?cupom=DESCONTO10"
 */
export function generateCupomLink(codigo: string, cardapioLink?: string, empresaId?: number): string {
  if (!cardapioLink) {
    console.warn(`cardapio_link não fornecido para empresa ${empresaId || 'desconhecida'}, usando URL padrão`);
    const defaultBaseUrl = process.env.NEXT_PUBLIC_CARDAPIO_URL || "https://cardapio.mensura.com.br";
    return `${defaultBaseUrl}/?cupom=${encodeURIComponent(codigo)}`;
  }
  
  // Remove barra final se existir para evitar dupla barra
  const cleanUrl = cardapioLink.replace(/\/$/, '');
  return `${cleanUrl}/?cupom=${encodeURIComponent(codigo)}`;
}

// -----------------------------
// 🔎 Tipos
// -----------------------------
export interface EmpresaCupom {
  id: number;
  nome: string;
  cardapio_link: string;
}

export interface Cupom {
  id: number;
  codigo: string;
  descricao?: string;
  desconto_valor?: number;
  desconto_percentual?: number;
  ativo: boolean;
  validade_inicio?: string;
  validade_fim?: string;
  minimo_compra?: number;
  created_at: string;
  updated_at: string;
  monetizado: boolean;
  valor_por_lead?: number;
  parceiro_id?: number;
  link_redirecionamento?: string;
  empresa_ids: number[]; // Array de IDs das empresas participantes
  empresas?: EmpresaCupom[]; // Array completo das empresas participantes (vem da API)
}

export interface Parceiro {
  id: number;
  nome: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

// -----------------------------
// ⏳ Debounce simples
// -----------------------------
export function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// -----------------------------
// ✅ Hooks de consulta
// -----------------------------
export function useCupons(empresaId?: number, enabled = true) {
  return useQuery<Cupom[]>({
    queryKey: ["cupons", empresaId],
    queryFn: async () => {
      const params = empresaId ? { empresa_id: empresaId } : {};
      const { data } = await apiMensura.get<Cupom[]>("/api/delivery/cupons", { params });
      return data;
    },
    enabled: enabled,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useParceiros(enabled = true) {
  return useQuery<Parceiro[]>({
    queryKey: ["parceiros"],
    queryFn: async () => {
      const { data } = await apiMensura.get<Parceiro[]>("/api/delivery/parceiros");
      return data;
    },
    enabled,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

// -----------------------------
// ✅ Hooks de mutation (cupons)
// -----------------------------
export function useMutateCupom() {
  const qc = useQueryClient();
  const { toast } = useToast();

  const invalidate = () => qc.invalidateQueries({ queryKey: ["cupons"] });

  const create = useMutation({
    mutationFn: (body: Omit<Cupom, "id" | "created_at" | "updated_at">) => {
      
      // Validação: empresa_ids é obrigatório se monetizado
      if (body.monetizado && (!body.empresa_ids || body.empresa_ids.length === 0)) {
        throw new Error("Selecione pelo menos uma empresa participante para cupom monetizado");
      }
      
      return apiMensura.post("/api/delivery/cupons", {
        ...body,
        // Só envia parceiro se monetizado
        parceiro_id: body.monetizado ? body.parceiro_id : undefined,
        // Sempre envia empresa_ids (selecionadas pelo usuário)
        empresa_ids: body.empresa_ids || [],
        // link_redirecionamento
        link_redirecionamento: body.link_redirecionamento,
      });
    },
    onSuccess: () => {
      toast({ title: "Cupom criado!", description: "O cupom foi criado com sucesso." });
      invalidate();
    },
    onError: (err) =>
      toast({
        title: "Erro ao criar cupom",
        description: getErrorMessage(err),
        variant: "destructive",
      }),
  });

  const update = useMutation({
    mutationFn: ({ id, ...body }: Partial<Cupom> & { id: number }) => {
      
      // Validação: empresa_ids é obrigatório se monetizado
      if (body.monetizado && (!body.empresa_ids || body.empresa_ids.length === 0)) {
        throw new Error("Selecione pelo menos uma empresa participante para cupom monetizado");
      }
      
      return apiMensura.put(`/api/delivery/cupons/${id}`, {
        ...body,
        // Só envia parceiro se monetizado
        parceiro_id: body.monetizado ? body.parceiro_id : undefined,
        // Sempre envia empresa_ids (selecionadas pelo usuário)
        empresa_ids: body.empresa_ids || [],
        // link_redirecionamento
        link_redirecionamento: body.link_redirecionamento,
      });
    },
    onSuccess: () => {
      toast({ title: "Cupom atualizado!", description: "O cupom foi atualizado com sucesso." });
      invalidate();
    },
    onError: (err) =>
      toast({
        title: "Erro ao atualizar cupom",
        description: getErrorMessage(err),
        variant: "destructive",
      }),
  });

  const remove = useMutation({
    mutationFn: (id: number) => apiMensura.delete(`/api/delivery/cupons/${id}`),
    onSuccess: () => {
      toast({ title: "Cupom removido!", description: "O cupom foi removido com sucesso." });
      invalidate();
    },
    onError: (err) =>
      toast({
        title: "Erro ao remover cupom",
        description: getErrorMessage(err),
        variant: "destructive",
      }),
  });

  return { create, update, remove };
}

