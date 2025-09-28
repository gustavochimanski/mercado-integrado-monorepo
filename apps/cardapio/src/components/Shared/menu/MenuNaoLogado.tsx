"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@cardapio/components/Shared/ui/card";
import { Button } from "@cardapio/components/Shared/ui/button";
import { UserPlus, LogIn } from "lucide-react";
import ClienteIdentificacaoModal from "@cardapio/components/Shared/finalizar-pedido/ClienteIdentificacaoModal";

export default function MenuNaoLogado() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(false); // true = login, false = cadastro

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
          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
            <UserPlus className="w-8 h-8 text-gray-500" />
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