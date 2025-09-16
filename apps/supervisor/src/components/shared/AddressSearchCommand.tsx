"use client"

import * as React from "react"
import { Check, MapPin, Loader2 } from "lucide-react"
import { cn } from "@supervisor/lib/utils"
import { Button } from "../ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { useSearchEndereco } from "@supervisor/services/useQueryEndereco"
import type { Endereco, EnderecoSearchResponse } from "@supervisor/types/pedido"

interface AddressSearchCommandProps {
  value: string
  onValueChange: (value: string) => void
  onAddressSelect: (address: Endereco) => void
  disabled?: boolean
  placeholder?: string
}

export function AddressSearchCommand({
  value,
  onValueChange,
  onAddressSelect,
  disabled = false,
  placeholder = "Digite o logradouro ou CEP"
}: AddressSearchCommandProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")
  const [addressOptions, setAddressOptions] = React.useState<EnderecoSearchResponse[]>([])
  const searchEnderecoMutation = useSearchEndereco()

  const handleSearch = async (searchText: string) => {
    if (!searchText.trim()) {
      setAddressOptions([])
      return
    }

    try {
      const response = await searchEnderecoMutation.mutateAsync(searchText)
      setAddressOptions(response || [])
    } catch (error) {
      console.error("Error searching address:", error)
      setAddressOptions([])
    }
  }

  const handleSelect = (address: EnderecoSearchResponse) => {
    // Converter EnderecoSearchResponse para Endereco
    const enderecoConvertido: Endereco = {
      endereco_formatado: address.endereco_formatado,
      logradouro: address.logradouro,
      cep: address.cep,
      cidade: address.cidade,
      estado: address.estado,
      bairro: address.bairro || undefined,
      latitude: address.latitude,
      longitude: address.longitude,
      codigo_estado: address.codigo_estado,
      distrito: address.distrito || undefined,
      pais: address.pais,
      numero: address.numero || undefined,
    }
    
    onAddressSelect(enderecoConvertido)
    onValueChange(address.endereco_formatado || "")
    setOpen(false)
    setSearchValue("")
    setAddressOptions([])
  }

  // Reset search value when popover opens
  React.useEffect(() => {
    if (open) {
      setSearchValue("")
      setAddressOptions([])
    }
  }, [open])

  // Only search when user types and popover is open
  React.useEffect(() => {
    // Skip search if searchValue is empty or popover is closed
    if (!searchValue.trim() || !open) {
      setAddressOptions([])
      return
    }

    const timeoutId = setTimeout(() => {
      handleSearch(searchValue)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchValue, open])

  const handleInputChange = (inputValue: string) => {
    setSearchValue(inputValue)
    onValueChange(inputValue)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-white"
          disabled={disabled}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate text-left">
              {value || placeholder}
            </span>
          </div>
          {searchEnderecoMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <div className="h-4 w-4" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Digite o logradouro ou CEP para buscar..."
            value={searchValue}
            onValueChange={handleInputChange}
            className="h-9"
          />
          <CommandList>
            {searchEnderecoMutation.isPending && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Buscando endereços...
              </div>
            )}
            {addressOptions && addressOptions.length > 0 && (
              <CommandGroup>
                {addressOptions.map((address, index) => (
                  <CommandItem
                    key={index}
                    value={address.endereco_formatado || ""}
                    onSelect={() => handleSelect(address)}
                    className="flex items-start gap-3 p-3 cursor-pointer hover:bg-accent"
                  >
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm leading-tight">
                        {address.logradouro}
                        {address.numero && `, ${address.numero}`}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {[address.bairro, address.distrito].filter(Boolean).join(", ")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {[address.cidade, address.codigo_estado].filter(Boolean).join(" - ")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        CEP: {address.cep}
                      </div>
                    </div>
                    <Check className="h-4 w-4 shrink-0 opacity-0 group-data-[selected=true]:opacity-100" />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {!searchEnderecoMutation.isPending && (!addressOptions || addressOptions.length === 0) && searchValue.trim() && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Nenhum endereço encontrado.
              </div>
            )}
            {!searchEnderecoMutation.isPending && (!addressOptions || addressOptions.length === 0) && !searchValue.trim() && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Digite para buscar endereços.
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
