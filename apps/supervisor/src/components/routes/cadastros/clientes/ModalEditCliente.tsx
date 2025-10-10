"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@supervisor/components/ui/dialog";
import { User, MapPin } from "lucide-react";
import Tabs from "@supervisor/components/shared/tabs/tabs";
import TabDadosCliente from "./TabDadosCliente";
import TabEnderecosCliente from "./TabEnderecosCliente";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente: any;
}

export const ModalEditarCliente = ({ open, onOpenChange, cliente }: Props) => {
  if (!cliente) return null;

  const tabItems = [
    {
      value: "dados",
      label: (
        <span className="flex items-center gap-2">
          <User size={14} /> Dados do Cliente
        </span>
      ),
      Component: () => <TabDadosCliente cliente={cliente} onSaved={() => {}} />,
    },
    {
      value: "enderecos",
      label: (
        <span className="flex items-center gap-2">
          <MapPin size={14} /> Endereços
        </span>
      ),
      Component: () => <TabEnderecosCliente cliente={cliente} onSaved={() => {}} />,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[62vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <User className="w-6 h-6" />
            {cliente.nome}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs
            items={tabItems}
            containerClassName="h-full"
            contentClassName="overflow-auto"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalEditarCliente;