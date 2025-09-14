"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { cn } from "@supervisor/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Badge } from "../../ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { Edit, Save, X, Phone, MapPin, CreditCard, Clock, Building2, Truck, Search } from "lucide-react"
import { useEmpresas } from "../../../services/useQueryEmpresasMensura"
import type { PedidoKanban } from "../../../types/pedido"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import { useToast } from "../../../hooks/use-toast"
import { useMeiosPagamento } from "@supervisor/services/useQueryMeioPagamento"
import { useFetchPedidoDetalhes } from "@supervisor/services/useQueryPedidoAdmin"
import { useUpdatePedido } from "@supervisor/services/useQueryPedidoAdmin"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../ui/collapsible"
import { ChevronDown } from "lucide-react"
import { Calendar } from "../../ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"
import { Card, CardContent } from "../../ui/card"
import apiMensura from "@supervisor/lib/api/apiMensura"

interface PedidoModalProps {
  pedido: PedidoKanban | null
  isOpen: boolean
  onClose: () => void
}

interface Endereco {
  cep?: string
  logradouro?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
  ponto_referencia?: string
  latitude?: number
  longitude?: number
  is_principal?: boolean
  id?: number
  endereco_formatado?: string
  rua?: string
}

interface PedidoFormData {
  nome_cliente: string
  telefone_cliente: string
  endereco_cliente: string
  observacao_geral: string
  meio_pagamento_id: number | null
  cpf_cliente: string
  email_cliente: string
  data_nascimento_cliente: Date | null
  endereco: Endereco
  troco_para: number
  searchAddress: string
}

interface MeioPagamento {
  id: number
  nome: string
  tipo: string
  ativo: boolean
  created_at: string
  updated_at: string
}

interface PedidoCompleto {
  id: number
  status: string
  cliente: {
    id: number
    nome: string
    cpf: string
    telefone: string
    email: string
    data_nascimento: string
    ativo: boolean
    super_token: string
    created_at: string
    updated_at: string
  }
  empresa_id: number
  entregador_id: number
  endereco_id: number
  endereco: Endereco
  meio_pagamento: {
    id: number
    nome: string
    tipo: string
    ativo: boolean
    created_at: string
    updated_at: string
  }
  tipo_entrega: string
  origem: string
  subtotal: number
  desconto: number
  taxa_entrega: number
  taxa_servico: number
  valor_total: number
  previsao_entrega: string
  distancia_km: number
  observacao_geral: string
  troco_para: number
  cupom_id: number
  endereco_snapshot: any
  endereco_geography: string
  data_criacao: string
  data_atualizacao: string
  endereco_cliente: string
  itens: Array<{
    id: number
    produto_cod_barras: string
    quantidade: number
    preco_unitario: number
    observacao: string
    produto_descricao_snapshot: string
    produto_imagem_snapshot: string
  }>
}

export const PedidoModal: React.FC<PedidoModalProps> = ({ pedido, isOpen, onClose }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<PedidoFormData>({
    nome_cliente: pedido?.nome_cliente || "",
    telefone_cliente: pedido?.telefone_cliente || "",
    endereco_cliente: pedido?.endereco_cliente || "",
    observacao_geral: pedido?.observacao_geral || "",
    meio_pagamento_id: pedido?.meio_pagamento_id || null,
    cpf_cliente: "",
    email_cliente: "",
    data_nascimento_cliente: null,
    endereco: {},
    troco_para: 0,
    searchAddress: "",
  })
  const [isSearching, setIsSearching] = useState(false)
  const [addressOptions, setAddressOptions] = useState<Endereco[]>([])

  const { data: empresas = [] } = useEmpresas()
  const { data: meiosPagamento = [] } = useMeiosPagamento()
  const { data: pedidoCompleto, isLoading } = useFetchPedidoDetalhes(pedido?.id || null)
  const updatePedidoMutation = useUpdatePedido()
  const { toast } = useToast()

  const canEdit = pedido?.status === "P" || pedido?.status === "R"

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

  const calcularTempoDecorrido = (dataInicio: string, dataFim?: string): number => {
    const inicio = new Date(dataInicio)
    const fim = dataFim ? new Date(dataFim) : new Date()
    const diffMs = fim.getTime() - inicio.getTime()
    return Math.floor(diffMs / (1000 * 60)) // Converter para minutos
  }

  const formatarTempoDecorrido = (minutos: number): string => {
    if (minutos >= 60) {
      const horas = Math.floor(minutos / 60)
      const minutosRestantes = minutos % 60
      if (minutosRestantes === 0) {
        return `${horas}h`
      } else {
        return `${horas}h ${minutosRestantes}min`
      }
    }
    return `${minutos} minutos`
  }

  const getNomeEmpresa = (empresaId: number) => {
    const empresa = empresas.find((e) => e.id === empresaId)
    return empresa?.nome || `Empresa ${empresaId}`
  }

  const handleAddressSearch = async () => {
    if (!formData.searchAddress) return
    setIsSearching(true)
    setAddressOptions([])
    try {
      const response = await apiMensura.get(`/api/mensura/geoapify/search-endereco?text=${formData.searchAddress}`)
      setAddressOptions(response.data)
    } catch (error) {
      console.error("Error searching address:", error)
      toast({
        title: "Erro",
        description: "Erro ao buscar endereço. Verifique o console para detalhes.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectAddress = (selectedAddress: Endereco) => {
    setFormData((prev) => ({
      ...prev,
      endereco: {
        ...selectedAddress,
        logradouro: selectedAddress.rua || "",
        numero: prev.endereco.numero || "",
        complemento: prev.endereco.complemento || "",
      },
      endereco_cliente: selectedAddress.endereco_formatado || "",
      searchAddress: "",
    }))
    setAddressOptions([])
  }

  useEffect(() => {
    if (isOpen && pedido && pedidoCompleto) {
      setFormData({
        nome_cliente: pedidoCompleto.cliente?.nome || pedido?.nome_cliente || "",
        telefone_cliente: pedidoCompleto.cliente?.telefone || pedido?.telefone_cliente || "",
        endereco_cliente: pedidoCompleto.endereco_cliente || pedido?.endereco_cliente || "",
        observacao_geral: pedidoCompleto.observacao_geral || pedido?.observacao_geral || "",
        meio_pagamento_id: pedidoCompleto.meio_pagamento?.id || pedido?.meio_pagamento_id || null,
        cpf_cliente: pedidoCompleto.cliente?.cpf || "",
        email_cliente: pedidoCompleto.cliente?.email || "",
        data_nascimento_cliente: pedidoCompleto.cliente?.data_nascimento
          ? new Date(pedidoCompleto.cliente.data_nascimento)
          : null,
        endereco: pedidoCompleto.endereco || {},
        troco_para: pedidoCompleto.troco_para || 0,
        searchAddress: "",
      })
    }
  }, [isOpen, pedido, pedidoCompleto])

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!pedido || !pedidoCompleto) return
    setIsSaving(true)

    if (!formData.endereco_cliente || formData.endereco_cliente.trim() === "") {
      toast({
        title: "Erro",
        description: "O campo Endereço Completo não pode ficar vazio.",
        variant: "destructive",
      })
      setIsSaving(false)
      return
    }

    try {
      const clienteChanged =
        formData.nome_cliente !== (pedidoCompleto.cliente?.nome || "") ||
        formData.telefone_cliente !== (pedidoCompleto.cliente?.telefone || "") ||
        formData.cpf_cliente !== (pedidoCompleto.cliente?.cpf || "") ||
        formData.email_cliente !== (pedidoCompleto.cliente?.email || "") ||
        formData.data_nascimento_cliente?.toISOString().split("T")[0] !==
          (pedidoCompleto.cliente?.data_nascimento ? pedidoCompleto.cliente.data_nascimento.split("T")[0] : "") ||
        JSON.stringify(formData.endereco) !== JSON.stringify(pedidoCompleto.endereco || {})

      const pedidoChanged =
        formData.endereco_cliente !== (pedidoCompleto.endereco_cliente || "") ||
        formData.observacao_geral !== (pedidoCompleto.observacao_geral || "") ||
        formData.meio_pagamento_id !== (pedidoCompleto.meio_pagamento?.id || null) ||
        formData.troco_para !== (pedidoCompleto.troco_para || 0)

      if (clienteChanged && pedidoCompleto.cliente?.id && pedidoCompleto.cliente.id > 0) {
        const clienteData = {
          nome: formData.nome_cliente,
          cpf: formData.cpf_cliente || "",
          telefone: formData.telefone_cliente,
          email: formData.email_cliente || "",
          data_nascimento: formData.data_nascimento_cliente
            ? formData.data_nascimento_cliente.toISOString().split("T")[0]
            : "",
          ativo: true,
          endereco: {
            acao: "update",
            id: formData.endereco.id || 0,
            cep: formData.endereco.cep || "",
            logradouro: formData.endereco.logradouro || "",
            numero: formData.endereco.numero || "",
            complemento: formData.endereco.complemento || "",
            bairro: formData.endereco.bairro || "",
            cidade: formData.endereco.cidade || "",
            estado: formData.endereco.estado || "",
            ponto_referencia: formData.endereco.ponto_referencia || "",
            latitude: formData.endereco.latitude || 0,
            longitude: formData.endereco.longitude || 0,
            is_principal: formData.endereco.is_principal || true,
          },
        }
        await apiMensura.put(`/api/delivery/cliente/admin-update/${pedidoCompleto.cliente.id}`, clienteData)
      } else if (clienteChanged) {
        toast({
          title: "Aviso",
          description: "Não foi possível atualizar o cliente: ID inválido.",
          variant: "destructive",
        })
      }

      if (pedidoChanged) {
        const pedidoData = {
          endereco_cliente: formData.endereco_cliente,
          observacao_geral: formData.observacao_geral,
          meio_pagamento_id: formData.meio_pagamento_id,
          troco_para: formData.troco_para,
        }
        updatePedidoMutation.mutate({ pedidoId: pedido.id, data: pedidoData })
      } else {
        toast({
          title: "Informação",
          description: "Nenhuma alteração foi detectada.",
        })
      }

      setIsEditing(false)
      setTimeout(() => {
        onClose()
      }, 1000)
    } catch (error) {
      console.error("Error during save:", error)
      toast({
        title: "Erro",
        description: "Erro ao atualizar pedido. Verifique o console para detalhes.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsEditing(false)
    if (pedidoCompleto) {
      setFormData({
        nome_cliente: pedidoCompleto.cliente?.nome || "",
        telefone_cliente: pedidoCompleto.cliente?.telefone || "",
        endereco_cliente: pedidoCompleto.endereco_cliente || "",
        observacao_geral: pedidoCompleto.observacao_geral || "",
        meio_pagamento_id: pedidoCompleto.meio_pagamento?.id || null,
        cpf_cliente: pedidoCompleto.cliente?.cpf || "",
        email_cliente: pedidoCompleto.cliente?.email || "",
        data_nascimento_cliente: pedidoCompleto.cliente?.data_nascimento
          ? new Date(pedidoCompleto.cliente.data_nascimento)
          : null,
        endereco: pedidoCompleto.endereco || {},
        troco_para: pedidoCompleto.troco_para || 0,
        searchAddress: "",
      })
    }
  }

  const getMeioPagamentoNome = (id: number | null) => {
    if (!id) return "Não informado"
    const meio = meiosPagamento.find((m) => m.id === id)
    return meio?.nome || `Método de Pagamento ${id}`
  }

  const isMeioPagamentoDinheiro = () => {
    const meio = meiosPagamento.find((m) => m.id === formData.meio_pagamento_id)
    return meio?.tipo === "DINHEIRO"
  }

  const updateSnapshotField = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        [field]: value,
      },
    }))
  }

  const getEnderecoCompleto = () => {
    const { logradouro, numero, complemento, bairro, cep, cidade, estado } = formData.endereco
    const parts = [logradouro, numero, complemento, bairro, cep, cidade, estado].filter(Boolean).join(", ")
    return parts || "Não informado"
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }

  const handleTrocoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")
    value = (Number(value) / 100).toFixed(2) + ""
    setFormData((prev) => ({ ...prev, troco_para: Number(value) }))
  }

  if (!pedido) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-6 pb-4 border-b sticky top-0 bg-white z-10 shadow-lg rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-2xl font-bold">Pedido #{pedido.id}</DialogTitle>
              <Badge variant={getStatusVariant(pedido.status)} className="text-sm px-3 py-1">
                {getStatusText(pedido.status)}
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
                <Building2 className="w-3 h-3 mr-1" />
                {getNomeEmpresa(pedidoCompleto?.empresa_id || 0)}
              </Badge>
            </div>

            <div className="flex gap-2">
              {canEdit && !isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              )}

              {isEditing && (
                <>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Salvando..." : "Salvar"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="geral" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="geral">Informações Gerais</TabsTrigger>
            <TabsTrigger value="itens">Itens do Pedido</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="geral" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                    <Phone className="w-5 h-5 text-blue-600" />
                    Informações do Cliente
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome_cliente" className="text-sm font-medium">
                        Nome do Cliente
                      </Label>
                      <Input
                        id="nome_cliente"
                        value={formData.nome_cliente}
                        onChange={(e) => setFormData((prev) => ({ ...prev, nome_cliente: e.target.value }))}
                        disabled={!isEditing}
                        className="bg-white"
                        autoComplete="off"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefone_cliente" className="text-sm font-medium">
                        Telefone
                      </Label>
                      <Input
                        id="telefone_cliente"
                        value={formData.telefone_cliente}
                        onChange={(e) => setFormData((prev) => ({ ...prev, telefone_cliente: e.target.value }))}
                        disabled={!isEditing}
                        className="bg-white"
                        autoComplete="off"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cpf_cliente" className="text-sm font-medium">
                        CPF
                      </Label>
                      <Input
                        id="cpf_cliente"
                        value={formData.cpf_cliente || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, cpf_cliente: e.target.value }))}
                        disabled={!isEditing}
                        className="bg-white"
                        placeholder="000.000.000-00"
                        autoComplete="off"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email_cliente" className="text-sm font-medium">
                        Email
                      </Label>
                      <Input
                        id="email_cliente"
                        type="email"
                        value={formData.email_cliente || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email_cliente: e.target.value }))}
                        disabled={!isEditing}
                        className="bg-white"
                        placeholder="cliente@email.com"
                        autoComplete="off"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="data_nascimento_cliente" className="text-sm font-medium">
                        Data de Nascimento
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.data_nascimento_cliente && "text-muted-foreground"
                            )}
                            disabled={!isEditing}
                          >
                            {formData.data_nascimento_cliente ? (
                              format(formData.data_nascimento_cliente, "PPP")
                            ) : (
                              <span>Selecione a data</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.data_nascimento_cliente || undefined}
                            onSelect={(date) => setFormData((prev) => ({ ...prev, data_nascimento_cliente: date || null }))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                    <MapPin className="w-5 h-5 text-green-600" />
                    Endereço de Entrega
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="searchAddress" className="text-sm font-medium">
                        Pesquisar Endereço (Rua ou CEP)
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="searchAddress"
                          value={formData.searchAddress}
                          onChange={(e) => setFormData((prev) => ({ ...prev, searchAddress: e.target.value }))}
                          disabled={!isEditing}
                          className="bg-white flex-1"
                          placeholder="Digite a rua ou CEP"
                          autoComplete="off"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleAddressSearch}
                          disabled={!isEditing || !formData.searchAddress || isSearching}
                        >
                          {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                        </Button>
                      </div>
                      {addressOptions.length > 0 && (
                        <Select onValueChange={(value) => {
                          const selected = addressOptions.find(option => option.endereco_formatado === value)
                          if (selected) handleSelectAddress(selected)
                        }}>
                          <SelectTrigger className="w-full bg-white mt-2">
                            <SelectValue placeholder="Selecione um endereço" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 overflow-y-auto">
                            {addressOptions.map((option, index) => (
                              <SelectItem key={index} value={option.endereco_formatado || ""}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{option.endereco_formatado}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endereco_cliente" className="text-sm font-medium">
                        Endereço Completo
                      </Label>
                      <textarea
                        id="endereco_cliente"
                        value={formData.endereco_cliente}
                        onChange={(e) => setFormData((prev) => ({ ...prev, endereco_cliente: e.target.value }))}
                        disabled={!isEditing}
                        rows={2}
                        className="flex min-h-[60px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                        autoComplete="off"
                      />
                    </div>

                    {Object.keys(formData.endereco).length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Detalhes do Endereço</Label>
                        <Collapsible>
                          <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline">
                            Ver/editar detalhes
                            <ChevronDown className="w-4 h-4" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="space-y-2 mt-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <Label htmlFor="endereco_logradouro" className="text-sm font-medium">Logradouro</Label>
                                <Input
                                  id="endereco_logradouro"
                                  value={formData.endereco.logradouro || ""}
                                  onChange={(e) => updateSnapshotField("logradouro", e.target.value)}
                                  disabled={!isEditing}
                                  className="bg-white h-8 text-sm"
                                  autoComplete="off"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor="endereco_numero" className="text-sm font-medium text-yellow-600">Número *</Label>
                                <Input
                                  id="endereco_numero"
                                  value={formData.endereco.numero || ""}
                                  onChange={(e) => updateSnapshotField("numero", e.target.value)}
                                  disabled={!isEditing}
                                  className="bg-white h-8 text-sm border-2 border-yellow-200 focus:border-yellow-400"
                                  autoComplete="off"
                                  placeholder="Ex.: 123"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor="endereco_complemento" className="text-sm font-medium text-gray-500">Complemento (opcional)</Label>
                                <Input
                                  id="endereco_complemento"
                                  value={formData.endereco.complemento || ""}
                                  onChange={(e) => updateSnapshotField("complemento", e.target.value)}
                                  disabled={!isEditing}
                                  className="bg-white h-8 text-sm border-2 border-gray-200 focus:border-gray-400"
                                  autoComplete="off"
                                  placeholder="Ex.: Apto 101"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor="endereco_bairro" className="text-sm font-medium">Bairro</Label>
                                <Input
                                  id="endereco_bairro"
                                  value={formData.endereco.bairro || ""}
                                  onChange={(e) => updateSnapshotField("bairro", e.target.value)}
                                  disabled={!isEditing}
                                  className="bg-white h-8 text-sm"
                                  autoComplete="off"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor="endereco_cidade" className="text-sm font-medium">Cidade</Label>
                                <Input
                                  id="endereco_cidade"
                                  value={formData.endereco.cidade || ""}
                                  onChange={(e) => updateSnapshotField("cidade", e.target.value)}
                                  disabled={!isEditing}
                                  className="bg-white h-8 text-sm"
                                  autoComplete="off"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor="endereco_estado" className="text-sm font-medium">Estado</Label>
                                <Input
                                  id="endereco_estado"
                                  value={formData.endereco.estado || ""}
                                  onChange={(e) => updateSnapshotField("estado", e.target.value)}
                                  disabled={!isEditing}
                                  className="bg-white h-8 text-sm"
                                  autoComplete="off"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor="endereco_cep" className="text-sm font-medium">CEP</Label>
                                <Input
                                  id="endereco_cep"
                                  value={formData.endereco.cep || ""}
                                  onChange={(e) => updateSnapshotField("cep", e.target.value)}
                                  disabled={!isEditing}
                                  className="bg-white h-8 text-sm"
                                  autoComplete="off"
                                />
                              </div>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Observações</h3>

                  <div className="space-y-2">
                    <textarea
                      value={formData.observacao_geral || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, observacao_geral: e.target.value }))}
                      disabled={!isEditing}
                      rows={4}
                      placeholder="Observações do pedido..."
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                    Pagamento
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="meio_pagamento" className="text-sm font-medium">
                        Meio de Pagamento
                      </Label>
                      {isEditing ? (
                        <Select
                          value={formData.meio_pagamento_id?.toString() || ""}
                          onValueChange={(value) =>
                            setFormData((prev) => ({ ...prev, meio_pagamento_id: Number.parseInt(value) }))
                          }
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Selecione o meio de pagamento" />
                          </SelectTrigger>
                          <SelectContent>
                            {meiosPagamento.map((meio) => (
                              <SelectItem key={meio.id} value={meio.id.toString()}>
                                {meio.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input value={getMeioPagamentoNome(formData.meio_pagamento_id)} disabled className="bg-white" />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="troco_para" className="text-sm font-medium">
                        Troco Para
                      </Label>
                      <Input
                        id="troco_para"
                        value={formatCurrency(formData.troco_para)}
                        onChange={handleTrocoChange}
                        disabled={!isEditing || !isMeioPagamentoDinheiro()}
                        className="bg-white"
                        autoComplete="off"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Valor Total</Label>
                      <Input
                        value={formatCurrency(pedidoCompleto?.valor_total || 0)}
                        disabled
                        className="bg-white font-semibold text-lg text-green-700"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Subtotal</Label>
                        <Input
                          value={formatCurrency(pedidoCompleto?.subtotal || 0)}
                          disabled
                          className="bg-white h-9 text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Desconto</Label>
                        <Input
                          value={formatCurrency(pedidoCompleto?.desconto || 0)}
                          disabled
                          className="bg-white h-9 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Taxa de Entrega</Label>
                        <Input
                          value={formatCurrency(pedidoCompleto?.taxa_entrega || 0)}
                          disabled
                          className="bg-white h-9 text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Taxa de Serviço</Label>
                        <Input
                          value={formatCurrency(pedidoCompleto?.taxa_servico || 0)}
                          disabled
                          className="bg-white h-9 text-sm"
                        />
                      </div>
                    </div>

                    {pedidoCompleto?.cupom_id && pedidoCompleto.cupom_id > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">ID do Cupom</Label>
                        <Input
                          value={pedidoCompleto.cupom_id}
                          disabled
                          className="bg-white h-9 text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                    <Clock className="w-5 h-5 text-orange-600" />
                    Informações do Pedido
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Data/Hora do Pedido</Label>
                      <Input
                        value={
                          pedidoCompleto?.data_criacao
                            ? new Date(pedidoCompleto.data_criacao).toLocaleString("pt-BR")
                            : ""
                        }
                        disabled
                        className="bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Tempo Decorrido</Label>
                      <Input
                        value={formatarTempoDecorrido(
                          pedidoCompleto?.data_criacao
                            ? calcularTempoDecorrido(pedidoCompleto.data_criacao, pedidoCompleto.data_atualizacao)
                            : 0
                        )}
                        disabled
                        className="bg-white font-semibold"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Origem</Label>
                      <Input
                        value={pedidoCompleto?.origem ?? "Não informado"}
                        disabled
                        className="bg-white h-9 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                    <Truck className="w-5 h-5 text-indigo-600" />
                    Detalhes de Entrega
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Tipo de Entrega</Label>
                      <Input
                        value={pedidoCompleto?.tipo_entrega ?? "Não informado"}
                        disabled
                        className="bg-white h-9 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Previsão de Entrega</Label>
                      <Input
                        value={
                          pedidoCompleto?.previsao_entrega
                            ? new Date(pedidoCompleto.previsao_entrega).toLocaleString("pt-BR")
                            : "Não informado"
                        }
                        disabled
                        className="bg-white h-9 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Distância (km)</Label>
                      <Input
                        value={pedidoCompleto?.distancia_km ?? "Não informado"}
                        disabled
                        className="bg-white h-9 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="itens" className="space-y-6 mt-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Itens do Pedido</h3>
              {pedidoCompleto?.itens && pedidoCompleto.itens.length > 0 ? (
                <div className="space-y-3">
                  {pedidoCompleto.itens.map((item: any, index: number) => (
                    <div key={index} className="bg-white rounded-lg p-4 border">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.produto_descricao_snapshot}</h4>
                          {item.observacao && <p className="text-sm text-muted-foreground mt-1">{item.observacao}</p>}
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-semibold">
                            {item.quantidade}x R$ {item.preco_unitario.toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Total: R$ {(item.quantidade * item.preco_unitario).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Nenhum item encontrado</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="historico" className="space-y-6 mt-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Histórico do Pedido</h3>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4 border">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Pedido Criado</span>
                    <span className="text-sm text-muted-foreground">
                      {pedidoCompleto?.data_criacao
                        ? new Date(pedidoCompleto.data_criacao).toLocaleString("pt-BR")
                        : ""}
                    </span>
                  </div>
                </div>
                {pedidoCompleto?.data_atualizacao && (
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Última Atualização</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(pedidoCompleto.data_atualizacao).toLocaleString("pt-BR")}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {!canEdit && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 text-amber-600 mt-0.5">⚠️</div>
              <div>
                <p className="text-sm text-amber-800 font-medium">Pedido não editável</p>
                <p className="text-sm text-amber-700 mt-1">
                  Apenas pedidos com status "Pendente" ou "Em Preparo" podem ser modificados.
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}