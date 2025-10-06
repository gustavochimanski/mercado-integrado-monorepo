"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../ui/dialog"
import { Input } from "../../../ui/input"
import { Button } from "../../../ui/button"
import { Search, Plus, X } from "lucide-react"
import { mensuraApi } from "@supervisor/api/MensuraApi"
import { useQuery } from "@tanstack/react-query"
import { useToast } from "@supervisor/hooks/use-toast"
import Image from "next/image"

interface AdicionarItemModalProps {
  isOpen: boolean
  onClose: () => void
  onAdicionarItem: (produto: any) => void
  empresaId: number
}

export const AdicionarItemModal: React.FC<AdicionarItemModalProps> = ({
  isOpen,
  onClose,
  onAdicionarItem,
  empresaId,
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const { toast } = useToast()

  // Debounce na pesquisa
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Query para buscar produtos
  const { data: produtosData, isLoading } = useQuery({
    queryKey: ["produtos-search", empresaId, debouncedSearch],
    queryFn: async () => {
      const response = await mensuraApi.produtosAdminDelivery.searchProdutosApiDeliveryProdutosSearchGet(
        empresaId,
        debouncedSearch || undefined,
        1,
        30,
        true
      )
      return response
    },
    enabled: !!empresaId && isOpen,
  })

  const produtos = produtosData?.data || []

  const handleAdicionarProduto = (produto: any) => {
    if (!produto.preco_delivery && !produto.preco_venda) {
      toast({
        title: "Erro",
        description: "Produto sem preço definido.",
        variant: "destructive",
      })
      return
    }

    onAdicionarItem({
      produto_cod_barras: produto.cod_barras,
      produto_descricao_snapshot: produto.descricao,
      produto_imagem_snapshot: produto.imagem || null,
      preco_unitario: produto.preco_delivery || produto.preco_venda,
      quantidade: 1,
      observacao: "",
      action: "create",
    })

    toast({
      title: "Item adicionado",
      description: `${produto.descricao} foi adicionado ao pedido.`,
    })
  }

  const handleClose = () => {
    setSearchTerm("")
    setDebouncedSearch("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Adicionar Item ao Pedido</DialogTitle>
        </DialogHeader>

        {/* Campo de pesquisa */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Pesquisar produtos por nome ou código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10"
            autoFocus
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Lista de produtos */}
        <div className="flex-1 overflow-y-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-500">Buscando produtos...</p>
              </div>
            </div>
          ) : produtos.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <p>Nenhum produto encontrado</p>
            </div>
          ) : (
            // ⬇️ Grid responsiva para controlar largura dos cards (e a altura do aspect)
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
              {produtos.map((produto: any) => (
                <div
                  key={produto.cod_barras}
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col"
                >
                  {/* Imagem vertical harmoniosa */}
                  <div className="relative w-full aspect-[4/4] flex-none overflow-hidden">
                    {produto.imagem ? (
                      <Image
                        src={produto.imagem}
                        alt={produto.descricao}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400 text-4xl">📦</span>
                      </div>
                    )}
                  </div>

                  {/* Informações do produto */}
                  <div className="p-3 flex-1 flex flex-col">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2 flex-1">
                      {produto.descricao}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">Cód: {produto.cod_barras}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <p className="text-base font-bold text-green-600">
                        {(produto.preco_delivery || produto.preco_venda).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>
                      <Button
                        size="sm"
                        onClick={() => handleAdicionarProduto(produto)}
                        className="h-8 px-3"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Adicionar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
