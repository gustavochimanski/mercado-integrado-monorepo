"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@supervisor/components/ui/button";
import { Plus } from "lucide-react";
import { BannerCard } from "./BannerCard";
import AdicionarBannerModal from "./AdcionarBannerModal";
import { ParceiroCompletoOut, BannerParceiroOut } from "@supervisor/services/useQueryParceiros";
import { useMutateBanner } from "@supervisor/services/useQueryBanners";
import apiMensura from "@supervisor/lib/api/apiMensura";

interface TabBannersProps {
  parceiro: ParceiroCompletoOut;
  onSaved: () => void;
}

export default function TabBanners({ parceiro, onSaved }: TabBannersProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [bannerEdit, setBannerEdit] = useState<BannerParceiroOut | null>(null);
  const { remove } = useMutateBanner();

  // Busca banners do parceiro
  const { data: banners = [], refetch: refetchBanners } = useQuery<BannerParceiroOut[]>({
    queryKey: ["banners-parceiro", parceiro.id],
    queryFn: async () => {
      const { data } = await apiMensura.get<BannerParceiroOut[]>("/api/delivery/public/banners", {
        params: { parceiro_id: parceiro.id },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const handleAddBanner = () => {
    setBannerEdit(null);
    setModalOpen(true);
  };

  const handleEditBanner = (banner: BannerParceiroOut) => {
    setBannerEdit(banner);
    setModalOpen(true);
  };

  const handleRemoveBanner = async (id: number) => {
    await remove.mutateAsync(id);
    refetchBanners();
  };

  const handleSaved = () => {
    refetchBanners();
    onSaved();
    setModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Botão Adicionar */}
      <div className="flex justify-end">
        <Button onClick={handleAddBanner} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Adicionar Banner
        </Button>
      </div>

      {/* Lista de Banners */}
      {banners && banners.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {banners.map((banner) => (
            <BannerCard
              key={banner.id}
              banner={banner}
              onEdit={handleEditBanner}
              onRemove={handleRemoveBanner}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
          <p className="text-muted-foreground mb-4">Nenhum banner cadastrado</p>
          <Button onClick={handleAddBanner} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Adicionar Primeiro Banner
          </Button>
        </div>
      )}

      {/* Modal de Adicionar/Editar Banner */}
      <AdicionarBannerModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        parceiro={parceiro}
        bannerEdit={bannerEdit}
        onSaved={handleSaved}
      />
    </div>
  );
}
