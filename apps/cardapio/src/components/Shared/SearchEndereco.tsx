"use client"

import * as React from "react"
import { MapPin, Search, X, Check } from "lucide-react"
import { cn } from "@cardapio/lib/utils"
import { useSearchEndereco } from "@cardapio/services/useQueryEndereco"
import type { EnderecoSearchResult } from "@cardapio/services/useQueryEndereco"

interface SearchEnderecoProps {
  value: string
  onValueChange: (value: string) => void
  onAddressSelect: (address: EnderecoSearchResult) => void
  disabled?: boolean
  placeholder?: string
}

export function SearchEndereco({
  value,
  onValueChange,
  onAddressSelect,
  disabled = false,
  placeholder = "Digite a rua ou CEP..."
}: SearchEnderecoProps) {
  const [searchText, setSearchText] = React.useState("")
  const [debouncedSearchText, setDebouncedSearchText] = React.useState("")
  const [lastSearchedText, setLastSearchedText] = React.useState("")
  const [justSelected, setJustSelected] = React.useState(false)
  const [selectedAddress, setSelectedAddress] = React.useState<EnderecoSearchResult | null>(null)

  const searchEnderecoMutation = useSearchEndereco()

  // Debounce search text
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText)
    }, 1500)

    return () => clearTimeout(timer)
  }, [searchText])

  // Trigger search when debounced text changes (only if different from last search and not just selected)
  React.useEffect(() => {
    if (
      debouncedSearchText.trim() && 
      debouncedSearchText.length >= 3 && 
      debouncedSearchText !== lastSearchedText &&
      !justSelected
    ) {
      setLastSearchedText(debouncedSearchText)
      searchEnderecoMutation.mutate(debouncedSearchText)
    }
    
    // Reset justSelected flag after debounce
    if (justSelected) {
      setJustSelected(false)
    }
  }, [debouncedSearchText, lastSearchedText, searchEnderecoMutation, justSelected])

  const handleSelect = (address: EnderecoSearchResult) => {
    setJustSelected(true)
    setSelectedAddress(address)
    onAddressSelect(address)
    onValueChange(address.endereco_formatado || "")
    setSearchText("")
    setLastSearchedText("")
  }

  const handleClearSelection = () => {
    setSelectedAddress(null)
    setSearchText("")
    setLastSearchedText("")
    onValueChange("")
  }

  const handleInputChange = (newValue: string) => {
    setSearchText(newValue)
    onValueChange(newValue)
    
    // Reset last searched text if input is cleared
    if (!newValue.trim()) {
      setLastSearchedText("")
    }
  }

  const normalizeCoordinates = (address: EnderecoSearchResult) => {
    return {
      ...address,
      latitude: Number(address.latitude?.toFixed(6)),
      longitude: Number(address.longitude?.toFixed(6))
    }
  }

  const formatAddress = (address: EnderecoSearchResult) => {
    const parts = [
      address.logradouro,
      address.numero,
      address.bairro,
      address.distrito,
      address.cidade,
      address.codigo_estado || address.estado,
      address.cep
    ].filter(part => part !== null && part !== undefined && part !== "")
    
    return parts.join(", ")
  }

  return (
    <div className="w-full space-y-2">
      {/* Endereço selecionado */}
      {selectedAddress ? (
        <div className="border border-green-200 bg-green-50 rounded-md p-3 sm:p-4">
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
              <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0 space-y-1">
                <div className="font-medium text-xs sm:text-sm text-green-800">
                  Endereço selecionado:
                </div>
                <div className="text-sm sm:text-base text-green-700 break-words">
                  {selectedAddress.logradouro || "Endereço não informado"}
                  {selectedAddress.numero && `, ${selectedAddress.numero}`}
                </div>
                <div className="text-xs sm:text-sm text-green-600 break-words leading-relaxed">
                  {formatAddress(selectedAddress)}
                </div>
              </div>
            </div>
            <button
              onClick={handleClearSelection}
              className="flex-shrink-0 p-1.5 sm:p-1 hover:bg-green-100 rounded-full transition-colors"
              title="Limpar seleção"
            >
              <X className="h-4 w-4 text-green-600" />
            </button>
          </div>
        </div>
      ) : (
        /* Input de busca */
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchText}
            onChange={(e) => handleInputChange(e.target.value)}
            disabled={disabled}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      )}

      {/* Loading state */}
      {!selectedAddress && searchEnderecoMutation.isPending && (
        <div className="py-4 text-center text-sm text-muted-foreground">
          Buscando endereços...
        </div>
      )}

      {/* Mensagem de instrução */}
      {!selectedAddress && !searchEnderecoMutation.isPending && searchText.length < 3 && searchText.length > 0 && (
        <div className="py-4 text-center text-sm text-muted-foreground">
          Digite pelo menos 3 caracteres para buscar
        </div>
      )}

      {/* Lista de endereços */}
      {!selectedAddress && searchEnderecoMutation.data && searchEnderecoMutation.data.length > 0 && !searchEnderecoMutation.isPending && (
        <div className="border border-input rounded-md bg-background max-h-60 overflow-y-auto">
          {searchEnderecoMutation.data.map((address, index) => {
            const normalizedAddress = normalizeCoordinates(address)
            return (
              <div
                key={`${normalizedAddress.latitude}-${normalizedAddress.longitude}-${normalizedAddress.cep || 'no-cep'}-${index}`}
                onClick={() => handleSelect(normalizedAddress)}
                className="flex items-start gap-3 p-3 hover:bg-accent hover:text-accent-foreground cursor-pointer border-b border-border last:border-b-0"
              >
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="font-medium text-sm break-words leading-relaxed">
                    {normalizedAddress.logradouro || "Endereço não informado"}
                    {normalizedAddress.numero && `, ${normalizedAddress.numero}`}
                  </div>
                  <div className="text-xs text-muted-foreground break-words leading-relaxed">
                    {formatAddress(normalizedAddress)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Mensagem de nenhum resultado */}
      {!selectedAddress && !searchEnderecoMutation.isPending && searchText.length >= 3 && searchEnderecoMutation.data && searchEnderecoMutation.data.length === 0 && (
        <div className="py-4 text-center text-sm text-muted-foreground">
          Nenhum endereço encontrado
        </div>
      )}
    </div>
  )
}
