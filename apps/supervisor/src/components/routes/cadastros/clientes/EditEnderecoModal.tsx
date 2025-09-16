"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../ui/dialog"
import { Button } from "../../../ui/button"
import { Input } from "../../../ui/input"
import { Label } from "../../../ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/tabs"
import { SearchEndereco } from "../../../shared/SearchEndereco"
import type { EnderecoSearchResponse } from "@supervisor/types/pedido"
import type { EnderecoOut } from "@supervisor/api/models/EnderecoOut"
import type { app__api__mensura__schemas__endereco_schema__EnderecoCreate } from "@supervisor/api/models/app__api__mensura__schemas__endereco_schema__EnderecoCreate"
import type { Endereco } from "@supervisor/types/pedido"
import { MapPin, Plus, Check, Edit, Trash2 } from "lucide-react"
import { useToast } from "@supervisor/hooks/use-toast"

interface EditEnderecoModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (endereco: Endereco, enderecoId?: number) => void
  enderecoAtual?: Endereco
  enderecoId?: number
  clienteId?: number
}

export function EditEnderecoModal({
  isOpen,
  onClose,
  onSave,
  enderecoAtual,
  enderecoId,
  clienteId
}: EditEnderecoModalProps) {
  const [activeTab, setActiveTab] = useState("pesquisar")
  const [enderecoSelecionado, setEnderecoSelecionado] = useState<Endereco | null>(null)
  const [enderecoPesquisado, setEnderecoPesquisado] = useState<EnderecoSearchResponse | null>(null)
  const [searchAddress, setSearchAddress] = useState("")
  const [enderecoManual, setEnderecoManual] = useState<app__api__mensura__schemas__endereco_schema__EnderecoCreate>({
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: ""
  })
  const [pontoReferencia, setPontoReferencia] = useState("")

  // TODO: Implementar hooks para buscar e gerenciar endereços do cliente
  const enderecosCliente: EnderecoOut[] = []
  const loadingEnderecos = false
  const { toast } = useToast()

  // Inicializar dados quando o modal abrir
  useEffect(() => {
    if (isOpen && enderecoAtual) {
      setEnderecoSelecionado(enderecoAtual)
      setSearchAddress(enderecoAtual.endereco_formatado || "")
      setEnderecoManual({
        logradouro: enderecoAtual.logradouro || "",
        numero: enderecoAtual.numero || "",
        complemento: enderecoAtual.complemento || "",
        bairro: enderecoAtual.bairro || "",
        cidade: enderecoAtual.cidade || "",
        estado: enderecoAtual.estado || "",
        cep: enderecoAtual.cep || ""
      })
      setPontoReferencia(enderecoAtual.ponto_referencia || "")
    }
  }, [isOpen, enderecoAtual])

  const handleSelectEnderecoPesquisado = (endereco: EnderecoSearchResponse) => {
    const enderecoConvertido: Endereco = {
      endereco_formatado: endereco.endereco_formatado,
      logradouro: endereco.logradouro,
      cep: endereco.cep,
      cidade: endereco.cidade,
      estado: endereco.estado,
      bairro: endereco.bairro || undefined,
      latitude: endereco.latitude,
      longitude: endereco.longitude,
      codigo_estado: endereco.codigo_estado,
      distrito: endereco.distrito || undefined,
      pais: endereco.pais,
      numero: endereco.numero || undefined,
    }
    setEnderecoPesquisado(endereco)
    setEnderecoSelecionado(enderecoConvertido)
    setSearchAddress(endereco.endereco_formatado)
  }

  const handleSelectEnderecoCadastrado = (endereco: EnderecoOut) => {
    const enderecoConvertido: Endereco = {
      endereco_formatado: `${endereco.logradouro || ''}${endereco.numero ? `, ${endereco.numero}` : ''}${endereco.complemento ? `, ${endereco.complemento}` : ''} - ${endereco.bairro || ''} - ${endereco.cidade || ''}/${endereco.estado || ''} - ${endereco.cep || ''}`,
      logradouro: endereco.logradouro || "",
      cep: endereco.cep || "",
      cidade: endereco.cidade || "",
      estado: endereco.estado || "",
      bairro: endereco.bairro || undefined,
      latitude: endereco.latitude || 0,
      longitude: endereco.longitude || 0,
      numero: endereco.numero || undefined,
      complemento: endereco.complemento || undefined,
      ponto_referencia: endereco.ponto_referencia || undefined,
      is_principal: endereco.is_principal || false
    }
    setEnderecoSelecionado(enderecoConvertido)
    setSearchAddress(enderecoConvertido.endereco_formatado || "")
  }

  const handleSaveEnderecoManual = async () => {
    if (!clienteId) {
      toast({
        title: "Erro",
        description: "ID do cliente não encontrado",
        variant: "destructive"
      })
      return
    }

    try {
      const enderecoConvertido: Endereco = {
        endereco_formatado: `${enderecoManual.logradouro || ''}${enderecoManual.numero ? `, ${enderecoManual.numero}` : ''}${enderecoManual.complemento ? `, ${enderecoManual.complemento}` : ''} - ${enderecoManual.bairro || ''} - ${enderecoManual.cidade || ''}/${enderecoManual.estado || ''} - ${enderecoManual.cep || ''}`,
        logradouro: enderecoManual.logradouro || "",
        cep: enderecoManual.cep || "",
        cidade: enderecoManual.cidade || "",
        estado: enderecoManual.estado || "",
        bairro: enderecoManual.bairro || undefined,
        latitude: 0,
        longitude: 0,
        numero: enderecoManual.numero || undefined,
        complemento: enderecoManual.complemento || undefined,
        ponto_referencia: pontoReferencia || undefined
      }

      // TODO: Implementar chamadas para API de endereços
      onSave(enderecoConvertido, enderecoId)
      onClose()
    } catch (error) {
      console.error("Erro ao salvar endereço:", error)
    }
  }

  const handleSave = () => {
    if (enderecoSelecionado) {
      onSave(enderecoSelecionado, enderecoId)
      onClose()
    }
  }

  const formatEndereco = (endereco: Endereco) => {
    const parts = [
      endereco.logradouro,
      endereco.numero,
      endereco.complemento,
      endereco.bairro,
      endereco.distrito,
      endereco.cidade,
      endereco.codigo_estado || endereco.estado,
      endereco.cep
    ].filter(part => part !== null && part !== undefined && part !== "")
    
    return parts.join(", ")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Editar Endereço
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pesquisar">Pesquisar Endereço</TabsTrigger>
            <TabsTrigger value="cadastrados">Endereços Cadastrados</TabsTrigger>
            <TabsTrigger value="manual">Adicionar Manual</TabsTrigger>
          </TabsList>

          <TabsContent value="pesquisar" className="space-y-6 mt-6">
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                <MapPin className="w-5 h-5 text-green-600" />
                Pesquisar Endereço
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Pesquisar por logradouro ou CEP
                  </Label>
                  <SearchEndereco
                    value={searchAddress}
                    onValueChange={setSearchAddress}
                    onAddressSelect={handleSelectEnderecoPesquisado}
                    placeholder="Digite a rua ou CEP"
                  />
                </div>
                
                {enderecoSelecionado && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-800">Endereço Selecionado:</p>
                        <p className="text-sm text-green-700 mt-1">
                          {formatEndereco(enderecoSelecionado)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cadastrados" className="space-y-6 mt-6">
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                <MapPin className="w-5 h-5 text-blue-600" />
                Endereços Cadastrados
              </h3>
              
              <div className="space-y-4">
                <Label className="text-sm font-medium">
                  Endereços Cadastrados do Cliente
                </Label>
                
                {loadingEnderecos ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Carregando endereços...
                  </div>
                ) : enderecosCliente.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Nenhum endereço cadastrado
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {enderecosCliente.map((endereco) => (
                      <div
                        key={endereco.id}
                        onClick={() => handleSelectEnderecoCadastrado(endereco)}
                        className={`p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors ${
                          enderecoSelecionado?.logradouro === endereco.logradouro ? 'bg-green-50 border-green-200' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {endereco.logradouro}
                              {endereco.numero && `, ${endereco.numero}`}
                              {endereco.complemento && `, ${endereco.complemento}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {endereco.bairro} - {endereco.cidade}/{endereco.estado} - {endereco.cep}
                            </p>
                            {endereco.is_principal && (
                              <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                Principal
                              </span>
                            )}
                          </div>
                          {enderecoSelecionado?.logradouro === endereco.logradouro && (
                            <Check className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="manual" className="space-y-6 mt-6">
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                <MapPin className="w-5 h-5 text-purple-600" />
                Adicionar Endereço Manualmente
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logradouro">Logradouro *</Label>
                  <Input
                    id="logradouro"
                    value={enderecoManual.logradouro ?? ""}
                    onChange={(e) => setEnderecoManual(prev => ({ ...prev, logradouro: e.target.value }))}
                    placeholder="Rua, Avenida, etc."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="numero">Número *</Label>
                  <Input
                    id="numero"
                    value={enderecoManual.numero ?? ""}
                    onChange={(e) => setEnderecoManual(prev => ({ ...prev, numero: e.target.value }))}
                    placeholder="123"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input
                    id="complemento"
                    value={enderecoManual.complemento ?? ""}
                    onChange={(e) => setEnderecoManual(prev => ({ ...prev, complemento: e.target.value }))}
                    placeholder="Apto 101"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro *</Label>
                  <Input
                    id="bairro"
                    value={enderecoManual.bairro ?? ""}
                    onChange={(e) => setEnderecoManual(prev => ({ ...prev, bairro: e.target.value }))}
                    placeholder="Centro"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade *</Label>
                  <Input
                    id="cidade"
                    value={enderecoManual.cidade ?? ""}
                    onChange={(e) => setEnderecoManual(prev => ({ ...prev, cidade: e.target.value }))}
                    placeholder="São Paulo"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado *</Label>
                  <Input
                    id="estado"
                    value={enderecoManual.estado ?? ""}
                    onChange={(e) => setEnderecoManual(prev => ({ ...prev, estado: e.target.value }))}
                    placeholder="SP"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    value={enderecoManual.cep ?? ""}
                    onChange={(e) => setEnderecoManual(prev => ({ ...prev, cep: e.target.value }))}
                    placeholder="01234-567"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ponto_referencia">Ponto de Referência</Label>
                  <Input
                    id="ponto_referencia"
                    value={pontoReferencia}
                    onChange={(e) => setPontoReferencia(e.target.value)}
                    placeholder="Próximo ao shopping"
                  />
                </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          {activeTab === "manual" ? (
            <Button 
              onClick={handleSaveEnderecoManual}
              disabled={!enderecoManual.logradouro || !enderecoManual.numero || !enderecoManual.bairro || !enderecoManual.cidade || !enderecoManual.estado}
            >
              <Plus className="w-4 h-4 mr-2" />
              {enderecoId ? 'Atualizar Endereço' : 'Adicionar Endereço'}
            </Button>
          ) : (
            <Button 
              onClick={handleSave}
              disabled={!enderecoSelecionado}
            >
              <Check className="w-4 h-4 mr-2" />
              Salvar Endereço
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
