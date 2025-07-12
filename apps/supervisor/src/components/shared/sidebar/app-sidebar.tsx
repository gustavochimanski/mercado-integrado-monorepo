"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@supervisor/components/ui/sidebar"
  import {
    Home,
    Settings,
    Power,
    PieChart,
    CircleUser,
    Atom,
    Target,
    Bot,
    FileText,
    Utensils,
  } from "lucide-react";


import Image from 'next/image';
import Link from "next/link";
import { ThemeToggle } from "../themeToggle";
import { logoutService } from "@supervisor/services/Auth/authenticate";


  // Menu items.
  const items = [
    { title: "Home", url: "/home", icon: Home },
    { title: "Dashboard", url: "/", icon: PieChart },
    { title: "ChatBot", url: "/chatbot", icon: Bot },
    { title: "Cardápio", url: "/cardapio", icon: Utensils },
    { title: "Relatórios", url: "/relatorios", icon: FileText },
    { title: "Metas", url: "/metas", icon: Target },
    { title: "Cadastros", url: "/cadastros", icon: CircleUser },
    { title: "Processos", url: "/processos", icon: Atom },
    { title: "Configurações", url: "/configuracoes", icon: Settings },
  ];


  const AppSidebar = ()=> {

    
    return (
        <Sidebar collapsible="icon" className="z-50">
            <SidebarContent className="justify-between">
                <SidebarGroup>
                <SidebarGroupContent>
                  <Image src="/logo.png" alt="Logo" className="mb-3 m-auto" width={20} height={20}/>
                    <SidebarMenu >
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title} >
                        <SidebarMenuButton asChild tooltip={item.title}>
                            <Link href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                    </SidebarMenu>
                </SidebarGroupContent>
                </SidebarGroup>
                
                {/*====== BUTTONS FOOTER SIDEBAR ====== */}
                <SidebarGroup>
                  <SidebarGroupLabel>Pessoal</SidebarGroupLabel>
                  <SidebarGroupContent>
                    {/* BUTTONS */}
                    <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip={"Trocar Tema"}>
                          <ThemeToggle sidebar={true} className="w-full flex"/>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem >
                        <SidebarMenuButton onClick={() => logoutService()} tooltip={"Sair"}>
                          <Power/> Sair
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

          </Sidebar>
    )
  }

  export default AppSidebar
  