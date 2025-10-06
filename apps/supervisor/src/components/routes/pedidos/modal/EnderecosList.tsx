"use client";

import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import { Card, CardContent } from "../../../ui/card";
import { MapPin, Edit, Plus, Star } from "lucide-react";
import { EnderecoOut } from "@supervisor/api/models/EnderecoOut";
import { cn } from "@supervisor/lib/utils";

interface EnderecosListProps {
  enderecos: EnderecoOut[];
  enderecoSelecionado?: EnderecoOut | null;
  onEnderecoSelect: (endereco: EnderecoOut) => void;
  onEditEndereco: (endereco: EnderecoOut) => void;
  onAddNewEndereco: () => void;
  isEditing: boolean;
  isLoading?: boolean;
  showSelectionMessage?: boolean;
}

export function EnderecosList({
  enderecos,
  enderecoSelecionado,
  onEnderecoSelect,
  onEditEndereco,
  onAddNewEndereco,
  isEditing,
  isLoading = false,
  showSelectionMessage = true
}: EnderecosListProps) {

  // Função para formatar endereço
  const formatarEndereco = (endereco: EnderecoOut): string => {
    const partes = [
      endereco.logradouro,
      endereco.numero,
      endereco.bairro,
      endereco.cidade,
      endereco.estado
    ].filter(Boolean);

    return partes.join(", ");
  };


  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header com botão de adicionar */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">
          Endereços do Cliente ({enderecos.length})
        </h4>
        {isEditing && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddNewEndereco}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Novo Endereço
          </Button>
        )}
      </div>

      {/* Lista de endereços */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {enderecos.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <MapPin className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-3">
                Nenhum endereço cadastrado
              </p>
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onAddNewEndereco}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Primeiro Endereço
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          enderecos.map((endereco) => {
            const isSelected = enderecoSelecionado?.id === endereco.id;

            return (
              <Card
                key={endereco.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md border",
                  isSelected
                    ? "border-blue-300 bg-blue-50/50 shadow-sm shadow-blue-100"
                    : "border-gray-200 hover:border-gray-300"
                )}
                onClick={() => onEnderecoSelect(endereco)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* Header do endereço */}
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className={cn(
                          "w-4 h-4 flex-shrink-0",
                          isSelected ? "text-blue-600" : "text-gray-400"
                        )} />

                        {endereco.is_principal && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            Principal
                          </Badge>
                        )}

                        {isSelected && (
                          <Badge className="bg-blue-600">
                            Selecionado
                          </Badge>
                        )}
                      </div>

                      {/* Endereço formatado */}
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {formatarEndereco(endereco)}
                      </p>

                      {/* CEP */}
                      {endereco.cep && (
                        <p className="text-xs text-gray-500 mb-2">
                          CEP: {endereco.cep}
                        </p>
                      )}

                      {/* Complemento e ponto de referência - sempre visível se existir */}
                      {(endereco.complemento || endereco.ponto_referencia) && (
                        <div className="space-y-1">
                          {endereco.complemento && (
                            <p className="text-xs text-gray-600">
                              <span className="font-medium">Complemento:</span> {endereco.complemento}
                            </p>
                          )}
                          {endereco.ponto_referencia && (
                            <p className="text-xs text-gray-600">
                              <span className="font-medium">Referência:</span> {endereco.ponto_referencia}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Ações */}
                    <div className="flex items-center ml-4">
                      {isEditing && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditEndereco(endereco);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Informações adicionais */}
      {enderecos.length > 0 && showSelectionMessage && (
        <div className="text-xs text-gray-500 text-center pt-2 border-t">
          {enderecoSelecionado ? (
            <span className="text-blue-600 font-medium">
              Endereço selecionado será usado para entrega
            </span>
          ) : (
            "Clique em um endereço para selecioná-lo"
          )}
        </div>
      )}
    </div>
  );
}