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

import { BannerCard } from "./BannerCard";
import AdicionarBannerModal from "./AdcionarBannerModal";
import AdicionarParceiroModal from "./AdcionarParceiroModal";
import { useParceiroFull } from "@supervisor/services/useQueryParceiros"; // ✅ agora vem do full
import { BannerParceiroOut, CupomParceiroOut } from "@supervisor/services/useQueryParceiros";
import { useMutateBanner } from "@supervisor/services/useQueryBanners";

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
  const [openAdicionar, setOpenAdicionar] = useState(false);
  const [openEditarParceiro, setOpenEditarParceiro] = useState(false);
  const [bannerEdit, setBannerEdit] = useState<BannerParceiroOut | null>(null);
  const { remove } = useMutateBanner();

  // 🔥 Hook que já traz banners e cupons juntos
  const { data: parceiro, refetch, isLoading } = useParceiroFull(parceiroId);

  if (!parceiroId) return null;
  if (isLoading) return <p className="p-4 text-sm">Carregando...</p>;
  if (!parceiro) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl overflow-auto h-[90vh] ">
          <DialogHeader>
            <DialogTitle>Parceiro</DialogTitle>
          </DialogHeader>

          {/* Cabeçalho do parceiro */}
          <div className="flex items-center justify-between p-2 border rounded-md  bg-gray-50">
            <div>
              <p className="text-sm font-medium">{parceiro.nome}</p>
              <p className="text-xs text-muted-foreground">
                {parceiro.ativo ? "Ativo" : "Inativo"}
              </p>
              {parceiro.telefone && (
                <p className="text-xs text-muted-foreground">
                  📞 {parceiro.telefone}
                </p>
              )}
            </div>
            <Button size="sm" onClick={() => setOpenEditarParceiro(true)}>
              Editar parceiro
            </Button>
          </div>

          {/* BANNERS */}
          <h3 className="text-sm font-semibold mb-2">Banners</h3>
          <div className=" py-2">
            <div className="flex gap-4">
              {parceiro.banners.map((b) => (
                <BannerCard
                  key={b.id}
                  banner={b}
                  onEdit={(banner) => setBannerEdit(banner)}
                  onRemove={() => remove.mutateAsync(b.id)}
                />
              ))}
            </div>
            <div className="mt-4  flex justify-end gap-2 bg-background">

              <Button
              variant={"outline"}
                onClick={() => {
                  setBannerEdit(null);
                  setOpenAdicionar(true);
                }}
              >
                Adicionar banner
              </Button>
            </div>
          </div>

          {/* CUPONS */}
          <h3 className="text-sm font-semibold mt-4">Cupons</h3>
          <div className="grid gap-2">
            {parceiro.cupons.map((c: CupomParceiroOut) => (
              <div
                key={c.id}
                className="p-2 border rounded-md flex justify-between items-center"
              >
                <div>
                  <p className="text-sm font-medium">{c.codigo}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.descricao}
                  </p>
                  {c.monetizado && (
                    <p className="text-xs text-green-600">
                      💰 R$ {c.valor_por_lead?.toFixed(2)} por lead
                    </p>
                  )}
                  {c.links?.length > 0 && (
                    <div className="mt-1 space-y-1">
                      {c.links.map((l) => (
                        <a
                          key={l.id}
                          href={l.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-600 underline"
                        >
                          {l.titulo}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    c.ativo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {c.ativo ? "Ativo" : "Inativo"}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full text-end">
            <Button variant="destructive" className="w-20 " onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
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
