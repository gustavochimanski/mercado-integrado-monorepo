"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@supervisor/components/ui/dialog";
import { Button } from "@supervisor/components/ui/button";

import {
  Banner,
  useBanners,
  useMutateBanner,
} from "@supervisor/services/useQueryBanners";
import { BannerCard } from "./BannerCard";
import AdicionarBannerModal from "./AdcionarBannerModal";
import { Parceiro } from "@supervisor/services/useQueryParceiros";
import AdicionarParceiroModal from "./AdcionarParceiroModal";

interface ParceiroBannersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parceiro?: Parceiro;
}

export default function ParceiroBannersModal({
  open,
  onOpenChange,
  parceiro,
}: ParceiroBannersModalProps) {
  const { data: banners, refetch } = useBanners();
  const [openAdicionar, setOpenAdicionar] = useState(false);
  const [openEditarParceiro, setOpenEditarParceiro] = useState(false); // ✅ faltava
  const [bannerEdit, setBannerEdit] = useState<Banner | null>(null);

  const { remove } = useMutateBanner();

  if (!parceiro) return null;

  const bannersParceiro =
    banners?.filter((b) => b.parceiro_id === parceiro.id) ?? [];

  const handleRemove = async (bannerId: number) => {
    try {
      await remove.mutateAsync(bannerId);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  console.log(parceiro)
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Banners do Parceiro</DialogTitle>
          </DialogHeader>

          {/* Cabeçalho do parceiro com botão de editar */}
          <div className="flex items-center justify-between mb-4 p-2 border rounded-md bg-gray-50">
            <div>
              <p className="text-sm font-medium">{parceiro.nome}</p>
              <p className="text-xs text-muted-foreground">
                {parceiro.ativo ? "Ativo" : "Inativo"}
              </p>
            </div>
            <Button size="sm" onClick={() => setOpenEditarParceiro(true)}>
              Editar parceiro
            </Button>
          </div>

          {/* GRID DE BANNERS */}
          {/* GRID DE BANNERS - agora em linha horizontal rolável */}
          <div className="overflow-x-auto py-2">
            <div className="flex gap-4">
              {bannersParceiro.map((b) => (
                <BannerCard
                  key={b.id}
                  banner={b}
                  onEdit={(banner) => setBannerEdit(banner)}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </div>


          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
            <Button
              onClick={() => {
                setBannerEdit(null);
                setOpenAdicionar(true);
              }}
            >
              Adicionar banner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para adicionar banner */}
      <AdicionarBannerModal
        open={openAdicionar}
        onOpenChange={setOpenAdicionar}
        parceiro={parceiro}
        onSaved={() => refetch()}
      />

      {/* Modal para editar parceiro */}
      <AdicionarParceiroModal
        open={openEditarParceiro}
        onOpenChange={setOpenEditarParceiro}
        parceiro={parceiro}
      />
    </>
  );
}
