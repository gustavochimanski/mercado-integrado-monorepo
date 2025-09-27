"use client";

import React from "react";
import { Card, CardContent } from "@cardapio/components/Shared/ui/card";
import { Button } from "@cardapio/components/Shared/ui/button";
import { Separator } from "@cardapio/components/Shared/ui/separator";
import {
  User,
  MapPin,
  ClipboardList,
  LogOut,
  Gift
} from "lucide-react";
import Link from "next/link";
import { getCliente, clearCliente } from "@cardapio/stores/client/ClientStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function MenuLogado() {
  const cliente = getCliente();
  const router = useRouter();

  const handleLogout = () => {
    clearCliente();
    toast.success("Logout realizado com sucesso!");
    router.push("/");
    // Força reload para limpar todos os estados
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header com perfil do usuário */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">
                {cliente.nome || "Cliente"}
              </h2>
              <p className="text-muted-foreground">
                {cliente.telefone || "Telefone não informado"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Menu principal */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Minha conta</h3>

        <Card>
          <CardContent className="p-0">
            <Link
              href="/perfil/editar"
              className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Meus dados</p>
                  <p className="text-sm text-muted-foreground">Nome, telefone, email</p>
                </div>
              </div>
            </Link>

            <Separator />

            <Link
              href="/enderecos"
              className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Endereços</p>
                  <p className="text-sm text-muted-foreground">Gerenciar endereços de entrega</p>
                </div>
              </div>
            </Link>

            <Separator />

            <Link
              href="/pedidos"
              className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium">Meus pedidos</p>
                  <p className="text-sm text-muted-foreground">Histórico de pedidos</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Outras opções */}
        <h3 className="font-semibold text-lg">Mais opções</h3>

        <Card>
          <CardContent className="p-0">
            <Link
              href="/promocoes"
              className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Gift className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">Promoções</p>
                  <p className="text-sm text-muted-foreground">Ofertas especiais</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Botão de logout */}
        <Card>
          <CardContent className="p-4">
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair da conta
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}