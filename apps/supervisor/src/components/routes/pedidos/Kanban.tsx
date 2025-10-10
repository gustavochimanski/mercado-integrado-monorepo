"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { useQueries } from "@tanstack/react-query"
import { Checkbox } from "@supervisor/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@supervisor/components/ui/select"
import { Badge } from "@supervisor/components/ui/badge"
import { Button } from "@supervisor/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@supervisor/components/ui/collapsible"
import type { PedidoKanban, PedidoStatus } from "@supervisor/types/pedido"
import { KanbanColuna } from "./KanbanColuna"
import { FooterSelecionados } from "./SuspenseFooter"
import { useFetchPedidosAdminKanban, useMutatePedidoAdmin } from "@supervisor/services/useQueryPedidoAdmin"
import { useEmpresas } from "@supervisor/services/useQueryEmpresasMensura"
import { useCurrentUser } from "@supervisor/services/useCurrentUser"
import { useEntregadores } from "@supervisor/services/useQueryEntregadores"
import apiMensura from "@supervisor/lib/api/apiMensura"
import { format } from "date-fns"
import { DatePicker } from "../../shared/DatePicker"
import { Input } from "@supervisor/components/ui/input"
import { Label } from "@supervisor/components/ui/label"
import { Search, Filter, X, User, Phone, Hash, Truck, Building2, ChevronDown, MapPin } from "lucide-react"

interface FiltrosState {
  numeroPedido: string
  telefoneCliente: string
  nomeCliente: string
  endereco: string
  empresa: string
  motoboy: string
}

export type StatusMeta = { label: string; headerClass: string }

export const statusMap: Record<PedidoStatus, StatusMeta> = {
  P: { label: "Pendente", headerClass: "bg-yellow-500 text-white" },
  R: { label: "Em preparo", headerClass: "bg-purple-600 text-white" },
  S: {
    label: "Saiu para entrega",
    headerClass: "bg-[hsl(var(--primary))] text-white",
  },
  E: { label: "Entregue", headerClass: "bg-green-600 text-white" },
  C: { label: "Cancelado", headerClass: "bg-red-600 text-white" },
}



  // Função para escapar aspas em textos dinâmicos
  const sanitizeText = (text: string) => text.replace(/"/g, "&quot;")

const FiltrosAvancados = ({
  filtros,
  setFiltros,
  onLimparFiltros,
}: {
  filtros: FiltrosState
  setFiltros: React.Dispatch<React.SetStateAction<FiltrosState>>
  onLimparFiltros: () => void
}) => {
  const [isOpen, setIsOpen] = useState(true)

  const { data: empresas = [] } = useEmpresas()
  const { data: currentUser } = useCurrentUser()
  const { data: entregadores = [] } = useEntregadores()

  const empresasDisponiveis = useMemo(() => {
    if (!currentUser?.empresa_ids || currentUser.empresa_ids.length === 0) {
      return empresas
    }
    return empresas.filter((empresa) => currentUser.empresa_ids!.includes(empresa.id))
  }, [empresas, currentUser])

  // Mesma lógica do SelecionarEntregadorModal - filtra apenas entregadores vinculados
  const motoboyOptions = useMemo(() => {
    const entregadoresVinculados = entregadores?.filter(e => e.empresas && e.empresas.length > 0) || []

    return entregadoresVinculados
      .map(entregador => entregador.nome)
      .sort()
  }, [entregadores])

  const filtrosAtivos = Object.values(filtros).filter(Boolean).length


  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="bg-white border rounded-lg shadow-sm">
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Filtros Avançados</h3>
              </div>
              {filtrosAtivos > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {filtrosAtivos} ativo{filtrosAtivos > 1 ? "s" : ""}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onLimparFiltros()
                }}
                className="text-muted-foreground hover:text-foreground bg-transparent"
              >
                <X className="h-4 w-4 mr-2" />
                Limpar filtros
              </Button>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-6 pb-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-1">
                <Label htmlFor="numeroPedido" className="flex items-center gap-2 text-sm font-medium">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  Número do Pedido
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="numeroPedido"
                    placeholder="Ex: 123"
                    value={filtros.numeroPedido}
                    onChange={(e) => setFiltros((prev) => ({ ...prev, numeroPedido: e.target.value }))}
                    className="pl-10 py-3"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="telefoneCliente" className="flex items-center gap-2 text-sm font-medium">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Telefone do Cliente
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="telefoneCliente"
                    placeholder="Ex: (11) 99999-9999"
                    value={filtros.telefoneCliente}
                    onChange={(e) => setFiltros((prev) => ({ ...prev, telefoneCliente: e.target.value }))}
                    className="pl-10 py-3"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="nomeCliente" className="flex items-center gap-2 text-sm font-medium">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Nome do Cliente
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="nomeCliente"
                    placeholder="Ex: João Silva"
                    value={filtros.nomeCliente}
                    onChange={(e) => setFiltros((prev) => ({ ...prev, nomeCliente: e.target.value }))}
                    className="pl-10 py-3"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="endereco" className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Endereço de Entrega
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="endereco"
                    placeholder="Ex: Rua das Flores, 123"
                    value={filtros.endereco}
                    onChange={(e) => setFiltros((prev) => ({ ...prev, endereco: e.target.value }))}
                    className="pl-10 py-3"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  Motoboy
                </Label>
                <Select
                  value={filtros.motoboy}
                  onValueChange={(value) => setFiltros((prev) => ({ ...prev, motoboy: value }))}
                >
                  <SelectTrigger className="w-full py-3">
                    <SelectValue placeholder="Todos os motoboys" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os motoboys</SelectItem>
                    {motoboyOptions.map((motoboy) => (
                      <SelectItem key={motoboy} value={motoboy}>
                        {sanitizeText(motoboy)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filtrosAtivos > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                <span className="text-sm text-muted-foreground">Filtros ativos:</span>
                {filtros.numeroPedido && (
                  <Badge variant="outline" className="gap-1">
                    <Hash className="h-3 w-3" />
                    Pedido: {sanitizeText(filtros.numeroPedido)}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => setFiltros((prev) => ({ ...prev, numeroPedido: "" }))}
                    />
                  </Badge>
                )}
                {filtros.telefoneCliente && (
                  <Badge variant="outline" className="gap-1">
                    <Phone className="h-3 w-3" />
                    Tel: {sanitizeText(filtros.telefoneCliente)}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => setFiltros((prev) => ({ ...prev, telefoneCliente: "" }))}
                    />
                  </Badge>
                )}
                {filtros.nomeCliente && (
                  <Badge variant="outline" className="gap-1">
                    <User className="h-3 w-3" />
                    Nome: {sanitizeText(filtros.nomeCliente)}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => setFiltros((prev) => ({ ...prev, nomeCliente: "" }))}
                    />
                  </Badge>
                )}
                {filtros.endereco && (
                  <Badge variant="outline" className="gap-1">
                    <MapPin className="h-3 w-3" />
                    Endereço: {sanitizeText(filtros.endereco)}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => setFiltros((prev) => ({ ...prev, endereco: "" }))}
                    />
                  </Badge>
                )}
                {filtros.empresa && filtros.empresa !== "all" && (
                  <Badge variant="outline" className="gap-1">
                    <Building2 className="h-3 w-3" />
                    Empresa: {sanitizeText(empresasDisponiveis.find((e) => e.id.toString() === filtros.empresa)?.nome || "")}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => setFiltros((prev) => ({ ...prev, empresa: "" }))}
                    />
                  </Badge>
                )}
                {filtros.motoboy && filtros.motoboy !== "all" && (
                  <Badge variant="outline" className="gap-1">
                    <Truck className="h-3 w-3" />
                    Motoboy: {sanitizeText(filtros.motoboy)}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => setFiltros((prev) => ({ ...prev, motoboy: "" }))}
                    />
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

const KanbanPedidos = () => {
  const hoje = new Date()
  const [selectedDay, setSelectedDay] = useState<Date>(hoje)

  const selectedDate = format(selectedDay, "yyyy-MM-dd")

  const [selecionados, setSelecionados] = useState<Set<number>>(new Set())
  const [colunasVisiveis, setColunasVisiveis] = useState<Record<PedidoStatus, boolean>>(() =>
    Object.keys(statusMap).reduce((acc, key) => ({ ...acc, [key]: true }), {} as Record<PedidoStatus, boolean>),
  )

  const [filtros, setFiltros] = useState<FiltrosState>({
    numeroPedido: "",
    telefoneCliente: "",
    nomeCliente: "",
    endereco: "",
    empresa: "",
    motoboy: "all",
  })

  const { data: empresas = [] } = useEmpresas()
  const { data: currentUser } = useCurrentUser()

  const empresasDisponiveis = useMemo(() => {
    if (!currentUser?.empresa_ids || currentUser.empresa_ids.length === 0) {
      return empresas
    }
    return empresas.filter((empresa) => currentUser.empresa_ids!.includes(empresa.id))
  }, [empresas, currentUser])

  const empresaIdParam = useMemo(() => {
    return filtros.empresa || empresasDisponiveis[0]?.id.toString() || ""
  }, [filtros.empresa, empresasDisponiveis])

  const { data: pedidos = [], isLoading } = useFetchPedidosAdminKanban(selectedDate, empresaIdParam)
  const { atualizarStatus } = useMutatePedidoAdmin()

  // Buscar detalhes completos dos pedidos quando o filtro de motoboy estiver ativo
  const pedidosDetalhesQueries = useQueries({
    queries: pedidos.map((pedido) => ({
      queryKey: ["pedidoDetalhes", pedido.id],
      queryFn: async () => {
        const { data } = await apiMensura.get(`/api/delivery/pedidos/admin/${pedido.id}`)
        return data
      },
      enabled: filtros.motoboy !== "all" && filtros.motoboy !== "",
      staleTime: 5 * 60 * 1000, // 5 minutos
    }))
  })

  // Criar um mapa de pedidoId -> entregador.nome dos detalhes completos
  const pedidosComEntregador = useMemo(() => {
    if (filtros.motoboy === "all" || !filtros.motoboy) {
      return new Map<number, string>()
    }

    const mapa = new Map<number, string>()
    pedidosDetalhesQueries.forEach((query, index) => {
      if (query.data?.entregador?.nome) {
        const pedidoId = pedidos[index]?.id
        if (pedidoId) {
          mapa.set(pedidoId, query.data.entregador.nome)
        }
      }
    })
    return mapa
  }, [pedidosDetalhesQueries, pedidos, filtros.motoboy])

  const pedidosPorStatus = useMemo(() => {
    const pedidosFiltrados = pedidos.filter((pedido) => {
      if (filtros.numeroPedido && !pedido.id.toString().includes(filtros.numeroPedido)) {
        return false
      }

      if (
        filtros.telefoneCliente &&
        !pedido.telefone_cliente?.toLowerCase().includes(filtros.telefoneCliente.toLowerCase())
      ) {
        return false
      }

      if (filtros.nomeCliente && !pedido.nome_cliente?.toLowerCase().includes(filtros.nomeCliente.toLowerCase())) {
        return false
      }

      if (filtros.endereco && !pedido.endereco?.toLowerCase().includes(filtros.endereco.toLowerCase())) {
        return false
      }

      if (filtros.motoboy !== "all" && filtros.motoboy) {
        // Usa os dados completos do pedido para obter o nome do entregador
        const nomeEntregador = pedidosComEntregador.get(pedido.id)
        if (!nomeEntregador || !nomeEntregador.toLowerCase().includes(filtros.motoboy.toLowerCase())) {
          return false
        }
      }

      return true
    })

    const agrupados: Record<PedidoStatus, PedidoKanban[]> = {} as Record<PedidoStatus, PedidoKanban[]>
    ;(Object.keys(statusMap) as PedidoStatus[]).forEach((s) => (agrupados[s] = []))
    pedidosFiltrados.forEach((pedido) => {
      agrupados[pedido.status]?.push(pedido)
    })
    return agrupados
  }, [pedidos, filtros, pedidosComEntregador])

  const toggleSelecionado = (id: number) => {
    setSelecionados((prev) => {
      const novo = new Set(prev)
      novo.has(id) ? novo.delete(id) : novo.add(id)
      return novo
    })
  }

  const handleToggleColuna = (key: PedidoStatus) => {
    setColunasVisiveis((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleMoverSelecionados = (novoStatus: PedidoStatus) => {
    selecionados.forEach((id) => atualizarStatus.mutate({ id, status: novoStatus }))
    setSelecionados(new Set())
  }

  // Obter dados dos pedidos selecionados
  const pedidosSelecionados = useMemo(() => {
    return pedidos.filter(pedido => selecionados.has(pedido.id))
  }, [pedidos, selecionados])

  const handleCancelarSelecionados = () => setSelecionados(new Set())

  const limparFiltros = () => {
    setFiltros({
      numeroPedido: "",
      telefoneCliente: "",
      nomeCliente: "",
      endereco: "",
      empresa: "",
      motoboy: "all",
    })
  }

  if (isLoading) return <p>Carregando pedidos...</p>

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col p-4 space-y-4">
      <FiltrosAvancados
        filtros={filtros}
        setFiltros={setFiltros}
        onLimparFiltros={limparFiltros}
      />

      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-4 items-center">
          {Object.entries(statusMap).map(([key, meta]) => (
            <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={colunasVisiveis[key as PedidoStatus]}
                onCheckedChange={() => handleToggleColuna(key as PedidoStatus)}
              />
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-200 text-primary">
                {meta.label}
              </span>
            </label>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <Select
              value={filtros.empresa}
              onValueChange={(value) => setFiltros((prev) => ({ ...prev, empresa: value }))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Selecione uma empresa" />
              </SelectTrigger>
              <SelectContent>
                {empresasDisponiveis.map((empresa) => (
                  <SelectItem key={empresa.id} value={empresa.id.toString()}>
                  {sanitizeText(empresa.nome)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <DatePicker date={selectedDay} onChange={setSelectedDay} />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 h-full">
          {Object.entries(statusMap)
            .filter(([key]) => colunasVisiveis[key as PedidoStatus])
            .map(([statusKey, meta]) => (
              <KanbanColuna
                key={statusKey}
                statusMeta={meta}
                pedidos={pedidosPorStatus[statusKey as PedidoStatus] || []}
                selecionados={selecionados}
                onToggleSelecionado={toggleSelecionado}
                selectedDate={selectedDate}
              />
            ))}
        </div>
      </div>

      {selecionados.size > 0 && (
        <FooterSelecionados
          count={selecionados.size}
          onMoverSelecionados={handleMoverSelecionados}
          onCancelar={handleCancelarSelecionados}
          visivel={selecionados.size > 0}
          pedidosSelecionados={pedidosSelecionados}
        />
      )}
    </div>
  )
}

export default KanbanPedidos