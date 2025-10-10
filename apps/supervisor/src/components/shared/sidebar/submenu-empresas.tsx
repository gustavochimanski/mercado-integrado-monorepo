"use client";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
  } from "@radix-ui/react-dropdown-menu";
import { SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from "../../ui/sidebar";
import { Briefcase, ChevronDown} from "lucide-react";
import { useState } from "react";

interface Empresa {
    nome_empresa: string;
    empresaAtual?: (empresa: Empresa) => void;
  }
  
  interface PropsEmpresas {
    empresas: Empresa[];
    isSidebarOpen: boolean;
  }

  const SubMenuEmpresas = ({ empresas, isSidebarOpen }: PropsEmpresas) =>{

    const [empresaAtual, setEmpresaAtual] = useState<Empresa>(empresas[0]);


    // Função para atualizar a empresa atual ao clicar em uma nova empresa
    const handleEmpresaClick = (empresa: Empresa) => {
        setEmpresaAtual(empresa)
    }
    return(
        <div>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <SidebarGroupLabel>Empresa</SidebarGroupLabel>
                    <DropdownMenuTrigger asChild >
                        <SidebarMenuButton>
                            {isSidebarOpen? (
                                <span>{empresaAtual.nome_empresa}</span>
                            ): (
                                <Briefcase  />
                            ) }
                        <ChevronDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side={isSidebarOpen? "bottom": "right"} className={`${isSidebarOpen ? "" : "ml-8 mt-8"}z-10 rounded-sm`}>
                        {empresas.map((empresa, index ) =>(
                                <DropdownMenuItem
                                className={"ml-[-25px] cursor-pointer text-white p-1 bg-black"}
                                key={index}
                                onSelect={() => handleEmpresaClick(empresa)}
                                >
                                <span>{empresa.nome_empresa}</span>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </div>
    )
  }

export default SubMenuEmpresas;