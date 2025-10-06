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

      // Invalidar cache (React Query refetch automaticamente)
      qc.invalidateQueries({ queryKey: ["pedidosAdminKanban"], exact: false })
      qc.invalidateQueries({ queryKey: ["pedidoDetalhes", variables.pedidoId] })
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
    staleTime: 1 * 60 * 1000, // 1 minuto - dados considerados frescos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false, // Evitar refetch ao focar janela
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
    onSuccess: (data, variables) => {
      toast({ title: "Pedido atualizado", description: "As informações do pedido foram atualizadas com sucesso." })
      qc.invalidateQueries({ queryKey: ["pedidosAdminKanban"], exact: false })
      // Invalidar apenas o pedido específico (mantém cache de outros pedidos)
      qc.invalidateQueries({ queryKey: ["pedidoDetalhes", variables.pedidoId] })
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
      // Validação dos campos obrigatórios
      if (!data.nome?.trim()) {
        throw new Error("Nome é obrigatório")
      }
      if (!data.telefone?.trim()) {
        throw new Error("Telefone é obrigatório")
      }

      // Preparar dados no formato correto da API
      const clienteData = {
        nome: data.nome?.trim() || null,
        cpf: data.cpf?.trim() || null,
        telefone: data.telefone?.trim() || null,
        email: data.email?.trim() || null,
        data_nascimento: data.data_nascimento || null,
        ativo: data.ativo ?? null,
        // Campo endereco é opcional, mas se não for fornecido, não incluir
        ...(data.endereco && { endereco: data.endereco })
      }

      try {
        const response = await apiMensura.put(`/api/delivery/cliente/admin/update/${clienteId}`, clienteData)
        return response.data
      } catch (error: any) {
        // Tratamento específico de erros da API
        if (error.response?.status === 422) {
          const errorMessage = error.response?.data?.detail || "Dados inválidos"
          throw new Error(`Erro de validação: ${errorMessage}`)
        } else if (error.response?.status === 404) {
          throw new Error("Cliente não encontrado")
        } else if (error.response?.status === 400) {
          const errorMessage = error.response?.data?.detail || "Dados inválidos"
          throw new Error(`Erro na requisição: ${errorMessage}`)
        } else {
          throw new Error(`Erro do servidor: ${error.message}`)
        }
      }
    },
    onSuccess: () => {
      // Invalidar cache de clientes
      qc.invalidateQueries({ queryKey: ["clientes"], exact: false })
      toast({ title: "Cliente atualizado", description: "O cliente foi atualizado com sucesso." })
    },
    onError: (err: any) => {
      console.error("Erro detalhado ao atualizar cliente:", err)
      toast({ 
        title: "Erro ao atualizar cliente", 
        description: err.message || getErrorMessage(err), 
        variant: "destructive" 
      })
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

      // Separar itens novos dos existentes
      const itensNovos = itensValidos.filter(item => !item.id && item.action !== "remove")
      const itensExistentes = itensValidos.filter(item => item.id)

      // Array para armazenar todas as promises
      const promises = []

      // Processar itens existentes (atualizar/remover)
      for (const item of itensExistentes) {
        const itemFormatado: any = {
          id: item.id,
          produto_cod_barras: item.produto_cod_barras,
          quantidade: Number(item.quantidade),
          observacao: item.observacao || "",
          acao: "atualizar"
        }

        if (item.action === "remove") {
          itemFormatado.acao = "remover"
        }

        promises.push(
          apiMensura.put(`/api/delivery/pedidos/admin/${pedidoId}/itens`, itemFormatado)
        )
      }

      // Processar itens novos (sem ID - API detecta automaticamente como adicionar)
      for (const item of itensNovos) {
        const itemFormatado: any = {
          produto_cod_barras: item.produto_cod_barras,
          quantidade: Number(item.quantidade),
          observacao: item.observacao || ""
        }

        // Tentar primeiro sem acao, se não funcionar backend deve informar qual usar
        promises.push(
          apiMensura.put(`/api/delivery/pedidos/admin/${pedidoId}/itens`, itemFormatado)
        )
      }

      // Executar todas as requisições em paralelo
      const responses = await Promise.all(promises)
      return responses[responses.length - 1]?.data
    },
    onSuccess: (data, variables) => {
      toast({ title: "Itens atualizados", description: "Os itens do pedido foram atualizados com sucesso." })

      // Invalidar kanban e pedido específico
      qc.invalidateQueries({ queryKey: ["pedidosAdminKanban"], exact: false })
      qc.invalidateQueries({ queryKey: ["pedidoDetalhes", variables.pedidoId] })
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