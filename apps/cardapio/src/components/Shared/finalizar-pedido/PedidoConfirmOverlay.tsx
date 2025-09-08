import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PedidoConfirmOverlay({ show }: { show: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        router.push("/pedidos"); // redireciona depois de 2.5s
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, router]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-green-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
