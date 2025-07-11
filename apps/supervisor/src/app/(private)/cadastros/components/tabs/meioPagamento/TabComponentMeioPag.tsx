"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@supervisor/components/ui/card"
import { Button } from "@supervisor/components/ui/button"
import { CirclePlus, RefreshCcw } from "lucide-react"

import ComponentMeioPagamento from "./meioPag/ComponentMeioPag"
import ConfigsMeioPagamento from "./configMeioMag/MAIN"
import { useFetchByIdMeioPgto } from "../../../hooks/useMeioPag"

const TabComponentMeioPagamento = () => {
  const [idSelecionado, setIdSelecionado] = useState<string | null>(null)
  const { data: dataByIdMeiopgto } = useFetchByIdMeioPgto(idSelecionado || "")

  const onRowSelect = (id: string) => setIdSelecionado(id)

  const onClickIncluir = () => {
    console.log("Incluir novo meio de pagamento")
  }

  const onRefresh = () => {
    console.log("Atualizar lista de meios de pagamento")
  }

  return (
    <div className="flex flex-row w-full overflow-auto h-full gap-4">
      {/* Lista de Meios de Pagamento */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 h-full flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-lg">Meios de Pagamento</h2>
            <div className="flex gap-2">
              <Button onClick={onClickIncluir}>
                <CirclePlus className="w-4 h-4 mr-1" />
                Incluir
              </Button>
              <Button onClick={onRefresh} variant="secondary">
                <RefreshCcw className="w-4 h-4 mr-1" />
                Atualizar
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <ComponentMeioPagamento onRowSelect={onRowSelect} />
          </div>
        </CardContent>
      </Card>

      {/* Configurações do Meio de Pagamento */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 h-full overflow-auto">
          {idSelecionado ? (
            <ConfigsMeioPagamento idMeioPgto={idSelecionado} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Selecione um meio de pagamento para editar
            </div>
          )}
        </CardContent>
        <CardFooter>Hello</CardFooter>
      </Card>
    </div>
  )
}

export default TabComponentMeioPagamento
