// src/services/usePedidosAdmin.ts
import apiMensura from "@supervisor/lib/api/apiMensura"
import type { PedidoKanban, PedidoStatus, PagamentoMetodo, PagamentoGateway } from "@supervisor/types/pedido"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@supervisor/hooks/use-toast"
import { getErrorMessage } from "@supervisor/lib/getErrorMessageOrizon"

export function useFetchPedidosAdminKanban(date: string, empresaId?: string) {
  return useQuery<PedidoKanban[]>({
    queryKey: ["pedidosAdminKanban", date, empresaId],
    queryFn: async () => {
      let url = `/api/delivery/pedidos/admin/kanban?date_filter=${date}`

      if (empresaId) {
        url += `&empresa_id=${empresaId}`
        console.log("[v0] URL da requisição:", url)
      } else {
        console.log("[v0] ERRO: empresa_id é obrigatório mas não foi fornecido")
        throw new Error("empresa_id é obrigatório")
      }

      const { data } = await apiMensura.get(url)
      return data
    },
    refetchInterval: 15000,
    enabled: !!empresaId,
  })
}

export function useMutatePedidoAdmin() {
  const qc = useQueryClient()
  const { toast } = useToast()

  const invalidate = () => qc.invalidateQueries({ queryKey: ["pedidosAdminKanban"], exact: false })

  const atualizarStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: PedidoStatus }) => {
      const { data } = await apiMensura.put(`/api/delivery/pedidos/status/${id}?status=${status}`)
      return data
    },
    onSuccess: () => {
      toast({ title: "Pedido atualizado", description: "O status do pedido foi atualizado com sucesso." })
      invalidate()
    },
    onError: (err: any) => {
      toast({ title: "Erro ao atualizar pedido", description: getErrorMessage(err), variant: "destructive" })
    },
  })

  const confirmarPagamento = useMutation({
    mutationFn: async ({
      id,
      metodo,
      gateway,
    }: {
      id: number
      metodo?: PagamentoMetodo
      gateway?: PagamentoGateway
    }) => {
      const { data } = await apiMensura.post(`/api/delivery/pedidos/${id}/confirmar-pagamento`, { metodo, gateway })
      return data
    },
    onSuccess: () => {
      toast({ title: "Pagamento confirmado", description: "O pagamento do pedido foi confirmado com sucesso." })
      invalidate()
    },
    onError: (err: any) => {
      toast({ title: "Erro ao confirmar pagamento", description: getErrorMessage(err), variant: "destructive" })
    },
  })

  return { atualizarStatus, confirmarPagamento }
}

export function useFetchPedidoDetalhes(pedidoId: number | null) {
  return useQuery({
    queryKey: ["pedidoDetalhes", pedidoId],
    queryFn: async () => {
      if (!pedidoId) return null
      const { data } = await apiMensura.get(`/api/delivery/pedidos/${pedidoId}`)
      console.log(data)
      return data
    },
    enabled: !!pedidoId,
  })
}

export function useUpdatePedido() {
  const qc = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ pedidoId, data }: { pedidoId: number; data: any }) => {
      const response = await apiMensura.put(`/api/delivery/pedidos/${pedidoId}`, data)
      console.log(response.data)
      return response.data
    },
    onSuccess: () => {
      toast({ title: "Pedido atualizado", description: "As informações do pedido foram atualizadas com sucesso." })
      qc.invalidateQueries({ queryKey: ["pedidosAdminKanban"], exact: false })
      qc.invalidateQueries({ queryKey: ["pedidoDetalhes"], exact: false })
    },
    onError: (err: any) => {
      toast({ title: "Erro ao atualizar pedido", description: getErrorMessage(err), variant: "destructive" })
    },
  })
}
