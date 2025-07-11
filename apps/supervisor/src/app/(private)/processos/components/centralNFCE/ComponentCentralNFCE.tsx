"use client";

import DataTableComponentMui from "@supervisor/components/shared/table/mui-data-table";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@supervisor/components/ui/card";
import { Input } from "@supervisor/components/ui/input";
import { Circle } from "lucide-react";

import { nfceColumns, nfceColumnOrder } from "./columns";
import { useState } from "react";
import { Modal } from "@supervisor/components/ui/modal";

// types/CupomNFCE.ts
export type CupomNFCE = {
  id: number;
  empresa: string | number;
  pdv: string;
  dataMvto: string;
  dataHoraEmitido: string;
  dataHoraCancelado: string;
  sit: string;
  cupom: number;
  dcto: string;
  serie: string;
  cnpjCpf: number;
  chave: number;
  protocolo: number;
  protocoloCanc: string;
  valor: number;
  status: string;
  motivo: string;
  supCanc: string;
  nomeSupCanc: string;
};


interface Props {
  dados: CupomNFCE[];
}

const ComponentCentralNFCE = ( { dados }: Props) => {
  const [modalView, setModalView] = useState(false);
  const [dataModalView, setDataModalView] = useState<any>();

  const handleOpenVisualizarModal = (row: any) => {
    console.log("Visualizar:", row);
    setModalView(true)
    setDataModalView(row)
  };

  
  return (
    <div className="flex flex-col h-full">
      <Card className=" flex flex-col h-full">
        <CardHeader>
          <CardTitle>Central NFCE</CardTitle>
          <CardDescription />
        </CardHeader>

        <CardContent className="font-semibold flex justify-between gap-4  mb-0">
          {/* Filtros */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 w-20">
              <h1>Empresa</h1>
              <Input />
            </div>
            <div className="flex flex-col gap-1 w-40">
              <h1>Pdvs</h1>
              <Input />
            </div>
            <div className="flex flex-col gap-1 w-32">
              <h1>Série</h1>
              <Input />
            </div>
            <div className="flex flex-col text-center gap-1 w-10">
              <h1>Sit</h1>
              <Input className="text-center" />
            </div>
            <div className="flex flex-col gap-1 w-32">
              <h1>Data inicial</h1>
              <Input />
            </div>
            <div className="flex flex-col gap-1 w-32">
              <h1>Data final</h1>
              <Input />
            </div>
          </div>

          {/* Legenda */}
          <div className="flex flex-col text-sm gap-2">
            <h1 className="font-semibold items-end mb-1">Legenda</h1>
            <div className="flex gap-x-4 gap-y-1">
              <div className="flex items-center gap-2">
                <Circle className="w-4 h-4 text-green-500 fill-green-500" />
                <span>Autorizado</span>
              </div>
              <div className="flex items-center gap-2">
                <Circle className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span>Pendente</span>
              </div>
              <div className="flex items-center gap-2">
                <Circle className="w-4 h-4 text-red-500 fill-red-500" />
                <span>Cancelado</span>
              </div>
              <div className="flex items-center gap-2">
                <Circle className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span>Inutilizado</span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardContent className="p-0 flex-1 overflow-hidden">
          <DataTableComponentMui
            rows={dados}
            columns={nfceColumns(handleOpenVisualizarModal)}
            columnOrder={nfceColumnOrder}
          />
        </CardContent>
      </Card>

      {modalView && (
        <Modal onClose={() => setModalView(false)} style={{ width: "80vw", height: "70vh" }}>
          <Card >
            <CardHeader>
              <CardTitle>Detalhes do Cupom</CardTitle>
              <CardDescription>Informações completas do registro</CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              {dataModalView.idPerfil}
            </CardContent>
          </Card>
        </Modal>
      )}

    </div>
  );
};

export default ComponentCentralNFCE;
