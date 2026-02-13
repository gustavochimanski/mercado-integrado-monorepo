import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { Button } from "@cardapio/components/Shared/ui/button";
import { X, XCircle } from "lucide-react";

interface PedidoConfirmOverlayProps {
  show: boolean;
  type?: "success" | "error";
  message?: string;
  onClose?: () => void;
}

export default function PedidoConfirmOverlay({ 
  show, 
  type = "success", 
  message,
  onClose 
}: PedidoConfirmOverlayProps) {
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (type === "error") {
      // Se for erro e não tiver onClose, não faz nada (deixa o usuário fechar manualmente)
    }
  };

  // Se for sucesso, auto-fechar após animação completar
  useEffect(() => {
    if (!show) return;
    if (type !== "success") return;
    // Durations baseadas nas animações definidas acima:
    // círculo: delay 0.8 + duration 0.6 = 1.4
    // check: delay 1.2 + duration 0.8 = 2.0
    // texto: delay 1.5 + duration 0.5 = 2.0
    // Dar um pequeno buffer e fechar após ~2200ms
    const timer = setTimeout(() => {
      handleClose();
    }, 2200);
    return () => clearTimeout(timer);
  }, [show, type]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/20`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`flex flex-col items-center justify-center gap-6 p-8 text-center w-full max-w-md mx-auto min-h-screen rounded-none ${
              type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {type === "success" ? (
              <>
                <motion.svg
                  width="200"
                  height="200"
                  viewBox="0 0 52 52"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-white"
                >
                  {/* Círculo completo */}
                  <motion.circle
                    cx="26"
                    cy="26"
                    r="25"
                    strokeWidth="2"
                    stroke="white"
                    fill="none"
                    strokeDasharray={157} // circunferência aproximada (2πr = 2*3.14*25)
                    strokeDashoffset={157}
                    initial={{ strokeDashoffset: 157 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ delay: 0.8, duration: 0.6, ease: "easeInOut" }}
                  />
                  {/* Check */}
                  <motion.path
                    d="M14 27 L22 34 L38 16"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={40} // comprimento aproximado do check
                    strokeDashoffset={40}
                    initial={{ strokeDashoffset: 40 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ delay: 1.2, duration: 0.8, ease: "easeInOut" }}
                  />
                </motion.svg>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                  className="text-white"
                >
                  <h2 className="text-3xl font-bold mb-2">Pedido Confirmado!</h2>
                  <p className="text-lg opacity-90">
                    {message || "Seu pedido foi enviado com sucesso"}
                  </p>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  <XCircle size={120} className="text-white" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-white max-w-md"
                >
                  <h2 className="text-3xl font-bold mb-4">Ops! Algo deu errado</h2>
                  <p className="text-lg opacity-90 mb-6">
                    {message || "Não foi possível finalizar seu pedido. Tente novamente."}
                  </p>
                  <Button
                    onClick={handleClose}
                    variant="outline"
                    className="bg-white text-red-600 hover:bg-gray-100 border-white"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Fechar
                  </Button>
                </motion.div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
