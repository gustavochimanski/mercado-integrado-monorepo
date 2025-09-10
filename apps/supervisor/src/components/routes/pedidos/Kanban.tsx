// "use client";

// import React, { useMemo, useState } from "react";
// import { Checkbox } from "@supervisor/components/ui/checkbox";
// import { PedidoKanban, PedidoStatus } from "@supervisor/types/pedido";
// import { KanbanColuna } from "./KanbanColuna";
// import { FooterSelecionados } from "./SuspenseFooter";
// import {
//   useFetchPedidosAdminKanban,
//   useMutatePedidoAdmin,
// } from "@supervisor/services/useQueryPedidoAdmin";
// import { format } from "date-fns";
// import { DatePicker } from "../../shared/DatePicker";

// // ---------------- Status Map ----------------
// export type StatusMeta = { label: string; headerClass: string };

// export const statusMap: Record<PedidoStatus, StatusMeta> = {
//   P: { label: "Pendente", headerClass: "bg-yellow-500 text-white" },
//   R: { label: "Em preparo", headerClass: "bg-purple-600 text-white" },
//   S: {
//     label: "Saiu para entrega",
//     headerClass: "bg-[hsl(var(--primary))] text-white",
//   },
//   E: { label: "Entregue", headerClass: "bg-green-600 text-white" }, 
//   C: { label: "Cancelado", headerClass: "bg-red-600 text-white" },
// };

// // ---------------- KanbanPedidos ----------------
// const KanbanPedidos = () => {
//   const hoje = new Date();
//   const [selectedDay, setSelectedDay] = useState<Date>(hoje);

//   // formatamos no padrão que o backend espera (YYYY-MM-DD)
//   const selectedDate = format(selectedDay, "yyyy-MM-dd");

//   const [selecionados, setSelecionados] = useState<Set<number>>(new Set());
//   const [colunasVisiveis, setColunasVisiveis] = useState<
//     Record<PedidoStatus, boolean>
//   >(() =>
//     Object.keys(statusMap).reduce(
//       (acc, key) => ({ ...acc, [key]: true }),
//       {} as Record<PedidoStatus, boolean>
//     )
//   );

//   const { data: pedidos = [], isLoading } =
//     useFetchPedidosAdminKanban(selectedDate);
//   const { atualizarStatus } = useMutatePedidoAdmin();

//   // ---------------- Agrupando pedidos por status ----------------
//   const pedidosPorStatus = useMemo(() => {
//     const agrupados: Record<PedidoStatus, PedidoKanban[]> =
//       {} as Record<PedidoStatus, PedidoKanban[]>;
//     (Object.keys(statusMap) as PedidoStatus[]).forEach(
//       (s) => (agrupados[s] = [])
//     );
//     pedidos.forEach((pedido) => {
//       agrupados[pedido.status]?.push(pedido);
//     });
//     return agrupados;
//   }, [pedidos]);

//   const toggleSelecionado = (id: number) => {
//     setSelecionados((prev) => {
//       const novo = new Set(prev);
//       novo.has(id) ? novo.delete(id) : novo.add(id);
//       return novo;
//     });
//   };

//   const handleToggleColuna = (key: PedidoStatus) => {
//     setColunasVisiveis((prev) => ({ ...prev, [key]: !prev[key] }));
//   };

//   const handleMoverSelecionados = (novoStatus: PedidoStatus) => {
//     selecionados.forEach((id) =>
//       atualizarStatus.mutate({ id, status: novoStatus })
//     );
//     setSelecionados(new Set());
//   };

//   const handleCancelarSelecionados = () => setSelecionados(new Set());

//   if (isLoading) return <p>Carregando pedidos...</p>;

//   return (
//     <div className="h-[calc(100vh-100px)] flex flex-col p-4 space-y-4">
//       {/* Filtro por Data */}

//       {/* Filtro de colunas */}
//       <div className="flex justify-between">
//         <div className="flex flex-wrap gap-4 items-center">
//         {Object.entries(statusMap).map(([key, meta]) => (
//           <label
//           key={key}
//           className="flex items-center gap-2 text-sm cursor-pointer"
//           >
//             <Checkbox
//               checked={colunasVisiveis[key as PedidoStatus]}
//               onCheckedChange={() => handleToggleColuna(key as PedidoStatus)}
//             />
//             <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-200 text-primary">
//               {meta.label}
//             </span>
//           </label>
//         ))}
//         </div>
//         <DatePicker date={selectedDay} onChange={setSelectedDay} />
//       </div>

//       {/* Colunas do Kanban */}
//       <div className="flex-1 overflow-x-auto">
//         <div className="flex gap-4 h-full">
//           {Object.entries(statusMap)
//             .filter(([key]) => colunasVisiveis[key as PedidoStatus])
//             .map(([statusKey, meta]) => (
//               <KanbanColuna
//                 key={statusKey}
//                 statusMeta={meta}
//                 pedidos={pedidosPorStatus[statusKey as PedidoStatus] || []}
//                 selecionados={selecionados}
//                 onToggleSelecionado={toggleSelecionado}
//                 selectedDate={selectedDate}
//               />
//             ))}
//         </div>
//       </div>

//       {/* Footer de ações */}
//       {selecionados.size > 0 && (
//         <FooterSelecionados
//           count={selecionados.size}
//           onMoverSelecionados={handleMoverSelecionados}
//           onCancelar={handleCancelarSelecionados}
//           visivel={selecionados.size > 0}
//         />
//       )}
//     </div>
//   );
// };

// export default KanbanPedidos;


"use client"

import { useMemo, useState } from "react"
import { Checkbox } from "@supervisor/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@supervisor/components/ui/select"
import { Badge } from "@supervisor/components/ui/badge"
import { Button } from "@supervisor/components/ui/button"
import type { PedidoKanban, PedidoStatus } from "@supervisor/types/pedido"
import { KanbanColuna } from "./KanbanColuna"
import { FooterSelecionados } from "./SuspenseFooter"
import { useFetchPedidosAdminKanban, useMutatePedidoAdmin } from "@supervisor/services/useQueryPedidoAdmin"
import { useEmpresas } from "@supervisor/services/useQueryEmpresasMensura"
import { useCurrentUser } from "@supervisor/services/useCurrentUser"
import { format } from "date-fns"
import { DatePicker } from "../../shared/DatePicker"
import { Input } from "@supervisor/components/ui/input"
import { Label } from "@supervisor/components/ui/label"
import { Search, Filter, X, Calendar, User, Phone, Hash, Truck, Building2 } from "lucide-react"

// ---------------- Status Map ----------------
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

// ---------------- FiltrosAvancados ----------------
const FiltrosAvancados = ({
  filtros,
  setFiltros,
  colunasVisiveis,
  pedidos,
  onLimparFiltros,
}: {
  filtros: any
  setFiltros: any
  colunasVisiveis: Record<PedidoStatus, boolean>
  pedidos: PedidoKanban[]
  onLimparFiltros: () => void
}) => {
  const { data: empresas = [] } = useEmpresas()
  const { data: currentUser } = useCurrentUser()

  const empresasDisponiveis = useMemo(() => {
    if (!currentUser?.empresa_ids || currentUser.empresa_ids.length === 0) {
      return empresas
    }
    return empresas.filter((empresa) => currentUser.empresa_ids!.includes(empresa.id))
  }, [empresas, currentUser])

  const motoboyOptions = useMemo(() => {
    const motoboys = new Set<string>()
    pedidos.forEach((pedido) => {
      if (pedido.motoboy && (pedido.status === "S" || pedido.status === "E")) {
        motoboys.add(pedido.motoboy)
      }
    })
    return Array.from(motoboys).sort()
  }, [pedidos])

  const filtrosAtivos = Object.values(filtros).filter(Boolean).length

  return (
    <div className="bg-white border rounded-lg p-6 space-y-6 shadow-sm">
      <div className="flex items-center justify-between">
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
        <Button
          variant="outline"
          size="sm"
          onClick={onLimparFiltros}
          className="text-muted-foreground hover:text-foreground bg-transparent"
        >
          <X className="h-4 w-4 mr-2" />
          Limpar filtros
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
              onChange={(e) => setFiltros((prev: any) => ({ ...prev, numeroPedido: e.target.value }))}
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
              onChange={(e) => setFiltros((prev: any) => ({ ...prev, telefoneCliente: e.target.value }))}
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
              onChange={(e) => setFiltros((prev: any) => ({ ...prev, nomeCliente: e.target.value }))}
              className="pl-10 py-3"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            Empresa
          </Label>
          <Select
            value={filtros.empresa}
            onValueChange={(value) => setFiltros((prev: any) => ({ ...prev, empresa: value }))}
          >
            <SelectTrigger className="w-full py-3">
              <SelectValue placeholder="Selecione uma empresa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as empresas</SelectItem>
              {empresasDisponiveis.map((empresa) => (
                <SelectItem key={empresa.id} value={empresa.id.toString()}>
                  {empresa.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Truck className="h-4 w-4 text-muted-foreground" />
            Motoboy
          </Label>
          <Select
            value={filtros.motoboy}
            onValueChange={(value) => setFiltros((prev: any) => ({ ...prev, motoboy: value }))}
            disabled={!colunasVisiveis.S && !colunasVisiveis.E}
          >
            <SelectTrigger className="w-full py-3">
              <SelectValue placeholder="Selecione um motoboy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os motoboys</SelectItem>
              {motoboyOptions.map((motoboy) => (
                <SelectItem key={motoboy} value={motoboy}>
                  {motoboy}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!colunasVisiveis.S && !colunasVisiveis.E && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Disponível apenas para "Saiu para entrega" e "Entregue"
            </p>
          )}
        </div>
      </div>

      {filtrosAtivos > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <span className="text-sm text-muted-foreground">Filtros ativos:</span>
          {filtros.numeroPedido && (
            <Badge variant="outline" className="gap-1">
              <Hash className="h-3 w-3" />
              Pedido: {filtros.numeroPedido}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => setFiltros((prev: any) => ({ ...prev, numeroPedido: "" }))}
              />
            </Badge>
          )}
          {filtros.telefoneCliente && (
            <Badge variant="outline" className="gap-1">
              <Phone className="h-3 w-3" />
              Tel: {filtros.telefoneCliente}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => setFiltros((prev: any) => ({ ...prev, telefoneCliente: "" }))}
              />
            </Badge>
          )}
          {filtros.nomeCliente && (
            <Badge variant="outline" className="gap-1">
              <User className="h-3 w-3" />
              Nome: {filtros.nomeCliente}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => setFiltros((prev: any) => ({ ...prev, nomeCliente: "" }))}
              />
            </Badge>
          )}
          {filtros.empresa && filtros.empresa !== "all" && (
            <Badge variant="outline" className="gap-1">
              <Building2 className="h-3 w-3" />
              Empresa: {empresasDisponiveis.find((e) => e.id.toString() === filtros.empresa)?.nome}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => setFiltros((prev: any) => ({ ...prev, empresa: "" }))}
              />
            </Badge>
          )}
          {filtros.motoboy && filtros.motoboy !== "all" && (
            <Badge variant="outline" className="gap-1">
              <Truck className="h-3 w-3" />
              Motoboy: {filtros.motoboy}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => setFiltros((prev: any) => ({ ...prev, motoboy: "" }))}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}

// ---------------- KanbanPedidos ----------------
const KanbanPedidos = () => {
  const hoje = new Date()
  const [selectedDay, setSelectedDay] = useState<Date>(hoje)

  const selectedDate = format(selectedDay, "yyyy-MM-dd")

  const [selecionados, setSelecionados] = useState<Set<number>>(new Set())
  const [colunasVisiveis, setColunasVisiveis] = useState<Record<PedidoStatus, boolean>>(() =>
    Object.keys(statusMap).reduce((acc, key) => ({ ...acc, [key]: true }), {} as Record<PedidoStatus, boolean>),
  )

  const [filtros, setFiltros] = useState({
    numeroPedido: "",
    telefoneCliente: "",
    nomeCliente: "",
    empresa: "all",
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
    if (filtros.empresa === "all") {
      return empresasDisponiveis[0]?.id?.toString()
    }
    return filtros.empresa
  }, [filtros.empresa, empresasDisponiveis])

  const { data: pedidos = [], isLoading } = useFetchPedidosAdminKanban(selectedDate, empresaIdParam)
  const { atualizarStatus } = useMutatePedidoAdmin()

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

      // Removed filtro por empresa_id pois agora é feito na API
      // if (filtros.empresa !== "all" && pedido.empresa_id?.toString() !== filtros.empresa) {
      //   return false
      // }

      if (filtros.motoboy !== "all" && (pedido.status === "S" || pedido.status === "E")) {
        if (!pedido.motoboy?.toLowerCase().includes(filtros.motoboy.toLowerCase())) {
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
  }, [pedidos, filtros])

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

  const handleCancelarSelecionados = () => setSelecionados(new Set())

  const limparFiltros = () => {
    setFiltros({
      numeroPedido: "",
      telefoneCliente: "",
      nomeCliente: "",
      empresa: "all",
      motoboy: "all",
    })
  }

  if (isLoading) return <p>Carregando pedidos...</p>

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col p-4 space-y-4">
      <FiltrosAvancados
        filtros={filtros}
        setFiltros={setFiltros}
        colunasVisiveis={colunasVisiveis}
        pedidos={pedidos}
        onLimparFiltros={limparFiltros}
      />

      <div className="flex justify-between">
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
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <DatePicker date={selectedDay} onChange={setSelectedDay} />
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
        />
      )}
    </div>
  )
}

export default KanbanPedidos
