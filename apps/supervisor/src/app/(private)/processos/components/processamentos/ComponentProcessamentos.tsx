"use client"
import CardInfoButton from "@supervisor/components/shared/Card/CardInfoButton";
import { RefreshCcw } from "lucide-react";
import ModalProcessarPdv from "./ModalProcessarPdv";
import { useState } from "react";
import ModalProcessarCupom from "./ModalProcessarCupom";
import { useModalStore } from "@supervisor/store/useModalStore";


const ComponentProcessamentos = () => {

    const [modalAberto, setModalAberto] = useState<string | null>(null);
    const {openReprocessarPdv } = useModalStore()

    return (
        <>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <CardInfoButton
            title="Processamento de PDVs"
            description="Reprocessa os caixas para corrigir divergências identificadas. Utilize esta opção caso haja inconsistências na auditoria de vendas."
            titleButton="Reprocessar"
            icon={<RefreshCcw size={16} />}
            onClick={openReprocessarPdv}
          />
          <CardInfoButton
            title="Processamento de Cupom"
            description="Reprocessar cupons em caso de divergência de itens."
            titleButton="Reprocessar"
            icon={<RefreshCcw size={16} />}
            onClick={openReprocessarPdv}
          />
        </div>
  
        <ModalProcessarPdv />
        <ModalProcessarCupom isOpen={modalAberto === "processarPdv"}  onClose={() => setModalAberto(null)} />
      </>
    );
};

export default ComponentProcessamentos