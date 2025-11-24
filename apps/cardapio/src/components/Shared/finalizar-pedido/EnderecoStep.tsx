"use client";

import { useState, useEffect } from "react";
import { Button } from "@cardapio/components/Shared/ui/button";
import { Label } from "@cardapio/components/Shared/ui/label";
import { Input } from "@cardapio/components/Shared/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@cardapio/components/Shared/ui/dialog";
import { Pen, Trash2, Plus, MapPin } from "lucide-react";
import { SearchEndereco } from "@cardapio/components/Shared/SearchEndereco";
import type { EnderecoSearchResult } from "@cardapio/services/enderecos/useQueryEndereco";

interface Endereco {
  id: number;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  complemento?: string;
  distrito?: string;
  codigo_estado?: string;
  pais?: string;
  latitude?: number;
  longitude?: number;
  ponto_referencia?: string;
}

interface EnderecoCreate {
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  complemento?: string;
  distrito?: string;
  codigo_estado?: string;
  pais?: string;
  latitude?: number;
  longitude?: number;
  ponto_referencia?: string;
}

interface EnderecoStepProps {
  enderecos: Endereco[];
  enderecoId: number | null;
  onSelect: (id: number) => void;
  onAdd: (novo: EnderecoCreate) => void;
  onUpdate: (atualizado: Endereco) => void;
  onDelete: (id: number) => void;
}

export default function EnderecoStep({ enderecos, enderecoId, onSelect, onAdd, onUpdate, onDelete }: EnderecoStepProps) {
  const [selected, setSelected] = useState<number | null>(enderecoId ?? null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [novo, setNovo] = useState({ 
    logradouro: "", 
    numero: "", 
    bairro: "", 
    cidade: "", 
    estado: "", 
    cep: "",
    complemento: "",
    distrito: "",
    codigo_estado: "",
    pais: "",
    latitude: 0,
    longitude: 0,
    ponto_referencia: ""
  });
  const [open, setOpen] = useState(false);
  const [searchAddress, setSearchAddress] = useState("");
  useEffect(() => setSelected(enderecoId ?? null), [enderecoId]);

  const startEdit = (e: Endereco) => {
    setEditingId(e.id);
    setNovo({
      logradouro: e.logradouro || "",
      numero: e.numero ,
      bairro: e.bairro || "",
      cidade: e.cidade || "",
      estado: e.estado || "",
      cep: e.cep || "",
      complemento: e.complemento || "",
      distrito: e.distrito || "",
      codigo_estado: e.codigo_estado || "",
      pais: e.pais || "",
      latitude: e.latitude || 0,
      longitude: e.longitude || 0,
      ponto_referencia: e.ponto_referencia || ""
    });
    setSearchAddress("");
    setOpen(true);
  };

  const startAddNew = () => {
    setEditingId(null);
    setNovo({ 
      logradouro: "", 
      numero: "", 
      bairro: "", 
      cidade: "", 
      estado: "", 
      cep: "",
      complemento: "",
      distrito: "",
      codigo_estado: "",
      pais: "",
      latitude: 0,
      longitude: 0,
      ponto_referencia: ""
    });
    setSearchAddress("");
    setOpen(true);
  };

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleSelectAddress = (selectedAddress: EnderecoSearchResult) => {
    setNovo({
      ...novo,
      logradouro: selectedAddress.logradouro || "",
      numero: selectedAddress.numero || novo.numero || "",
      complemento: novo.complemento || "", // EnderecoSearchResult não tem complemento
      bairro: selectedAddress.bairro || "",
      distrito: selectedAddress.distrito || "",
      cidade: selectedAddress.cidade || "",
      estado: selectedAddress.codigo_estado || selectedAddress.estado || "",
      codigo_estado: selectedAddress.codigo_estado || "",
      cep: selectedAddress.cep || "",
      pais: selectedAddress.pais || "",
      latitude: selectedAddress.latitude || 0,
      longitude: selectedAddress.longitude || 0,
      ponto_referencia: "" // EnderecoSearchResult não tem ponto_referencia
    });
    // Manter o endereço formatado no campo de pesquisa
    setSearchAddress(selectedAddress.endereco_formatado || "");
  };

  const handleSearchChange = (value: string) => {
    setSearchAddress(value);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!novo.logradouro.trim()) {
      errors.logradouro = "Rua é obrigatória";
    }
    
    if (!novo.cidade.trim()) {
      errors.cidade = "Cidade é obrigatória";
    }
    
    if (!novo.estado.trim()) {
      errors.estado = "Estado é obrigatório";
    }
    
    if (novo.cep && !/^\d{5}-?\d{3}$/.test(novo.cep.replace(/\D/g, ""))) {
      errors.cep = "CEP deve ter 8 dígitos";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    
    if (editingId !== null) onUpdate({ id: editingId, ...novo });
    else onAdd(novo);

    setEditingId(null);
    setNovo({ 
      logradouro: "", 
      numero: "", 
      bairro: "", 
      cidade: "", 
      estado: "", 
      cep: "",
      complemento: "",
      distrito: "",
      codigo_estado: "",
      pais: "",
      latitude: 0,
      longitude: 0,
      ponto_referencia: ""
    });
    setSearchAddress("");
    setValidationErrors({});
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold">Escolha o Endereço</h2>

      <div className="grid gap-3">
        {enderecos.map((e: Endereco) => {
          const isSelected = selected === e.id;
          return (
            <div
              key={e.id}
              role="button"
              tabIndex={0}
              onClick={() => {
                setSelected(e.id);
                onSelect(e.id);
              }}
              className={`relative rounded-xl border p-3 sm:p-4 cursor-pointer transition
                ${isSelected ? "border-primary ring-2 ring-primary/30 bg-primary/5" : "border-muted hover:bg-muted/30"}
              `}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col">
                  <span className="font-medium text-sm sm:text-base">
                    {e.logradouro}, {e.numero}
                  </span>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    • {e.bairro} - {e.cidade}/{e.estado}
                  </span>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                      • {e.cep}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      startEdit(e);
                    }}
                  >
                    <Pen className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Editar</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      onDelete(e.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Excluir</span>
                  </Button>
                </div>
              </div>
              {isSelected && (
                <span className="absolute bottom-2 right-2 text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                  Selecionado
                </span>
              )}
            </div>
          );
        })}

        {/* Card para adicionar novo */}
        <div
          role="button"
          tabIndex={0}
          onClick={startAddNew}
          className="w-full rounded-xl border-2 border-dashed border-muted-foreground/60 flex items-center justify-center gap-2 py-4"
        >
          <Plus className="h-5 w-5 text-muted-foreground/60" />
          <span className="text-muted-foreground/60">Adicionar Novo Endereço</span>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="!max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">{editingId !== null ? "Editar Endereço" : "Novo Endereço"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Pesquisar Endereço (Rua ou CEP) *
              </Label>
              <SearchEndereco
                value={searchAddress}
                onValueChange={handleSearchChange}
                onAddressSelect={handleSelectAddress}
                placeholder="Digite a rua ou CEP"
              />
              {validationErrors.logradouro && (
                <p className="text-red-500 text-xs">{validationErrors.logradouro}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Detalhes do Endereço</Label>
              <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor="endereco_logradouro" className="text-sm font-medium">Logradouro</Label>
                        <Input
                          id="endereco_logradouro"
                          value={novo.logradouro || ""}
                          onChange={(e) => setNovo({ ...novo, logradouro: e.target.value })}
                          className="bg-white h-8 text-sm"
                          autoComplete="off"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="endereco_numero" className="text-sm font-medium text-yellow-600">Número *</Label>
                        <Input
                          id="endereco_numero"
                          value={novo.numero || ""}
                          onChange={(e) => setNovo({ ...novo, numero: e.target.value })}
                          className="bg-white h-8 text-sm border-2 border-yellow-200 focus:border-yellow-400"
                          autoComplete="off"
                          placeholder="Ex.: 123"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="endereco_complemento" className="text-sm font-medium text-gray-500">Complemento (opcional)</Label>
                        <Input
                          id="endereco_complemento"
                          value={novo.complemento || ""}
                          onChange={(e) => setNovo({ ...novo, complemento: e.target.value })}
                          className="bg-white h-8 text-sm border-2 border-gray-200 focus:border-gray-400"
                          autoComplete="off"
                          placeholder="Ex.: Apto 101"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="endereco_bairro" className="text-sm font-medium">Bairro</Label>
                        <Input
                          id="endereco_bairro"
                          value={novo.bairro || ""}
                          onChange={(e) => setNovo({ ...novo, bairro: e.target.value })}
                          className="bg-white h-8 text-sm"
                          autoComplete="off"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="endereco_distrito" className="text-sm font-medium text-gray-500">Distrito</Label>
                        <Input
                          id="endereco_distrito"
                          value={novo.distrito || ""}
                          onChange={(e) => setNovo({ ...novo, distrito: e.target.value })}
                          className="bg-white h-8 text-sm"
                          autoComplete="off"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="endereco_cidade" className="text-sm font-medium">Cidade</Label>
                        <Input
                          id="endereco_cidade"
                          value={novo.cidade || ""}
                          onChange={(e) => setNovo({ ...novo, cidade: e.target.value })}
                          className="bg-white h-8 text-sm"
                          autoComplete="off"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="endereco_estado" className="text-sm font-medium">Estado</Label>
                        <Input
                          id="endereco_estado"
                          value={novo.estado || ""}
                          onChange={(e) => setNovo({ ...novo, estado: e.target.value })}
                          className="bg-white h-8 text-sm"
                          autoComplete="off"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="endereco_codigo_estado" className="text-sm font-medium text-gray-500">UF</Label>
                        <Input
                          id="endereco_codigo_estado"
                          value={novo.codigo_estado || ""}
                          onChange={(e) => setNovo({ ...novo, codigo_estado: e.target.value })}
                          className="bg-white h-8 text-sm"
                          autoComplete="off"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="endereco_cep" className="text-sm font-medium">CEP</Label>
                        <Input
                          id="endereco_cep"
                          value={novo.cep || ""}
                          onChange={(e) => setNovo({ ...novo, cep: e.target.value })}
                          className="bg-white h-8 text-sm"
                          autoComplete="off"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="endereco_pais" className="text-sm font-medium text-gray-500">País</Label>
                        <Input
                          id="endereco_pais"
                          value={novo.pais || ""}
                          onChange={(e) => setNovo({ ...novo, pais: e.target.value })}
                          className="bg-white h-8 text-sm"
                          autoComplete="off"
                        />
                      </div>
                    </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button onClick={handleSave} className="w-full sm:w-auto">
              {editingId !== null ? "Salvar" : "Adicionar"}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto">
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
