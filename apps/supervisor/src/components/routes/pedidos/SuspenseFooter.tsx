import { PedidoStatus } from "@supervisor/types/pedido";
import { statusMap } from "./Kanban";
import { useState, useEffect } from "react";
import { SelecionarEntregadorModal } from "./SelecionarEntregadorModal";
import { ConfirmarDesvincularModal } from "./ConfirmarDesvincularModal";
import { useMutatePedidoAdmin, useFetchPedidoDetalhes } from "@supervisor/services/useQueryPedidoAdmin";
import apiMensura from "@supervisor/lib/api/apiMensura";

// ---------------- FooterSelecionados com transition ----------------
export const FooterSelecionados = ({
  count,
  onMoverSelecionados,
  onCancelar,
  visivel,
  pedidosSelecionados = [], // Array de pedidos selecionados
}: {
  count: number;
  onMoverSelecionados: (novoStatus: PedidoStatus) => void;
  onCancelar: () => void;
  visivel: boolean;
  pedidosSelecionados?: Array<{ id: number; status: string; entregador_id?: number | null }>; // Dados dos pedidos selecionados
}) => {
  const [isEntregadorModalOpen, setIsEntregadorModalOpen] = useState(false)
  const [isDesvincularModalOpen, setIsDesvincularModalOpen] = useState(false)
  const [statusParaMover, setStatusParaMover] = useState<PedidoStatus | null>(null)
  const [pedidosParaProcessar, setPedidosParaProcessar] = useState<Array<{ id: number; status: string; entregador_id?: number | null }>>([])
  const [pedidoAtual, setPedidoAtual] = useState<{ id: number; status: string; entregador_id?: number | null } | null>(null)
  const [indiceAtual, setIndiceAtual] = useState(0)
  const [pedidosCompletos, setPedidosCompletos] = useState<Array<{ id: number; status: string; entregador_id?: number | null }>>([])
  const { atualizarStatus, vincularEntregador } = useMutatePedidoAdmin()

  // Buscar dados completos dos pedidos selecionados
  useEffect(() => {
    if (pedidosSelecionados.length > 0) {
      const buscarDadosCompletos = async () => {
        try {
          const promises = pedidosSelecionados.map(async (pedido) => {
            const { data } = await apiMensura.get(`/api/delivery/pedidos/admin/${pedido.id}`)
            return {
              id: pedido.id,
              status: pedido.status,
              entregador_id: data.entregador?.id || null
            }
          })
          
          const pedidosComDadosCompletos = await Promise.all(promises)
          setPedidosCompletos(pedidosComDadosCompletos)
        } catch (error) {
          // Erro silencioso ao buscar dados completos
        }
      }
      
      buscarDadosCompletos()
    }
  }, [pedidosSelecionados])

  // Função para verificar se precisa vincular entregador
  const precisaVincularEntregador = (novoStatus: PedidoStatus) => {
    return novoStatus === "S" && pedidosCompletos.some(pedido => !pedido.entregador_id)
  }

  // Função para verificar se precisa desvincular entregador
  const precisaDesvincularEntregador = (novoStatus: PedidoStatus) => {
    const temEntregador = pedidosCompletos.some(pedido => pedido.entregador_id)
    const statusValido = novoStatus === "P" || novoStatus === "R"
    return statusValido && temEntregador
  }

  // Função para mover pedidos selecionados
  const handleMoverPedidos = async (novoStatus: PedidoStatus) => {    
    if (precisaVincularEntregador(novoStatus)) {
      // Separar pedidos que precisam de entregador dos que não precisam
      const pedidosSemEntregador = pedidosCompletos.filter(pedido => !pedido.entregador_id)
      const pedidosComEntregador = pedidosCompletos.filter(pedido => pedido.entregador_id)
      
      // Atualizar status dos pedidos que já têm entregador
      pedidosComEntregador.forEach(pedido => {
        atualizarStatus.mutate({ id: pedido.id, status: novoStatus })
      })

      // Processar pedidos sem entregador um por vez
      if (pedidosSemEntregador.length > 0) {
        setStatusParaMover(novoStatus)
        setPedidosParaProcessar(pedidosSemEntregador)
        setPedidoAtual(pedidosSemEntregador[0])
        setIndiceAtual(0)
        setIsEntregadorModalOpen(true)
      }
    } else if (precisaDesvincularEntregador(novoStatus)) {
      // Abrir modal de confirmação para desvincular
      setStatusParaMover(novoStatus)
      setIsDesvincularModalOpen(true)
    } else {
      onMoverSelecionados(novoStatus)
    }
  }

  // Função para confirmar seleção de entregador
  const handleConfirmEntregador = async (entregadorId: number) => {
    if (!statusParaMover || !pedidoAtual) return

    try {
      // Vincular entregador para o pedido atual
      await vincularEntregador.mutateAsync({ 
        pedidoId: pedidoAtual.id, 
        entregadorId 
      })

      // Atualizar status do pedido atual
      atualizarStatus.mutate({ id: pedidoAtual.id, status: statusParaMover })

      // Verificar se há mais pedidos para processar
      const proximoIndice = indiceAtual + 1
      
      if (proximoIndice < pedidosParaProcessar.length) {
        // Próximo pedido - manter modal aberto
        const proximoPedido = pedidosParaProcessar[proximoIndice]
        setPedidoAtual(proximoPedido)
        setIndiceAtual(proximoIndice)
      } else {
        // Finalizou todos os pedidos
        setIsEntregadorModalOpen(false)
        setStatusParaMover(null)
        setPedidosParaProcessar([])
        setPedidoAtual(null)
        setIndiceAtual(0)
        onCancelar() // Fechar o SuspenseFooter e desmarcar pedidos
      }
        } catch (error) {
          // Erro silencioso ao vincular entregador
        }
  }

  // Função para pular pedido atual
  const handlePularPedido = () => {
    const proximoIndice = indiceAtual + 1
    if (proximoIndice < pedidosParaProcessar.length) {
      setPedidoAtual(pedidosParaProcessar[proximoIndice])
      setIndiceAtual(proximoIndice)
    } else {
      setIsEntregadorModalOpen(false)
      setStatusParaMover(null)
      setPedidosParaProcessar([])
      setPedidoAtual(null)
      setIndiceAtual(0)
      onCancelar() // Fechar o SuspenseFooter e desmarcar pedidos
    }
  }

  // Função para confirmar desvinculação
  const handleConfirmarDesvincular = async () => {
    if (!statusParaMover) return

    try {
      // Desvincular entregador dos pedidos que têm entregador
      const pedidosComEntregador = pedidosCompletos.filter(pedido => pedido.entregador_id)
      
      // Desvincular todos os entregadores primeiro (aguardar conclusão)
      const desvincularPromises = pedidosComEntregador.map(pedido => 
        vincularEntregador.mutateAsync({ 
          pedidoId: pedido.id, 
          entregadorId: null 
        })
      )
      
      await Promise.all(desvincularPromises)
      
      // Atualizar status de todos os pedidos após desvincular (aguardar também)
      const atualizarPromises = pedidosCompletos.map(pedido => 
        atualizarStatus.mutateAsync({ id: pedido.id, status: statusParaMover })
      )
      
      await Promise.all(atualizarPromises)

      // Fechar modal e limpar seleção
      setIsDesvincularModalOpen(false)
      setStatusParaMover(null)
      onCancelar() // Fechar o SuspenseFooter e desmarcar pedidos
      } catch (error) {
        // Erro silencioso ao desvincular entregadores
      }
  }

  return (
    <div
      className={`
        fixed bottom-4 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-xl px-4 py-3 flex flex-col gap-3 items-center z-50 border h-24
        transition-all duration-300 ease-in-out
        ${visivel ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}
      `}
    >
      {/* Botão X no canto superior direito */}
      <button
        onClick={onCancelar}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        aria-label="Cancelar Edição"
      >
        ✕
      </button>

      <span className="font-semibold">{count} selecionado(s)</span>
      
      <div className="flex gap-3">
        {Object.entries(statusMap).map(([statusKey, meta]) => (
          <button
            key={statusKey}
            onClick={() => handleMoverPedidos(statusKey as PedidoStatus)}
            className={`px-3 py-1 rounded-full text-xs font-semibold ${meta.headerClass} hover:opacity-80 transition`}
          >
            {meta.label}
          </button>
        ))}
      </div>

      {/* Modal de seleção de entregador */}
      <SelecionarEntregadorModal
        isOpen={isEntregadorModalOpen}
        onClose={() => {
          setIsEntregadorModalOpen(false)
          setStatusParaMover(null)
          setPedidosParaProcessar([])
          setPedidoAtual(null)
          setIndiceAtual(0)
        }}
        onConfirm={handleConfirmEntregador}
        pedidoId={pedidoAtual?.id}
        pedidosIds={pedidosParaProcessar.map(p => p.id)}
        isMultiplo={true}
        pedidoAtual={pedidoAtual}
        indiceAtual={indiceAtual}
        totalPedidos={pedidosParaProcessar.length}
        onPular={handlePularPedido}
      />

      {/* Modal de confirmação para desvincular entregador */}
      <ConfirmarDesvincularModal
        isOpen={isDesvincularModalOpen}
        onClose={() => {
          setIsDesvincularModalOpen(false)
          setStatusParaMover(null)
        }}
        onConfirm={handleConfirmarDesvincular}
        pedidosIds={pedidosSelecionados.map(p => p.id)}
        isMultiplo={true}
      />
    </div>
  );
};
