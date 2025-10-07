"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@supervisor/components/ui/dialog";
import { Button } from "@supervisor/components/ui/button";
import { Input } from "@supervisor/components/ui/input";
import { Checkbox } from "@supervisor/components/ui/checkbox";
import { Switch } from "@supervisor/components/ui/switch";
import { Label } from "@supervisor/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@supervisor/components/ui/select";

import { useMutateCupom, Cupom, generateCupomLink } from "@supervisor/services/useQueryCupons";
import { useCardapiosEmpresas } from "@supervisor/services/useQueryCardapios";
import { useEmpresas } from "@supervisor/services/useQueryEmpresasMensura";
import { useCardapioByEmpresaId } from "@supervisor/services/useQueryCardapios";
import { useToast } from "@supervisor/hooks/use-toast";
import QRCodeGenerator from "@supervisor/components/shared/QRCodeGenerator";

interface EditarCupomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cupom: Cupom;
  onSaved?: () => void;
}

export default function EditarCupomModal({ open, onOpenChange, cupom, onSaved }: EditarCupomModalProps) {
  const { update } = useMutateCupom();
  const { data: cardapiosEmpresas = [], isLoading: cardapiosLoading, error: cardapiosError } = useCardapiosEmpresas(open);
  const { data: empresas = [], isLoading: empresasLoading } = useEmpresas();
  const { toast } = useToast();

  // --- estado do cupom ---
  const [codigo, setCodigo] = useState(cupom.codigo);
  const [descricao, setDescricao] = useState(cupom.descricao || "");
  const [descontoValor, setDescontoValor] = useState<number | undefined>(cupom.desconto_valor);
  const [descontoPercentual, setDescontoPercentual] = useState<number | undefined>(cupom.desconto_percentual);
  const [ativo, setAtivo] = useState(cupom.ativo);
  const [monetizado, setMonetizado] = useState(cupom.monetizado);
  const [valorPorLead, setValorPorLead] = useState<number | undefined>(cupom.valor_por_lead);
  const [parceiroId, setParceiroId] = useState<number | undefined>(cupom.parceiro_id);
  const [empresaIds, setEmpresaIds] = useState<number[]>(cupom.empresa_ids || []);
  const [linkRedirecionamento, setLinkRedirecionamento] = useState<string>(cupom.link_redirecionamento || "");

  // Debug: Log do estado empresaIds sempre que mudar
  useEffect(() => {
    console.log("empresaIds atualizado (editar):", empresaIds);
  }, [empresaIds]);
  

  useEffect(() => {
    if (cupom) {
      setCodigo(cupom.codigo);
      setDescricao(cupom.descricao || "");
      setDescontoValor(cupom.desconto_valor);
      setDescontoPercentual(cupom.desconto_percentual);
      setAtivo(cupom.ativo);
      setMonetizado(cupom.monetizado);
      setValorPorLead(cupom.valor_por_lead);
      setParceiroId(cupom.parceiro_id);
      
      // Mapear empresa_ids a partir do array empresas retornado pela API
      let empresaIdsFromApi: number[] = [];
      if (cupom.empresa_ids && cupom.empresa_ids.length > 0) {
        // Se já tem empresa_ids, usa eles
        empresaIdsFromApi = cupom.empresa_ids;
      } else if (cupom.empresas && cupom.empresas.length > 0) {
        // Se não tem empresa_ids mas tem empresas, extrai os IDs
        empresaIdsFromApi = cupom.empresas.map(empresa => empresa.id);
      }
      
      console.log("Mapeando empresa_ids para edição:", {
        empresa_ids_original: cupom.empresa_ids,
        empresas_from_api: cupom.empresas,
        empresa_ids_final: empresaIdsFromApi
      });
      
      setEmpresaIds(empresaIdsFromApi);
      setLinkRedirecionamento(cupom.link_redirecionamento || "");
    }
  }, [cupom]);

  // Função para gerenciar switches das empresas participantes
  const handleEmpresaParticipanteChange = (empresaId: number, checked: boolean) => {
    console.log("handleEmpresaParticipanteChange:", { empresaId, checked });
    
    setEmpresaIds(prev => {
      let newIds: number[];
      
      if (checked) {
        // Adiciona empresa se não estiver já selecionada
        if (!prev.includes(empresaId)) {
          newIds = [...prev, empresaId];
          console.log("Adicionando empresa, novo array:", newIds);
        } else {
          newIds = prev; // Já está selecionada, mantém o array
          console.log("Empresa já selecionada, mantendo array:", newIds);
        }
      } else {
        // Remove empresa
        newIds = prev.filter(id => id !== empresaId);
        console.log("Removendo empresa, novo array:", newIds);
      }
      
      return newIds;
    });
  };

  // --- salvar cupom ---
  const handleSaveCupom = async () => {
    if (monetizado && !parceiroId) {
      alert("Selecione um parceiro para cupom monetizado.");
      return;
    }

    if (empresaIds.length === 0) {
      alert("Selecione pelo menos uma empresa para o cupom.");
      return;
    }

    try {
      console.log("Enviando dados para edição:", {
        id: cupom.id,
        codigo,
        descricao,
        desconto_valor: descontoValor,
        desconto_percentual: descontoPercentual,
        ativo,
        monetizado,
        valor_por_lead: valorPorLead,
        parceiro_id: parceiroId,
        empresa_ids: empresaIds,
        link_redirecionamento: linkRedirecionamento,
      });
      
      await update.mutateAsync({
        id: cupom.id,
        codigo,
        descricao,
        desconto_valor: descontoValor,
        desconto_percentual: descontoPercentual,
        ativo,
        monetizado,
        valor_por_lead: valorPorLead,
        parceiro_id: parceiroId,
        empresa_ids: empresaIds,
        link_redirecionamento: linkRedirecionamento,
      });

      if (onSaved) onSaved();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Cupom</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-2">
            {/* Campos do cupom */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Código</Label>
                <Input value={codigo} onChange={(e) => setCodigo(e.target.value)} />
              </div>
              <div>
                <Label>Descrição</Label>
                <Input value={descricao} onChange={(e) => setDescricao(e.target.value)} />
              </div>
              <div>
                <Label>Desconto Valor</Label>
                <Input type="number" value={descontoValor ?? ""} onChange={(e) => setDescontoValor(Number(e.target.value))} />
              </div>
              <div>
                <Label>Desconto Percentual</Label>
                <Input type="number" value={descontoPercentual ?? ""} onChange={(e) => setDescontoPercentual(Number(e.target.value))} />
              </div>
            </div>

            <div className="flex items-center gap-4 mt-2">
              <Checkbox checked={ativo} onCheckedChange={(checked) => setAtivo(!!checked)} />
              <label>Ativo</label>

              <Checkbox checked={monetizado} onCheckedChange={(checked) => setMonetizado(!!checked)} />
              <label>Monetizado</label>
            </div>

            <div className="mt-4">
              <Label className="text-base font-semibold">Empresas Participantes</Label>
              <p className="text-sm text-gray-600 mb-3">Selecione as empresas que participarão do cupom</p>
              
              {cardapiosLoading ? (
                <p>Carregando empresas...</p>
              ) : cardapiosError ? (
                <p className="text-red-500">Erro ao carregar empresas: {cardapiosError.message}</p>
              ) : cardapiosEmpresas.length === 0 ? (
                <p className="text-yellow-500">Nenhuma empresa encontrada</p>
              ) : (
                <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto border rounded-lg p-3">
                  {cardapiosEmpresas.map((empresa) => (
                    <div key={empresa.id} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Switch
                          id={`empresa-${empresa.id}`}
                          checked={empresaIds.includes(empresa.id)}
                          onCheckedChange={(checked) => {
                            console.log("Switch clicado (editar):", { empresaId: empresa.id, checked });
                            handleEmpresaParticipanteChange(empresa.id, !!checked);
                          }}
                        />
                        <label htmlFor={`empresa-${empresa.id}`} className="text-sm font-medium cursor-pointer flex-1">
                          {empresa.nome}
                        </label>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`text-xs px-2 py-1 rounded mb-1 ${
                          empresa.ativo 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {empresa.ativo ? 'Ativa' : 'Inativa'}
                        </span>
                        <span className="text-xs text-gray-500 truncate max-w-32">
                          {empresa.cardapio_link}
                        </span>
                </div>
                    </div>
                  ))}
                  </div>
              )}
              
              {empresaIds.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-blue-600 mb-2">
                    {empresaIds.length} empresa(s) selecionada(s)
                  </p>
                  
                  {/* QR Codes para empresas selecionadas */}
                  <div className="grid grid-cols-2 gap-4">
                    {empresaIds.map((empresaId) => {
                      const empresa = cardapiosEmpresas.find(e => e.id === empresaId);
                      if (!empresa) return null;
                      
                      return (
                        <div key={empresaId} className="border rounded-lg p-3 bg-gray-50">
                          <h4 className="text-sm font-medium mb-2">{empresa.nome}</h4>
                          <div className="flex justify-center">
                            <QRCodeGenerator 
                              cupom={{ codigo }} 
                              cardapioLink={empresa.cardapio_link}
                              size={100} 
                            />
                          </div>
                          <p className="text-xs text-gray-600 mt-1 text-center break-all">
                            {generateCupomLink(codigo, empresa.cardapio_link, empresaId)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {monetizado && (
              <div className="mt-4">
                <div className="mb-4">
                  <Label>Valor por Lead</Label>
                  <Input 
                    type="number" 
                    value={valorPorLead ?? ""} 
                    onChange={(e) => setValorPorLead(Number(e.target.value))} 
                    className="mt-1"
                  />
                </div>
                
                <div className="mb-4">
                  <Label>Link de Redirecionamento</Label>
                  <Input
                    value={linkRedirecionamento}
                    onChange={(e) => setLinkRedirecionamento(e.target.value)}
                    placeholder="https://exemplo.com/redirecionamento"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label className="text-base font-semibold">Empresas Participantes</Label>
                  <p className="text-sm text-gray-600 mb-3">Selecione as empresas que participarão do cupom monetizado</p>
                  
                  {cardapiosLoading ? (
                    <p>Carregando empresas...</p>
                  ) : cardapiosError ? (
                    <p className="text-red-500">Erro ao carregar empresas: {cardapiosError.message}</p>
                  ) : cardapiosEmpresas.length === 0 ? (
                    <p className="text-yellow-500">Nenhuma empresa encontrada</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto border rounded-lg p-3">
                      {cardapiosEmpresas.map((empresa) => (
                        <div key={empresa.id} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id={`empresa-${empresa.id}`}
                              checked={empresaIds.includes(empresa.id)}
                              onCheckedChange={(checked) => handleEmpresaParticipanteChange(empresa.id, !!checked)}
                            />
                            <label htmlFor={`empresa-${empresa.id}`} className="text-sm font-medium cursor-pointer">
                              {empresa.nome}
                            </label>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className={`text-xs px-2 py-1 rounded mb-1 ${
                              empresa.ativo 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {empresa.ativo ? 'Ativa' : 'Inativa'}
                            </span>
                            <span className="text-xs text-gray-500 truncate max-w-32">
                              {empresa.cardapio_link}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {empresaIds.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-blue-600 mb-2">
                        {empresaIds.length} empresa(s) selecionada(s)
                      </p>
                      
                      {/* QR Codes para empresas selecionadas */}
                      <div className="grid grid-cols-2 gap-4">
                        {empresaIds.map((empresaId) => {
                          const empresa = cardapiosEmpresas.find(e => e.id === empresaId);
                          if (!empresa) return null;
                          
                          return (
                            <div key={empresaId} className="border rounded-lg p-3 bg-gray-50">
                              <h4 className="text-sm font-medium mb-2">{empresa.nome}</h4>
                              <div className="flex justify-center">
                                <QRCodeGenerator 
                                  cupom={{ codigo }} 
                                  cardapioLink={empresa.cardapio_link}
                                  size={100} 
                                />
                              </div>
                              <p className="text-xs text-gray-600 mt-1 text-center break-all">
                                {generateCupomLink(codigo, empresa.cardapio_link, empresaId)}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button onClick={handleSaveCupom}>Salvar alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </>
  );
}
