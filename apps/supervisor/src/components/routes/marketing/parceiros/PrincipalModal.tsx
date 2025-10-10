"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@supervisor/components/ui/dialog";
import { Handshake, Image as ImageIcon } from "lucide-react";
import { useParceiroFull } from "@supervisor/services/useQueryParceiros";
import Tabs from "@supervisor/components/shared/tabs/tabs";
import TabDadosParceiro from "./TabDadosParceiro";
import TabBanners from "./TabBanners";

interface ParceiroBannersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parceiroId?: number;
}

export default function ParceiroBannersModal({
  open,
  onOpenChange,
  parceiroId,
}: ParceiroBannersModalProps) {
  const { data: parceiro, refetch, isLoading } = useParceiroFull(parceiroId);

  if (!parceiroId) return null;
  if (isLoading) return <p className="p-4 text-sm">Carregando...</p>;
  if (!parceiro) return null;

  const tabItems = [
    {
      value: "dados",
      label: (
        <span className="flex items-center gap-2">
          <Handshake size={14} /> Dados do Parceiro
        </span>
      ),
      Component: () => <TabDadosParceiro parceiro={parceiro} onSaved={refetch} />,
    },
    {
      value: "banners",
      label: (
        <span className="flex items-center gap-2">
          <ImageIcon size={14} /> Banners
        </span>
      ),
      Component: () => <TabBanners parceiro={parceiro} onSaved={refetch} />,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Handshake className="w-6 h-6" />
            {parceiro.nome}
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
}
