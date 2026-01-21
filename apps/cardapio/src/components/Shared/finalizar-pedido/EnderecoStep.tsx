"use client";

import { useState, useEffect } from "react";
import { Button } from "@cardapio/components/Shared/ui/button";
import { Label } from "@cardapio/components/Shared/ui/label";
import { Input } from "@cardapio/components/Shared/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@cardapio/components/Shared/ui/dialog";
import { Pen, Trash2, Plus, MapPin, Check } from "lucide-react";
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
  const [showSearchOnly, setShowSearchOnly] = useState(false); // Controla se mostra apenas pesquisa ou formulário
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
    setShowSearchOnly(false); // Ao editar, mostra formulário direto
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
    setShowSearchOnly(true); // Ao adicionar novo, mostra apenas pesquisa
    setOpen(true);
  };

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleSelectAddress = (selectedAddress: EnderecoSearchResult) => {
    // Preencher automaticamente TODOS os campos possíveis do endereço selecionado
    setNovo({
      logradouro: selectedAddress.logradouro || "",
      numero: selectedAddress.numero || novo.numero || "", // Manter número se já estava preenchido
      complemento: novo.complemento || "", // Manter complemento se já estava preenchido
      bairro: selectedAddress.bairro || "",
      distrito: selectedAddress.distrito || "",
      cidade: selectedAddress.cidade || "",
      estado: selectedAddress.estado || selectedAddress.codigo_estado || "",
      codigo_estado: selectedAddress.codigo_estado || selectedAddress.estado || "",
      cep: selectedAddress.cep || "",
      pais: selectedAddress.pais || "Brasil", // Default para Brasil
      latitude: selectedAddress.latitude || 0,
      longitude: selectedAddress.longitude || 0,
      ponto_referencia: novo.ponto_referencia || "" // Manter ponto de referência se já estava preenchido
    });
    // Manter o endereço formatado no campo de pesquisa
    setSearchAddress(selectedAddress.endereco_formatado || "");
    // Ocultar pesquisa e mostrar formulário
    setShowSearchOnly(false);
  };

  const handleSearchChange = (value: string) => {
    setSearchAddress(value);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!novo.logradouro?.trim()) {
      errors.logradouro = "Rua/Logradouro é obrigatório";
    }
    
    if (!novo.numero?.trim()) {
      errors.numero = "Número é obrigatório";
    }
    
    if (!novo.bairro?.trim()) {
      errors.bairro = "Bairro é obrigatório";
    }
    
    if (!novo.cidade?.trim()) {
      errors.cidade = "Cidade é obrigatória";
    }
    
    if (!novo.estado?.trim() && !novo.codigo_estado?.trim()) {
      errors.estado = "Estado/UF é obrigatório";
    }
    
    if (novo.cep && !/^\d{5}-?\d{3}$/.test(novo.cep.replace(/\D/g, ""))) {
      errors.cep = "CEP deve ter 8 dígitos (formato: 00000-000)";
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
    setShowSearchOnly(false);
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

        {/* Botão para adiciona novo */}
        <Button
          onClick={startAddNew}
          variant="default"
          className="h-10"
        >
          <Plus className="h-5 w-5" />
          <span>Adicionar Novo Endereço</span>
        </Button>
      </div>

      {/* Modal */}
      <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          // Resetar estado quando fechar
          setShowSearchOnly(editingId === null);
          setSearchAddress("");
        }
      }}>
        <DialogContent className="!max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">
              {editingId !== null 
                ? "Editar Endereço" 
                : showSearchOnly 
                  ? "Pesquisar Endereço" 
                  : "Confirmar Endereço"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {editingId !== null 
                ? "Pesquise e selecione um endereço ou edite manualmente os campos abaixo"
                : showSearchOnly
                  ? "Pesquise seu endereço digitando a rua ou CEP"
                  : "Confira os dados do endereço selecionado e complete as informações necessárias"}
            </p>
          </DialogHeader>

          <div className="space-y-4">
            {/* Busca de Endereço - Mostrar apenas quando showSearchOnly for true OU quando estiver editando */}
            {(showSearchOnly || editingId !== null) && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Pesquisar Endereço
                  <span className="text-xs font-normal text-muted-foreground">(Rua ou CEP)</span>
                </Label>
                <SearchEndereco
                  value={searchAddress}
                  onValueChange={handleSearchChange}
                  onAddressSelect={handleSelectAddress}
                  placeholder="Ex: Rua das Flores ou 01310-100"
                />
                {(validationErrors.logradouro || validationErrors.numero || validationErrors.bairro || validationErrors.cidade || validationErrors.estado) && (
                  <div className="space-y-1">
                    {validationErrors.logradouro && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <span>⚠️</span> {validationErrors.logradouro}
                      </p>
                    )}
                    {validationErrors.numero && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <span>⚠️</span> {validationErrors.numero}
                      </p>
                    )}
                    {validationErrors.bairro && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <span>⚠️</span> {validationErrors.bairro}
                      </p>
                    )}
                    {validationErrors.cidade && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <span>⚠️</span> {validationErrors.cidade}
                      </p>
                    )}
                    {validationErrors.estado && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <span>⚠️</span> {validationErrors.estado}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Campos Essenciais - Mostrar quando não estiver apenas pesquisando OU quando estiver editando */}
            {(!showSearchOnly || editingId !== null) && (
              <div className="space-y-3 border-t pt-4">
              <Label className="text-sm font-semibold">Informações do Endereço</Label>
              
              {/* Linha 1: Logradouro e Número */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="endereco_logradouro" className="text-sm">
                      Rua/Logradouro <span className="text-red-500">*</span>
                    </Label>
                    {!!searchAddress && !!novo.logradouro && (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Preenchido automaticamente
                      </span>
                    )}
                  </div>
                  <Input
                    id="endereco_logradouro"
                    value={novo.logradouro || ""}
                    onChange={(e) => setNovo({ ...novo, logradouro: e.target.value })}
                    className={`h-10 text-sm ${
                      !!searchAddress && !!novo.logradouro ? "bg-green-50 border-green-200" : ""
                    }`}
                    autoComplete="address-line1"
                    placeholder="Ex: Rua das Flores"
                    readOnly={!!searchAddress && !!novo.logradouro} // Readonly se foi preenchido pela busca
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="endereco_numero" className="text-sm font-semibold text-amber-600">
                    Número <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="endereco_numero"
                    value={novo.numero || ""}
                    onChange={(e) => setNovo({ ...novo, numero: e.target.value })}
                    className={`h-10 text-sm border-2 font-medium ${
                      validationErrors.numero 
                        ? "border-red-300 focus:border-red-500" 
                        : "border-amber-200 focus:border-amber-400"
                    }`}
                    autoComplete="off"
                    placeholder="Ex: 123"
                    required
                  />
                  {validationErrors.numero && (
                    <p className="text-red-500 text-xs">{validationErrors.numero}</p>
                  )}
                </div>
              </div>

              {/* Linha 2: Complemento */}
              <div className="space-y-1">
                <Label htmlFor="endereco_complemento" className="text-sm text-muted-foreground">
                  Complemento <span className="text-xs">(opcional)</span>
                </Label>
                <Input
                  id="endereco_complemento"
                  value={novo.complemento || ""}
                  onChange={(e) => setNovo({ ...novo, complemento: e.target.value })}
                  className="h-10 text-sm"
                  autoComplete="address-line2"
                  placeholder="Ex: Apto 101, Bloco B, etc."
                />
              </div>

              {/* Linha 3: Bairro e CEP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="endereco_bairro" className="text-sm">
                      Bairro <span className="text-red-500">*</span>
                    </Label>
                    {!!searchAddress && !!novo.bairro && (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Preenchido
                      </span>
                    )}
                  </div>
                  <Input
                    id="endereco_bairro"
                    value={novo.bairro || ""}
                    onChange={(e) => setNovo({ ...novo, bairro: e.target.value })}
                    className={`h-10 text-sm ${
                      validationErrors.bairro 
                        ? "border-red-300 focus:border-red-500" 
                        : (!!searchAddress && !!novo.bairro ? "bg-green-50 border-green-200" : "")
                    }`}
                    autoComplete="address-level2"
                    placeholder="Ex: Centro"
                    readOnly={!!searchAddress && !!novo.bairro}
                  />
                  {validationErrors.bairro && (
                    <p className="text-red-500 text-xs">{validationErrors.bairro}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="endereco_cep" className="text-sm">
                      CEP
                    </Label>
                    {!!searchAddress && !!novo.cep && (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Preenchido
                      </span>
                    )}
                  </div>
                  <Input
                    id="endereco_cep"
                    value={novo.cep || ""}
                    onChange={(e) => setNovo({ ...novo, cep: e.target.value })}
                    className={`h-10 text-sm ${
                      !!searchAddress && !!novo.cep ? "bg-green-50 border-green-200" : ""
                    }`}
                    autoComplete="postal-code"
                    placeholder="00000-000"
                    readOnly={!!searchAddress && !!novo.cep}
                  />
                </div>
              </div>

              {/* Linha 4: Cidade e Estado */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="endereco_cidade" className="text-sm">
                      Cidade <span className="text-red-500">*</span>
                    </Label>
                    {!!searchAddress && !!novo.cidade && (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Preenchido
                      </span>
                    )}
                  </div>
                  <Input
                    id="endereco_cidade"
                    value={novo.cidade || ""}
                    onChange={(e) => setNovo({ ...novo, cidade: e.target.value })}
                    className={`h-10 text-sm ${
                      validationErrors.cidade 
                        ? "border-red-300 focus:border-red-500" 
                        : (!!searchAddress && !!novo.cidade ? "bg-green-50 border-green-200" : "")
                    }`}
                    autoComplete="address-level1"
                    placeholder="Ex: São Paulo"
                    readOnly={!!searchAddress && !!novo.cidade}
                  />
                  {validationErrors.cidade && (
                    <p className="text-red-500 text-xs">{validationErrors.cidade}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="endereco_estado" className="text-sm">
                      Estado/UF <span className="text-red-500">*</span>
                    </Label>
                    {!!searchAddress && (!!novo.codigo_estado || !!novo.estado) && (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Preenchido
                      </span>
                    )}
                  </div>
                  <Input
                    id="endereco_estado"
                    value={novo.codigo_estado || novo.estado || ""}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase().slice(0, 2);
                      setNovo({ ...novo, codigo_estado: value, estado: value });
                    }}
                    className={`h-10 text-sm font-medium ${
                      validationErrors.estado 
                        ? "border-red-300 focus:border-red-500" 
                        : (!!searchAddress && (!!novo.codigo_estado || !!novo.estado) ? "bg-green-50 border-green-200" : "")
                    }`}
                    autoComplete="off"
                    placeholder="SP"
                    maxLength={2}
                    readOnly={!!searchAddress && (!!novo.codigo_estado || !!novo.estado)}
                  />
                  {validationErrors.estado && (
                    <p className="text-red-500 text-xs">{validationErrors.estado}</p>
                  )}
                </div>
              </div>

              {/* Campos Ocultos por padrão - Expandir se necessário */}
              <details className="border rounded-md p-2">
                <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                  Campos adicionais (opcional)
                </summary>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t">
                  <div className="space-y-1">
                    <Label htmlFor="endereco_distrito" className="text-xs text-muted-foreground">Distrito</Label>
                    <Input
                      id="endereco_distrito"
                      value={novo.distrito || ""}
                      onChange={(e) => setNovo({ ...novo, distrito: e.target.value })}
                      className="h-9 text-sm"
                      autoComplete="off"
                      disabled={!!searchAddress && !!novo.distrito}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="endereco_pais" className="text-xs text-muted-foreground">País</Label>
                    <Input
                      id="endereco_pais"
                      value={novo.pais || "Brasil"}
                      onChange={(e) => setNovo({ ...novo, pais: e.target.value })}
                      className="h-9 text-sm"
                      autoComplete="country"
                      disabled={!!searchAddress && !!novo.pais}
                    />
                  </div>
                </div>
              </details>
              </div>
            )}

            {/* Botão para voltar à pesquisa (quando não está apenas pesquisando e não está editando) */}
            {!showSearchOnly && editingId === null && (
              <div className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowSearchOnly(true);
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
                  }}
                  className="w-full text-xs"
                >
                  ← Pesquisar outro endereço
                </Button>
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-6 pt-4 border-t">
            {/* Mostrar botão de salvar apenas quando não estiver apenas pesquisando OU quando estiver editando */}
            {(!showSearchOnly || editingId !== null) && (
              <Button 
                onClick={handleSave} 
                className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                disabled={!novo.logradouro || !novo.numero || !novo.cidade || !novo.estado}
              >
                {editingId !== null ? "Salvar Alterações" : "Confirmar e Cadastrar"}
              </Button>
            )}
            <Button 
              variant="secondary" 
              onClick={() => {
                setOpen(false);
                setShowSearchOnly(editingId === null);
                setSearchAddress("");
              }} 
              className="w-full sm:w-auto"
            >
              {showSearchOnly ? "Cancelar" : "Fechar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
