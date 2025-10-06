"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../ui/dialog"
import { Button } from "../../../ui/button"
import { Badge } from "../../../ui/badge"
import { Edit, Save, X, Building2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/tabs"
import { useToast } from "../../../../hooks/use-toast"
import { useMeiosPagamento } from "@supervisor/services/useQueryMeioPagamento"
import { useFetchPedidoDetalhes } from "@supervisor/services/useQueryPedidoAdmin"
import { useUpdatePedido, useUpdateCliente, useUpdateItens, useUpdateEndereco, useMutatePedidoAdmin } from "@supervisor/services/useQueryPedidoAdmin"
import { useUpdateEnderecoCliente, useCreateEnderecoCliente } from "@supervisor/services/useQueryEnderecoCliente"
import { useQueryClient } from "@tanstack/react-query"
import { User, CreditCard, Truck, Package, History } from "lucide-react"
import { ClienteTab } from "./ClienteTab"
import { PagamentoTab } from "./PagamentoTab"
import { EntregaTab } from "./EntregaTab"
import { ItensTab } from "./ItensTab"
import { HistoricoTab } from "./HistoricoTab"
import { PedidoModalProps, PedidoFormData } from "@supervisor/types/pedidos/modal"

// Componente principal do modal de pedido
export const PedidoModal: React.FC<PedidoModalProps> = ({ pedido, isOpen, onClose }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<PedidoFormData>({
    meio_pagamento_id: null,
    observacao_geral: "",
    troco_para: 0,
    entregador_id: null,
    nome_cliente: "",
    cpf_cliente: "",
    telefone_cliente: "",
    email_cliente: "",
    data_nascimento_cliente: "",
  })

  // Hooks para dados e mutações
  const { data: meiosPagamento = [] } = useMeiosPagamento()
  const { data: pedidoCompleto, isLoading } = useFetchPedidoDetalhes(pedido?.id || null)
  const updatePedidoMutation = useUpdatePedido()
  const updateClienteMutation = useUpdateCliente()
  const updateItensMutation = useUpdateItens()
  const updateEnderecoMutation = useUpdateEnderecoCliente()
  const createEnderecoMutation = useCreateEnderecoCliente()
  const { vincularEntregador } = useMutatePedidoAdmin()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Estado para edição de itens
  const [itensEditados, setItensEditados] = useState<any[]>([])
  const [isEditingItens, setIsEditingItens] = useState(false)
  const [isSavingItens, setIsSavingItens] = useState(false)

  // Estado para edição de endereço
  const [isUpdatingEndereco, setIsUpdatingEndereco] = useState(false)
  
  // Função para verificar se o pedido pode ser editado
  const canEdit = () => {
    const status = pedidoCompleto?.status || pedido?.status
    return status === "P" || status === "R"
  }

  // Funções auxiliares Status
  const getStatusText = (status: string) => {
    switch (status) {
      case "P":
        return "Pendente"
      case "R":
        return "Em Preparo"
      case "S":
        return "Saiu para Entrega"
      case "E":
        return "Entregue"
      case "C":
        return "Cancelado"
      default:
        return status
    }
  }

  // Função auxiliar para definir a cor do badge de status
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "P":
        return "destructive"
      case "R":
        return "default"
      case "S":
        return "secondary"
      case "E":
        return "default"
      case "C":
        return "destructive"
      default:
        return "default"
    }
  }

  // Formatação de moeda e data
  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }

  // Função para formatar data e hora
  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString("pt-BR")
  }

  // Função para obter endereço completo do cliente
  const getEnderecoCompleto = () => {
    if (!pedidoCompleto?.endereco?.endereco_selecionado) return "Não informado"
    const { logradouro, numero, complemento, bairro, cidade, estado, cep } = pedidoCompleto.endereco.endereco_selecionado
    const parts = [
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      cep
    ].filter(Boolean).join(", ")
    return parts || "Não informado"
  }

  // Função para atualizar/criar endereço
  const handleEnderecoUpdate = async (endereco: any, isNew: boolean = false) => {
    if (!pedidoCompleto?.id || !pedidoCompleto?.cliente?.id) {
      toast({
        title: "Erro",
        description: "Dados insuficientes para salvar o endereço.",
        variant: "destructive"
      })
      return
    }

    setIsUpdatingEndereco(true)
    try {
      if (isNew) {
        // Criar novo endereço
        await createEnderecoMutation.mutateAsync({
          clienteId: pedidoCompleto.cliente.id,
          enderecoData: {
            cep: endereco.cep || "",
            logradouro: endereco.logradouro || "",
            numero: endereco.numero || "",
            complemento: endereco.complemento || "",
            bairro: endereco.bairro || "",
            cidade: endereco.cidade || "",
            estado: endereco.estado || "",
            ponto_referencia: endereco.ponto_referencia || "",
            latitude: endereco.latitude,
            longitude: endereco.longitude,
            is_principal: endereco.is_principal || false
          }
        })
      } else {
        // Atualizar endereço existente
        if (!endereco?.id) {
          toast({
            title: "Erro",
            description: "ID do endereço não encontrado.",
            variant: "destructive"
          })
          return
        }

        await updateEnderecoMutation.mutateAsync({
          clienteId: pedidoCompleto.cliente.id,
          enderecoId: endereco.id,
          enderecoData: {
            cep: endereco.cep || "",
            logradouro: endereco.logradouro || "",
            numero: endereco.numero || "",
            complemento: endereco.complemento || "",
            bairro: endereco.bairro || "",
            cidade: endereco.cidade || "",
            estado: endereco.estado || "",
            ponto_referencia: endereco.ponto_referencia || "",
            latitude: endereco.latitude,
            longitude: endereco.longitude,
            is_principal: endereco.is_principal || false
          }
        })
      }

      // Invalidar cache (React Query refetch automaticamente)
      queryClient.invalidateQueries({
        queryKey: ["pedidoDetalhes", pedidoCompleto.id]
      })
      queryClient.invalidateQueries({
        queryKey: ["enderecosCliente", pedidoCompleto.cliente.id]
      })
      queryClient.invalidateQueries({
        queryKey: ["pedidosAdminKanban"],
        exact: false
      })

    } catch (error) {
      console.error("Erro ao atualizar endereço:", error)
      // O toast de erro já é mostrado pela mutação
    } finally {
      setIsUpdatingEndereco(false)
    }
  }

  // Efeito para inicializar dados quando o modal abre
  useEffect(() => {
    if (isOpen && pedido && pedidoCompleto) {
      setFormData({
        meio_pagamento_id: pedidoCompleto.meio_pagamento?.id || null,
        observacao_geral: pedidoCompleto.observacao_geral || "",
        troco_para: pedidoCompleto.troco_para || 0,
        entregador_id: pedidoCompleto.entregador?.id || null,
        nome_cliente: pedidoCompleto.cliente?.nome || "",
        cpf_cliente: pedidoCompleto.cliente?.cpf || "",
        telefone_cliente: pedidoCompleto.cliente?.telefone || "",
        email_cliente: pedidoCompleto.cliente?.email || "",
        data_nascimento_cliente: pedidoCompleto.cliente?.data_nascimento || "",
      })

      // Inicializar itens para edição
      if (pedidoCompleto.itens) {
        setItensEditados(pedidoCompleto.itens.map((item: any) => ({
          id: item.id,
          produto_cod_barras: item.produto_cod_barras,
          quantidade: item.quantidade,
          preco_unitario: item.preco_unitario,
          observacao: item.observacao || "",
          produto_descricao_snapshot: item.produto_descricao_snapshot,
          produto_imagem_snapshot: item.produto_imagem_snapshot,
          action: "update"
        })))
      }
    }
  }, [isOpen, pedido, pedidoCompleto])

  // Funções para salvar e cancelar edição
  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!pedido || !pedidoCompleto) return
    setIsSaving(true)

    try {
      // Atualizar dados do pedido (sem entregador_id)
      const pedidoData = {
        meio_pagamento_id: formData.meio_pagamento_id,
        observacao_geral: formData.observacao_geral,
        troco_para: formData.troco_para,
      }

      // Gerenciar entregador separadamente
      const entregadorAnterior = pedidoCompleto.entregador?.id || null
      const entregadorNovo = formData.entregador_id

      // Se mudou o entregador, usar endpoint específico
      if (entregadorAnterior !== entregadorNovo) {
        // Só desvincular se tinha entregador antes e agora é null
        if (entregadorAnterior && entregadorNovo === null) {
          await vincularEntregador.mutateAsync({
            pedidoId: pedido.id,
            entregadorId: null
          })
        }
        // Só vincular se está selecionando um entregador
        else if (entregadorNovo !== null && entregadorNovo !== undefined) {
          await vincularEntregador.mutateAsync({
            pedidoId: pedido.id,
            entregadorId: entregadorNovo
          })
        }
        // Se ambos são null, não faz nada (não chama API)
      }

      // Atualizar dados do cliente (se tiver cliente_id)
      if (pedidoCompleto.cliente?.id) {
        const clienteData = {
          nome: formData.nome_cliente,
          cpf: formData.cpf_cliente,
          telefone: formData.telefone_cliente,
          email: formData.email_cliente,
          data_nascimento: formData.data_nascimento_cliente,
        }

        // Fazer as duas chamadas
        await Promise.all([
          updatePedidoMutation.mutateAsync({ pedidoId: pedido.id, data: pedidoData }),
          updateClienteMutation.mutateAsync({ clienteId: pedidoCompleto.cliente.id, data: clienteData })
        ])
      } else {        
        await updatePedidoMutation.mutateAsync({ pedidoId: pedido.id, data: pedidoData })
      }

      setIsEditing(false)

      // Notificar sucesso
      toast({
        title: "Sucesso",
        description: "Pedido e cliente atualizados com sucesso!",
      })

      // Invalidar cache (React Query refetch automaticamente)
      queryClient.invalidateQueries({ queryKey: ["pedidoDetalhes", pedido.id] })
      queryClient.invalidateQueries({ queryKey: ["pedidosAdminKanban"] })

      // Removido: não fechar modal automaticamente
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar pedido.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Função para cancelar edição e resetar dados
  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsEditing(false)
    if (pedidoCompleto) {
      setFormData({
        meio_pagamento_id: pedidoCompleto.meio_pagamento?.id || null,
        observacao_geral: pedidoCompleto.observacao_geral || "",
        troco_para: pedidoCompleto.troco_para || 0,
        entregador_id: pedidoCompleto.entregador?.id || null,
        nome_cliente: pedidoCompleto.cliente?.nome || "",
        cpf_cliente: pedidoCompleto.cliente?.cpf || "",
        telefone_cliente: pedidoCompleto.cliente?.telefone || "",
        email_cliente: pedidoCompleto.cliente?.email || "",
        data_nascimento_cliente: pedidoCompleto.cliente?.data_nascimento || "",
      })
    }
  }

  // Função para obter o nome do meio de pagamento
  const getMeioPagamentoNome = (id: number | null) => {
    if (!id) return "Não informado"
    const meio = meiosPagamento.find((m: { id: number }) => m.id === id)
    return meio?.nome || `Método de Pagamento ${id}`
  }

  // Verifica se o meio de pagamento é em dinheiro
  const isMeioPagamentoDinheiro = () => {
    const meio = meiosPagamento.find((m: { id: number | null }) => m.id === formData.meio_pagamento_id)
    return meio?.tipo === "DINHEIRO"
  }

  // Manipulador de mudança no campo de troco
  const handleTrocoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")
    value = (Number(value) / 100).toFixed(2) + ""
    setFormData((prev) => ({ ...prev, troco_para: Number(value) }))
  }

  // Funções para edição de itens
  const handleEditarItens = () => {
    setIsEditingItens(true)
  }

  // Função para cancelar edição de itens e resetar ao estado original
  const handleCancelarEdicaoItens = () => {
    setIsEditingItens(false)    
    if (pedidoCompleto?.itens) {
      setItensEditados(pedidoCompleto.itens.map((item: any) => ({
        id: item.id,
        produto_cod_barras: item.produto_cod_barras,
        quantidade: item.quantidade,
        preco_unitario: item.preco_unitario,
        observacao: item.observacao || "",
        produto_descricao_snapshot: item.produto_descricao_snapshot,
        produto_imagem_snapshot: item.produto_imagem_snapshot,
        action: "update"
      })))
    }
  }

  // Função para salvar itens editados
  const handleSalvarItens = async () => {
    if (!pedido) return

    // Validar se há mudanças
    const itensValidos = itensEditados.filter(item =>
      item.action !== "remove" &&
      item.quantidade > 0 &&
      item.produto_cod_barras
    )

    // Se não houver itens válidos, mostrar erro
    if (itensValidos.length === 0) {
      toast({
        title: "Nenhum item válido",
        description: "Adicione pelo menos um item válido ao pedido.",
        variant: "destructive"
      })
      return
    }

    setIsSavingItens(true)

    // Chamar a mutação para atualizar itens
    try {      
      const itensParaAPI = itensEditados.map(item => ({
        id: item.id,
        produto_cod_barras: item.produto_cod_barras,
        quantidade: item.quantidade,
        preco_unitario: item.preco_unitario,
        observacao: item.observacao || "",
        produto_descricao_snapshot: item.produto_descricao_snapshot || "",
        produto_imagem_snapshot: item.produto_imagem_snapshot || "",
        action: item.action || "update"
      }))

      // Chamar a mutação para atualizar itens
      await updateItensMutation.mutateAsync({ pedidoId: pedido.id, itens: itensParaAPI })

      // Atualizar cache local do pedidoDetalhes com os novos itens
      queryClient.setQueryData(["pedidoDetalhes", pedido.id], (oldData: any) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          itens: itensEditados.filter(item => item.action !== "remove")
        }
      })

      setIsEditingItens(false)

      toast({
        title: "Itens salvos com sucesso",
        description: "Os itens do pedido foram atualizados."
      })
    } catch (error) {
      toast({
        title: "Erro ao salvar itens",
        description: "Houve um problema ao atualizar os itens. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsSavingItens(false)
    }
  }

  // Manipuladores para mudanças nos itens editados
  const handleQuantidadeChange = (index: number, novaQuantidade: number) => {
    if (novaQuantidade < 1) return
    setItensEditados(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, quantidade: novaQuantidade } : item
      )
    )
  }

  // Manipulador para mudança na observação do item
  const handleObservacaoChange = (index: number, novaObservacao: string) => {
    setItensEditados(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, observacao: novaObservacao } : item
      )
    )
  }

  // Manipulador para remover um item (marca para remoção ou remove do array)
  const handleRemoverItem = (index: number) => {
    setItensEditados(prev => {
      const novoArray = [...prev]
      const item = novoArray[index]
      if (item.id) {
        // Item existente - marcar para remoção
        novoArray[index] = { ...item, action: "remove" }
      } else {
        // Item novo - remover do array
        novoArray.splice(index, 1)
      }
      return novoArray
    })
  }

  // Manipulador para adicionar novo item ao pedido
  const handleAdicionarItem = (produto: any) => {
    setItensEditados(prev => [...prev, produto])
    // Ativar modo de edição automaticamente ao adicionar item
    if (!isEditingItens) {
      setIsEditingItens(true)
    }
  }

  if (!pedido) return null

  // Renderização do modal
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>

          {/* Cabeçalho do modal com título e botões de ação */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <DialogTitle className="text-xl font-bold truncate">Pedido #{pedido.id}</DialogTitle>
              <Badge variant={getStatusVariant(pedido.status)} className="text-xs px-2 py-1 shrink-0">
                {getStatusText(pedido.status)}
              </Badge>
              <Badge variant="outline" className="text-xs px-2 py-1 bg-blue-50 text-blue-700 border-blue-200 shrink-0 hidden sm:flex">
                <Building2 className="w-3 h-3 mr-1" />
                <span className="truncate max-w-[150px]">{pedidoCompleto?.empresa?.nome || "Carregando..."}</span>
              </Badge>
            </div>

            {/* Botões de ação */}
            <div className="flex gap-2 shrink-0 ml-4 mr-4">
              {canEdit() && !isEditing && (
                <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Editar</span>
                </Button>
              )}

              {/* Mostrar botões de salvar/cancelar apenas no modo de edição */}
              {isEditing && (
                <>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Cancelar</span>
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={isSaving}>
                    <Save className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">{isSaving ? "Salvando..." : "Salvar"}</span>
                  </Button>
                </>
              )}             
            </div>
          </div>
        </DialogHeader>

        {/* Conteúdo do modal com abas */}
        {isLoading ? (
          <div className="p-6 h-[600px] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Carregando detalhes do pedido...</p>
            </div>
          </div>
        ) : (

          // Abas para diferentes seções do pedido
          <Tabs defaultValue="cliente" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="cliente">
                  <User className="w-4 h-4 mr-2" />
                  Cliente
                </TabsTrigger>
                <TabsTrigger value="pagamento">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pagamento
                </TabsTrigger>
                <TabsTrigger value="entrega">
                  <Truck className="w-4 h-4 mr-2" />
                  Entrega
                </TabsTrigger>
                <TabsTrigger value="itens">
                  <Package className="w-4 h-4 mr-2" />
                  Itens
                </TabsTrigger>
                <TabsTrigger value="historico">
                  <History className="w-4 h-4 mr-2" />
                  Histórico
                </TabsTrigger>
              </TabsList>

              {/* Conteúdo de cada aba */}
              <TabsContent value="cliente">
              <ClienteTab
                formData={formData}
                setFormData={setFormData}
                isEditing={isEditing}
                pedidoCompleto={pedidoCompleto}
                getEnderecoCompleto={getEnderecoCompleto}
                onEnderecoUpdate={handleEnderecoUpdate}
                isUpdatingEndereco={isUpdatingEndereco}
              />
            </TabsContent>

            {/* Conteúdo da aba de pagamento */}
            <TabsContent value="pagamento">
              <PagamentoTab
                formData={formData}
                setFormData={setFormData}
                isEditing={isEditing}
                pedidoCompleto={pedidoCompleto}
                meiosPagamento={meiosPagamento}
                getMeioPagamentoNome={getMeioPagamentoNome}
                isMeioPagamentoDinheiro={isMeioPagamentoDinheiro}
                handleTrocoChange={handleTrocoChange}
                formatCurrency={formatCurrency}
              />
            </TabsContent>

            {/* Conteúdo da aba de entrega */}
            <TabsContent value="entrega">
              <EntregaTab
                formData={formData}
                setFormData={setFormData}
                isEditing={isEditing}
                pedidoCompleto={pedidoCompleto}
                formatDateTime={formatDateTime}
              />
            </TabsContent>

            {/* Conteúdo da aba de itens */}
            <TabsContent value="itens">
              <ItensTab
                pedidoCompleto={pedidoCompleto}
                itensEditados={itensEditados}
                isEditingItens={isEditingItens}
                isSavingItens={isSavingItens}
                canEdit={canEdit}
                handleEditarItens={handleEditarItens}
                handleCancelarEdicaoItens={handleCancelarEdicaoItens}
                handleSalvarItens={handleSalvarItens}
                handleQuantidadeChange={handleQuantidadeChange}
                handleObservacaoChange={handleObservacaoChange}
                handleRemoverItem={handleRemoverItem}
                handleAdicionarItem={handleAdicionarItem}
                formatCurrency={formatCurrency}
              />
            </TabsContent>

            {/* Conteúdo da aba de histórico */}
            <TabsContent value="historico">
              <HistoricoTab
                pedidoCompleto={pedidoCompleto}
                formatDateTime={formatDateTime}
              />
            </TabsContent>
          </Tabs>
        )}

        {/* Aviso se o pedido não for editável */}
        {!canEdit() && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 text-amber-600 mt-0.5">⚠️</div>
              <div>
                <p className="text-sm text-amber-800 font-medium">Pedido não editável</p>
                <p className="text-sm text-amber-700 mt-1">
                  Apenas pedidos com status &quot;Pendente&quot; ou &quot;Em Preparo&quot; podem ser modificados.
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}