"use client"
import CardInfoButton from "@supervisor/components/shared/Card/CardInfoButton";
import { CircleArrowRight, Send } from "lucide-react";
import ModalEnviarConfiguracao from "./ModalEnviarConfiguracoes";
import ModalEnviarProdutos from "./ModalEnviarProdutos";
import { useModalStore } from "@supervisor/store/useModalStore";

const ComponentComunicacao = () => {
  const { openEnviarConfig, openEnviarProdutos } = useModalStore();

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <CardInfoButton
          title="Enviar Configuração"
          description="Envia as configurações aplicadas para a frente de caixa."
          titleButton="Enviar"
          icon={<CircleArrowRight size={16} />}
          onClick={openEnviarConfig}
        />

        <CardInfoButton
          title="Enviar Carga de Produtos"
          description="Realiza o envio completo de todos os produtos para a frente de caixa. Esse processo pode levar alguns minutos."
          titleButton="Enviar"
          icon={<CircleArrowRight size={16} />}
          onClick={openEnviarProdutos}
        />
      </div>

      <ModalEnviarConfiguracao  />
      <ModalEnviarProdutos  />
    </>
  );
};

export default ComponentComunicacao;
