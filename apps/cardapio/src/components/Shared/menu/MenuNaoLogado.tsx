"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Card, CardContent } from "@cardapio/components/Shared/ui/card";
import { Button } from "@cardapio/components/Shared/ui/button";
import { UserPlus, LogIn } from "lucide-react";
import ClienteIdentificacaoModal from "@cardapio/components/Shared/finalizar-pedido/ClienteIdentificacaoModal";
import { useBuscarEmpresa } from "@cardapio/services/empresa";
import { getEmpresaId, getEmpresaData } from "@cardapio/stores/empresa/empresaStore";

export default function MenuNaoLogado() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(false); // true = login, false = cadastro
  const empresaId = getEmpresaId();

  // Buscar dados da empresa
  const { data: empresaData } = useBuscarEmpresa({
    empresaId: empresaId ?? undefined,
    enabled: !!empresaId,
  });

  // Fallback para dados do localStorage
  const empresaDataLocal = useMemo(() => {
    if (empresaData) return empresaData;
    return getEmpresaData();
  }, [empresaData]);

  // Normalizar URL do logo
  const logoUrl = useMemo(() => {
    if (empresaDataLocal?.logo) {
      const logo = empresaDataLocal.logo;
      return logo.startsWith('http://') || logo.startsWith('https://') 
        ? logo 
        : `https://${logo}`;
    }
    return "/logo.png"; // Fallback para logo padrão
  }, [empresaDataLocal?.logo]);

  const handleLoginSuccess = () => {
    window.location.reload();
  };

  const handleEntrarConta = () => {
    setIsLoginMode(true);
    setIsModalOpen(true);
  };

  const handleCriarConta = () => {
    setIsLoginMode(false);
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col justify-center p-6 pt-20">
      {/* Header com avatar e mensagem */}
      <Card className="mx-auto w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-white dark:bg-primary/10 border-2 border-primary/20 shadow-sm relative">
              <Image
                src={logoUrl}
                alt={empresaDataLocal?.nome || "Logo da empresa"}
                fill
                sizes="96px"
                className="object-cover"
                priority
                unoptimized={logoUrl.includes('mensuraapi.com.br')}
                onError={(e) => {
                  // Se a imagem falhar, usar logo padrão
                  const target = e.target as HTMLImageElement;
                  if (target.src !== window.location.origin + "/logo.png") {
                    target.src = "/logo.png";
                  }
                }}
              />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-3">Olá! Bem-vindo</h2>
          <p className="text-muted-foreground mb-8">
            Faça login ou cadastre-se para ter uma experiência personalizada
          </p>

          <div className="space-y-4">
            <Button
              onClick={handleEntrarConta}
              className="w-full h-12 cursor-pointer"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Entrar na minha conta
            </Button>

            <Button
              onClick={handleCriarConta}
              variant="outline"
              className="w-full h-12 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Criar conta
            </Button>
          </div>
        </CardContent>
      </Card>

      <ClienteIdentificacaoModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLoginSuccess}
        forceLoginMode={isLoginMode}
      />
    </div>
  );
}