"use client"

import { useState } from "react";
import { CardContent, CardFooter, CardHeader} from "@supervisor/components/ui/card";
import { TypeCaixas } from "../../../../types/typesPDVS";
import DataTableComponentMui from "@supervisor/components/shared/table/mui-data-table";
import { SearchComponent } from "@supervisor/components/shared/searchComponent";
import { Button } from "@supervisor/components/ui/button";
import { ArrowRightCircle, CirclePlus, EllipsisVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@supervisor/components/ui/dropdown-menu";
import { useModalStore } from "@supervisor/store/useModalStore";
import { ExportButtonPro } from "@supervisor/components/shared/exportCsvButton";
import { getCaixasColumns } from "../config/columns";
import ModalIncluirPdv from "./ModalIncluirPdv";

interface ComponentPdvsProps {
  setRowSelectedProp: (row: TypeCaixas) => void;
  caixasSSR: TypeCaixas[];
  setModoEdicao: (ativo: boolean) => void; // ⬅ novo prop
}

const ComponentPdvs = ({ setRowSelectedProp, caixasSSR, setModoEdicao }: ComponentPdvsProps) => {
  // STATES locais se necessário para outros fins
  const [showModalIncluiPdv, setShowModalIncluiPdv] = useState(false);
  const { openEnviarConfig } = useModalStore();
  
  // FETCHING DATA

  const columns = getCaixasColumns(() => setModoEdicao(true));

  
    return(
        <div className="flex-1 h-full flex flex-col">
            <CardHeader>
              <SearchComponent className="w-52"></SearchComponent>
            </CardHeader>

            {/* =================================================== */}
            {/* ====================== TABELA ===================== */}
            <CardContent className="flex-1 h-full">
              <DataTableComponentMui 
                rows={caixasSSR} 
                columns={columns}
                onRowClick={(rowData: any) => setRowSelectedProp(rowData)}
              />
            </CardContent>

            {/* =================================================== */}
            {/* =============== BUTTONS FUNCOES =================== */}
            <CardFooter className="justify-between">
              <Button onClick={() => setShowModalIncluiPdv(true)}>
                <CirclePlus/>Incluir
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"secondary"} >
                    <EllipsisVertical/>Mais
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Opções</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={openEnviarConfig}>
                    <ArrowRightCircle />Enviar Configuração
                  </DropdownMenuItem>
                <DropdownMenuItem>
                  <ExportButtonPro rows={caixasSSR ?? []}>Excel</ExportButtonPro>
                </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>


            {/* ============================================ */}
            {/* ================== MODALS ================== */}
            <ModalIncluirPdv open={showModalIncluiPdv} onClose={() => setShowModalIncluiPdv(false)} />     
    </div>
    )
}




export default ComponentPdvs;