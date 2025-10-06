"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@supervisor/components/ui/dialog";
import { Button } from "@supervisor/components/ui/button";
import { Input } from "@supervisor/components/ui/input";
import { Label } from "@supervisor/components/ui/label";
import { MapPin, Save, X } from "lucide-react";
import EnderecoSearchInput from "@supervisor/components/shared/endereco/EnderecoSearchInput";
import { EnderecoSuggestion } from "@supervisor/types/configuracoes/regiaoEntrega";
import { Endereco } from "@supervisor/types/pedido";

interface EnderecoEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  endereco: Endereco | null;
  onSave: (endereco: Endereco) => void;
  isSaving?: boolean;
  isNewAddress?: boolean;
  clienteId?: number;
}

export function EnderecoEditModal({
  open,
  onOpenChange,
  endereco,
  onSave,
  isSaving = false,
  isNewAddress = false,
  clienteId
}: EnderecoEditModalProps) {
  const [formData, setFormData] = useState<Endereco>({
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    ponto_referencia: "",
    latitude: undefined,
    longitude: undefined,
    is_principal: false,
    id: undefined,
    endereco_formatado: "",
    rua: "",
    codigo_estado: "",
    distrito: "",
    pais: ""
  });

  const [searchValue, setSearchValue] = useState("");

  // Inicializar dados quando modal abre
  useEffect(() => {
    if (open && endereco) {
      setFormData(endereco);
      setSearchValue(endereco.endereco_formatado || "");
    } else if (open) {
      // Reset para novo endereço
      setFormData({
        cep: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        ponto_referencia: "",
        latitude: undefined,
        longitude: undefined,
        is_principal: false,
        id: undefined,
        endereco_formatado: "",
        rua: "",
        codigo_estado: "",
        distrito: "",
        pais: ""
      });
      setSearchValue("");
    }
  }, [open, endereco]);

  // Função para quando um endereço é selecionado na busca
  const handleEnderecoSelected = (suggestion: EnderecoSuggestion) => {
    setFormData(prev => ({
      ...prev,
      cep: suggestion.cep || "",
      logradouro: suggestion.display.split(',')[0] || "",
      bairro: suggestion.bairro || "",
      cidade: suggestion.cidade || "",
      estado: suggestion.uf || "",
      codigo_estado: suggestion.uf || "",
      endereco_formatado: suggestion.display,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
      rua: suggestion.display.split(',')[0] || ""
    }));
    setSearchValue(suggestion.display);
  };

  // Função para salvar
  const handleSave = () => {
    onSave(formData);
  };

  // Função para cancelar
  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            {isNewAddress ? "Adicionar Novo Endereço" : "Editar Endereço de Entrega"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Busca de Endereço */}
          <div className="space-y-4">
            <EnderecoSearchInput
              label="Buscar Endereço"
              placeholder="Digite CEP ou endereço (ex: 01000-000 ou Rua Augusta, São Paulo)"
              value={searchValue}
              onEnderecoSelected={handleEnderecoSelected}
              onInputChange={setSearchValue}
              required
            />
          </div>

          {/* Campos do Endereço */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CEP */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">CEP</Label>
              <Input
                value={formData.cep || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, cep: e.target.value }))}
                placeholder="00000-000"
                className="bg-white"
              />
            </div>

            {/* Logradouro */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Logradouro</Label>
              <Input
                value={formData.logradouro || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, logradouro: e.target.value }))}
                placeholder="Rua, Avenida, etc."
                className="bg-white"
              />
            </div>

            {/* Número */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Número</Label>
              <Input
                value={formData.numero || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, numero: e.target.value }))}
                placeholder="123"
                className="bg-white"
              />
            </div>

            {/* Complemento */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Complemento</Label>
              <Input
                value={formData.complemento || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, complemento: e.target.value }))}
                placeholder="Apto 101, Bloco A, etc."
                className="bg-white"
              />
            </div>

            {/* Bairro */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Bairro</Label>
              <Input
                value={formData.bairro || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, bairro: e.target.value }))}
                placeholder="Centro, Vila, etc."
                className="bg-white"
              />
            </div>

            {/* Cidade */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Cidade</Label>
              <Input
                value={formData.cidade || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, cidade: e.target.value }))}
                placeholder="São Paulo"
                className="bg-white"
              />
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Estado</Label>
              <Input
                value={formData.estado || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
                placeholder="SP"
                className="bg-white"
              />
            </div>

            {/* Ponto de Referência */}
            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-medium">Ponto de Referência</Label>
              <Input
                value={formData.ponto_referencia || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, ponto_referencia: e.target.value }))}
                placeholder="Próximo ao shopping, em frente ao banco, etc."
                className="bg-white"
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Salvando..." : (isNewAddress ? "Criar Endereço" : "Salvar Endereço")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
