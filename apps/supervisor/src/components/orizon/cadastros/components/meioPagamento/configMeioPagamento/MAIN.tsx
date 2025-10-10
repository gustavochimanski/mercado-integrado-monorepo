"use client";

import React, { useImperativeHandle, useState, forwardRef, useEffect } from "react";

import { Separator } from "@supervisor/components/ui/separator";
import { ConfiguracaoMeioPag, MeioPgto } from "@supervisor/components/orizon/cadastros/types/typesMeioPag";
import { CardContent, CardDescription } from "@supervisor/components/ui/card";
import InfoSection from "./Informacoes";
import GeneralSettings from "./Geral";
import CartaoSettings from "./Cartao";
import ConvenioSettings from "./Convenio";
import SangriaSettings from "./Sangria";
import TrocoSettings from "./Troco";
import DescontosSettings from "./Descontos";
import ContraValeSettings from "./ContraVale";
import TicketSettings from "./Tickets";
import OtherSettings from "./Outras";
import { 
  useAtualizarConfigMpgto, 
  useAtualizarDescricaoMeioPgto, 
  useFetchByIdMeioPgto 
} from "@supervisor/components/orizon/cadastros/hooks/useMeioPag";

interface ConfigsMeioPagamentoHandles {
  handleSubmit: () => Promise<void>;
}

interface Props {
  idMeioPgto: string;
}

const ConfigsMeioPagamento = forwardRef<ConfigsMeioPagamentoHandles, Props>(({ idMeioPgto }, ref) => {
  const [dadosMeioPgto, setDadosMeioPgto] = useState<MeioPgto | null>(null);
  const [configDadosMeioPgto, setConfigDadosMeioPgto] = useState<ConfiguracaoMeioPag[]>([]);
  const [originalConfigDadosMeioPgto, setOriginalConfigDadosMeioPgto] = useState<ConfiguracaoMeioPag[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { data: dataConfigMpgto } = useFetchByIdMeioPgto(idMeioPgto);
  const atualizaConfigMpgto = useAtualizarConfigMpgto();
  const atualizaDescricao = useAtualizarDescricaoMeioPgto();

  useEffect(() => {
    if (dataConfigMpgto) {
      setDadosMeioPgto(dataConfigMpgto);
      setConfigDadosMeioPgto(dataConfigMpgto.configuracao || []);
      setOriginalConfigDadosMeioPgto(dataConfigMpgto.configuracao || []);
    }
  }, [dataConfigMpgto]);

  const handleChange = (
    key: keyof ConfiguracaoMeioPag,
    value: any,
    nomeCampo: string
  ) => {
    if (!nomeCampo) {
      console.warn("nomeCampo não fornecido para handleChange");
      return;
    }

    setConfigDadosMeioPgto((prevConfigs) =>
      prevConfigs.map((config) =>
        config.nomeCampo === nomeCampo
          ? { ...config, [key]: value }
          : config
      )
    );
  };

  const handleSubmit = async () => {
    if (!dadosMeioPgto?.id) return;
    setLoading(true);

    try {
      // Atualiza descrição, se mudou
      if (dadosMeioPgto.descricao) {
        await atualizaDescricao.mutateAsync({
          id: dadosMeioPgto.id.toString(),
          novaDescricao: dadosMeioPgto.descricao
        });
      }

      // Atualiza configs se houve alteração (atenção à ordem do array)
      if (
        JSON.stringify(configDadosMeioPgto) !==
        JSON.stringify(originalConfigDadosMeioPgto)
      ) {
        await atualizaConfigMpgto.mutateAsync(configDadosMeioPgto);
        setOriginalConfigDadosMeioPgto(configDadosMeioPgto); // Atualiza original pra evitar múltiplos saves
      }

    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  if (!dadosMeioPgto) {
    return <div>Carregando dados...</div>;
  }

  return (
    <form
      className="p-4 flex flex-col h-full"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <CardDescription>
        <Separator className="my-3" />
        <InfoSection
          dadosMeioPgto={dadosMeioPgto}
          setDescricao={(desc) =>
            setDadosMeioPgto((prev) => prev && { ...prev, descricao: desc })
          }
          setTipoMpgto={(tipo) =>
            setDadosMeioPgto((prev) => prev && { ...prev, tipoMeioPgto: tipo })
          }
        />
      </CardDescription>

      <CardContent className="flex-1 overflow-auto">
        <Separator className="my-5" />
        <GeneralSettings configDadosMeioPgto={configDadosMeioPgto} handleChange={handleChange} />
        <Separator className="my-5" />
        <CartaoSettings configDadosMeioPgto={configDadosMeioPgto} handleChange={handleChange} />
        <Separator className="my-5" />
        <ConvenioSettings configDadosMeioPgto={configDadosMeioPgto} handleChange={handleChange} />
        <Separator className="my-5" />
        <SangriaSettings configDadosMeioPgto={configDadosMeioPgto} handleChange={handleChange} />
        <Separator className="my-5" />
        <TrocoSettings configDadosMeioPgto={configDadosMeioPgto} handleChange={handleChange} />
        <Separator className="my-5" />
        <DescontosSettings configDadosMeioPgto={configDadosMeioPgto} handleChange={handleChange} />
        <Separator className="my-5" />
        <ContraValeSettings configDadosMeioPgto={configDadosMeioPgto} handleChange={handleChange} />
        <Separator className="my-5" />
        <TicketSettings configDadosMeioPgto={configDadosMeioPgto} handleChange={handleChange} />
        <Separator className="my-5" />
        <OtherSettings configDadosMeioPgto={configDadosMeioPgto} handleChange={handleChange} />
        <Separator className="my-5" />
      </CardContent>

 
    </form>

  );
});

ConfigsMeioPagamento.displayName = "ConfigsMeioPagamento";
export default ConfigsMeioPagamento;
