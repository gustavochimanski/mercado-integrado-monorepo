import { HistoricoTabProps } from "@supervisor/types/pedidos/modal"

// Componente funcional HistoricoTab
export const HistoricoTab: React.FC<HistoricoTabProps> = ({
  pedidoCompleto,
  formatDateTime
}) => {

  // Renderiza o componente
  return (
    <div className="space-y-6 mt-6">

      {/* Seção de Histórico do Pedido */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Histórico do Pedido</h3>
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4 border">

            {/* Data de Criação do Pedido */}
            <div className="flex justify-between items-center">
              <span className="font-medium">Pedido Criado</span>
              <span className="text-sm text-muted-foreground">
                {pedidoCompleto?.data_criacao ? formatDateTime(pedidoCompleto.data_criacao) : ""}
              </span>
            </div>
          </div>

          {/* Data de Última Atualização do Pedido */}
          {pedidoCompleto?.data_atualizacao && (
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex justify-between items-center">
                <span className="font-medium">Última Atualização</span>
                <span className="text-sm text-muted-foreground">
                  {formatDateTime(pedidoCompleto.data_atualizacao)}
                </span>
              </div>
            </div>
          )}

          {/* Origem do Pedido */}
          <div className="bg-white rounded-lg p-4 border">
            <div className="flex justify-between items-center">
              <span className="font-medium">Origem do Pedido</span>
              <span className="text-sm text-muted-foreground">
                {pedidoCompleto?.origem || "Não informado"}
              </span>
            </div>
          </div>

          {/* Empresa do Pedido */}
          {pedidoCompleto?.empresa && (
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex justify-between items-center">
                <span className="font-medium">Empresa</span>
                <span className="text-sm text-muted-foreground">
                  {pedidoCompleto.empresa.nome}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}