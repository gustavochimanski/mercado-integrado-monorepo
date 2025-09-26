// src/services/usePedidosAdmin.ts
import apiMensura from "@supervisor/lib/api/apiMensura"
import { mensuraApi } from "@supervisor/api/MensuraApi"
import type { PedidoKanban, PedidoStatus, PagamentoMetodo, PagamentoGateway } from "@supervisor/types/pedido"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@supervisor/hooks/use-toast"
import { getErrorMessage } from "@supervisor/lib/getErrorMessage"

export function useFetchPedidosAdminKanban(date: string, empresaId?: string) {
  return useQuery<PedidoKanban[]>({
    queryKey: ["pedidosAdminKanban", date, empresaId],
    queryFn: async () => {
      let url = `/api/delivery/pedidos/admin/kanban?date_filter=${date}`

      if (empresaId) {
        url += `&empresa_id=${empresaId}`
      } else {
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

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["pedidosAdminKanban"], exact: false })
    qc.invalidateQueries({ queryKey: ["pedidoDetalhes"], exact: false })
    // Forçar refetch de todas as queries relacionadas a pedidos
    qc.refetchQueries({ queryKey: ["pedidoDetalhes"], exact: false })
  }

  const atualizarStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: PedidoStatus }) => {
      const { data } = await apiMensura.put(`/api/delivery/pedidos/admin/status/${id}?novo_status=${status}`)
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

  const vincularEntregador = useMutation({
    mutationFn: async ({ pedidoId, entregadorId }: { pedidoId: number; entregadorId: number | null }) => {
      if (entregadorId === null) {
        // Usar DELETE para desvincular (sem parâmetros, apenas pedido_id na URL)
        const { data } = await apiMensura.delete(`/api/delivery/pedidos/admin/${pedidoId}/entregador`)
        return data
      } else {
        // Usar PUT para vincular
        const { data } = await apiMensura.put(`/api/delivery/pedidos/admin/${pedidoId}/entregador?entregador_id=${entregadorId}`, {})
        return data
      }
    },
    onSuccess: (data, variables) => {
      if (variables.entregadorId === null) {
        toast({ title: "Entregador desvinculado", description: "O entregador foi desvinculado do pedido com sucesso." })
      } else {
        toast({ title: "Entregador vinculado", description: "O entregador foi vinculado ao pedido com sucesso." })
      }
      
      // Invalidar e refetch específico do pedido
      qc.invalidateQueries({ queryKey: ["pedidosAdminKanban"], exact: false })
      qc.invalidateQueries({ queryKey: ["pedidoDetalhes", variables.pedidoId] })
      qc.refetchQueries({ queryKey: ["pedidoDetalhes", variables.pedidoId] })
    },
    onError: (err: any) => {
      toast({ title: "Erro ao vincular entregador", description: getErrorMessage(err), variant: "destructive" })
    },
  })

  return { atualizarStatus, confirmarPagamento, vincularEntregador }
}

export function useFetchPedidoDetalhes(pedidoId: number | null) {
  return useQuery({
    queryKey: ["pedidoDetalhes", pedidoId],
    queryFn: async () => {
      if (!pedidoId) return null
      const { data } = await apiMensura.get(`/api/delivery/pedidos/admin/${pedidoId}`)
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
      const response = await apiMensura.put(`/api/delivery/pedidos/admin/${pedidoId}`, data)
      return response.data
    },
    onSuccess: () => {
      toast({ title: "Pedido atualizado", description: "As informações do pedido foram atualizadas com sucesso." })
      qc.invalidateQueries({ queryKey: ["pedidosAdminKanban"], exact: false })
      // Removido: não invalidar pedidoDetalhes para preservar endereço atualizado
      // qc.invalidateQueries({ queryKey: ["pedidoDetalhes"], exact: false })
    },
    onError: (err: any) => {
      toast({ title: "Erro ao atualizar pedido", description: getErrorMessage(err), variant: "destructive" })
    },
  })
}

export function useUpdateCliente() {
  const qc = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ clienteId, data }: { clienteId: number; data: any }) => {
      const response = await mensuraApi.clienteAdminDelivery.updateClienteAdminApiDeliveryClienteAdminUpdateClienteIdPut(clienteId, {
        nome: data.nome,
        cpf: data.cpf,
        telefone: data.telefone,
        email: data.email,
        data_nascimento: data.data_nascimento,
        ativo: data.ativo
      })
      return response
    },
    onSuccess: () => {
      // Não fazer invalidação automática aqui, deixar para o componente controlar
    },
    onError: (err: any) => {
      toast({ title: "Erro ao atualizar cliente", description: getErrorMessage(err), variant: "destructive" })
    },
  })
}

export function useUpdateItens() {
  const qc = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ pedidoId, itens }: { pedidoId: number; itens: any[] }) => {
      // Validar se há itens para atualizar
      if (!itens || itens.length === 0) {
        throw new Error("Nenhum item para atualizar")
      }

      // Filtrar apenas itens válidos
      const itensValidos = itens.filter(item =>
        item.quantidade > 0 &&
        item.produto_cod_barras
      )

      if (itensValidos.length === 0) {
        throw new Error("Nenhum item válido para atualizar")
      }

      // Formatar dados conforme modelo ItemPedidoEditar
      const itensFormatados = itensValidos.map(item => ({
        id: item.id || null,
        produto_cod_barras: item.produto_cod_barras || null,
        quantidade: Number(item.quantidade) || null,
        preco_unitario: Number(item.preco_unitario) || null,
        observacao: item.observacao || "",
        acao: "atualizar"
      }))

      // Validar se todos os campos obrigatórios estão presentes
      const itensComErros = itensFormatados.filter(item =>
        !item.produto_cod_barras ||
        !item.quantidade ||
        item.quantidade <= 0 ||
        item.preco_unitario === null ||
        item.preco_unitario === undefined ||
        item.preco_unitario <= 0
      )

      if (itensComErros.length > 0) {
        throw new Error(`Itens com dados inválidos: ${itensComErros.length} de ${itensFormatados.length}`)
      }

      const response = await apiMensura.put(`/api/delivery/pedidos/admin/${pedidoId}/itens`, itensFormatados)
      return response.data
    },
    onSuccess: (data, variables) => {
      toast({ title: "Itens atualizados", description: "Os itens do pedido foram atualizados com sucesso." })

      // Invalidar apenas o kanban (preservar endereço atualizado)
      qc.invalidateQueries({ queryKey: ["pedidosAdminKanban"], exact: false })
      // Removido: não invalidar pedidoDetalhes para preservar endereço atualizado
      // qc.invalidateQueries({ queryKey: ["pedidoDetalhes", variables.pedidoId] })
    },
    onError: (err: any) => {
      // Extrair mensagem de erro mais específica
      let errorMessage = getErrorMessage(err)
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail
      } else if (err.response?.data?.details) {
        errorMessage = JSON.stringify(err.response.data.details)
      } else if (err.response?.status === 422) {
        errorMessage = "Erro de validação: " + JSON.stringify(err.response.data)
      }

      toast({ title: "Erro ao atualizar itens", description: errorMessage, variant: "destructive" })
    },
  })
}

export function useUpdateEndereco() {
  const qc = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ 
      clienteId, 
      enderecoId, 
      endereco 
    }: { 
      clienteId: number; 
      enderecoId: number; 
      endereco: any 
    }) => {
      const { data } = await apiMensura.put(`/api/delivery/enderecos/admin/cliente/${clienteId}/endereco/${enderecoId}`, {
        cep: endereco.cep,
        logradouro: endereco.logradouro,
        numero: endereco.numero,
        complemento: endereco.complemento,
        bairro: endereco.bairro,
        cidade: endereco.cidade,
        estado: endereco.estado,
        ponto_referencia: endereco.ponto_referencia,
        latitude: endereco.latitude,
        longitude: endereco.longitude,
        is_principal: endereco.is_principal
      })
      return data
    },
    onSuccess: () => {
      toast({ 
        title: "Endereço atualizado", 
        description: "O endereço foi atualizado com sucesso no servidor." 
      })
    },
    onError: (err: any) => {
      toast({ 
        title: "Erro ao atualizar endereço", 
        description: getErrorMessage(err), 
        variant: "destructive" 
      })
    },
  })
}