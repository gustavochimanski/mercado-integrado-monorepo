'use client'

import { useState, useMemo, useEffect, memo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { DatePicker } from '@/components/shared/date-picker'
import {
  Filter,
  X,
  ChevronDown,
  Hash,
  Phone,
  User,
  MapPin,
  Search,
  Calendar,
  Building2,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Empresa {
  id: number
  nome: string
}

interface FiltrosAvancadosProps {
  empresas: Empresa[]
}

export const FiltrosAvancados = memo(function FiltrosAvancados({ empresas }: FiltrosAvancadosProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(true)

  // Estados locais para inputs (sem delay)
  const [localNumero, setLocalNumero] = useState(searchParams.get('numero') || '')
  const [localTelefone, setLocalTelefone] = useState(searchParams.get('telefone') || '')
  const [localNome, setLocalNome] = useState(searchParams.get('nome') || '')
  const [localEndereco, setLocalEndereco] = useState(searchParams.get('endereco') || '')

  const empresaId = searchParams.get('empresa_id') || ''
  const dataParam = searchParams.get('data') || ''

  const dataSelecionada = useMemo(() => {
    return dataParam ? new Date(dataParam + 'T00:00:00') : undefined
  }, [dataParam])

  const filtrosAtivos = [
    searchParams.get('numero'),
    searchParams.get('telefone'),
    searchParams.get('nome'),
    searchParams.get('endereco')
  ].filter(Boolean).length

  // Sincronizar estados locais quando URL mudar externamente
  useEffect(() => {
    setLocalNumero(searchParams.get('numero') || '')
    setLocalTelefone(searchParams.get('telefone') || '')
    setLocalNome(searchParams.get('nome') || '')
    setLocalEndereco(searchParams.get('endereco') || '')
  }, [searchParams])

  // Debounce para atualizar URL
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())

      if (localNumero) params.set('numero', localNumero)
      else params.delete('numero')

      if (localTelefone) params.set('telefone', localTelefone)
      else params.delete('telefone')

      if (localNome) params.set('nome', localNome)
      else params.delete('nome')

      if (localEndereco) params.set('endereco', localEndereco)
      else params.delete('endereco')

      const newUrl = `/pedidos?${params.toString()}`

      // Usar window.history.replaceState para não causar scroll
      window.history.replaceState(null, '', newUrl)

      // Disparar evento para Next.js atualizar sem scroll
      router.replace(newUrl, { scroll: false })
    }, 800)

    return () => clearTimeout(timer)
  }, [localNumero, localTelefone, localNome, localEndereco, router, searchParams])

  const atualizarFiltro = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/pedidos?${params.toString()}`, { scroll: false })
  }

  const limparFiltros = () => {
    // Limpa apenas os filtros de texto, mantém data e empresa
    const params = new URLSearchParams(searchParams.toString())
    params.delete('numero')
    params.delete('telefone')
    params.delete('nome')
    params.delete('endereco')

    // Limpa estados locais
    setLocalNumero('')
    setLocalTelefone('')
    setLocalNome('')
    setLocalEndereco('')

    router.push(`/pedidos?${params.toString()}`, { scroll: false })
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="bg-card border rounded-lg shadow-sm">
        {/* Header do Collapsible */}
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors rounded-lg">
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Filtros Avançados</h3>
              {filtrosAtivos > 0 && (
                <div className="w-2 h-2 rounded-full bg-green-500" />
              )}
            </div>
            <div className="flex items-center gap-2">
              {filtrosAtivos > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    limparFiltros()
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Limpar
                </Button>
              )}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </div>
          </div>
        </CollapsibleTrigger>

        {/* Conteúdo dos Filtros */}
        <CollapsibleContent>
          <div className="px-6 pb-6 space-y-4">
            {/* Filtros Principais: Data e Empresa */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b">
              {/* Filtro: Data */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Data dos Pedidos
                </Label>
                <DatePicker
                  date={dataSelecionada}
                  onDateChange={(date) => {
                    if (date) {
                      // Formatar data no timezone local para evitar problemas de fuso horário
                      const ano = date.getFullYear()
                      const mes = String(date.getMonth() + 1).padStart(2, '0')
                      const dia = String(date.getDate()).padStart(2, '0')
                      atualizarFiltro('data', `${ano}-${mes}-${dia}`)
                    }
                  }}
                />
              </div>

              {/* Filtro: Empresa */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  Empresa
                </Label>
                <Select
                  value={empresaId || empresas[0]?.id.toString() || ''}
                  onValueChange={(value) => atualizarFiltro('empresa_id', value)}
                  disabled={empresas.length <= 1}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {empresas.map((empresa) => (
                      <SelectItem key={empresa.id} value={empresa.id.toString()}>
                        {empresa.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Grid de Filtros de Texto */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Filtro: Número do Pedido */}
              <div className="space-y-2">
                <Label
                  htmlFor="numeroPedido"
                  className="flex items-center gap-2"
                >
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  Número do Pedido
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="numeroPedido"
                    placeholder="Ex: 123"
                    value={localNumero}
                    onChange={(e) => setLocalNumero(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filtro: Telefone */}
              <div className="space-y-2">
                <Label htmlFor="telefone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Telefone do Cliente
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="telefone"
                    placeholder="Ex: (11) 99999-9999"
                    value={localTelefone}
                    onChange={(e) => setLocalTelefone(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filtro: Nome */}
              <div className="space-y-2">
                <Label htmlFor="nome" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Nome do Cliente
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="nome"
                    placeholder="Ex: João Silva"
                    value={localNome}
                    onChange={(e) => setLocalNome(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filtro: Endereço */}
              <div className="space-y-2">
                <Label htmlFor="endereco" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Endereço
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="endereco"
                    placeholder="Ex: Rua das Flores"
                    value={localEndereco}
                    onChange={(e) => setLocalEndereco(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
})
