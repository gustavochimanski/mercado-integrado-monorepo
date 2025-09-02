import { PedidoStatus } from "@supervisor/types/pedido";
import { statusMap } from "./Kanban";

// ---------------- FooterSelecionados com transition ----------------
export const FooterSelecionados = ({
  count,
  onMoverSelecionados,
  onCancelar,
  visivel,
}: {
  count: number;
  onMoverSelecionados: (novoStatus: PedidoStatus) => void;
  onCancelar: () => void;
  visivel: boolean;
}) => {
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
            onClick={() => onMoverSelecionados(statusKey as PedidoStatus)}
            className={`px-3 py-1 rounded-full text-xs font-semibold ${meta.headerClass} hover:opacity-80 transition`}
          >
            {meta.label}
          </button>
        ))}
      </div>
    </div>
  );
};
