"use client"

import { SidebarProvider, SidebarTrigger } from "@supervisor/components/ui/sidebar"
import AppSidebar from "@supervisor/components/shared/sidebar/app-sidebar"
import { useEffect, useState } from "react"
import { Toaster } from "@supervisor/components/ui/toaster"
import ModalEnviarConfiguracao from "@supervisor/app/(private)/processos/components/comunicacao/ModalEnviarConfiguracoes"
import ModalEnviarProdutos from "@supervisor/app/(private)/processos/components/comunicacao/ModalEnviarProdutos"
import { ThemeProvider } from "next-themes"
import { useMediaQuery, useTheme } from "@mui/material"
import { useGlobalReauth } from "@supervisor/hooks/useGlobalReauth"
import { useTokenExpiration } from "@supervisor/hooks/useTokenExpiration"


interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isSideBarOpen, setIsSidebarOpen] = useState<boolean | null>(null)
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  // Inicializar o hook global de reautenticação
  useGlobalReauth();

  // Inicializar verificação automática de token expirado
  useTokenExpiration();

  useEffect(() => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("sidebar:state="))
      ?.split("=")[1];

    setIsSidebarOpen(cookieValue === "true");
  }, [])

  if (isSideBarOpen === null) {
    return null // Evita o piscar da sidebar antes do estado ser definido
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <SidebarProvider defaultOpen={isSideBarOpen}>
          <AppSidebar />
          <main className="flex h-screen w-full overflow-hidden">
            <SidebarTrigger variant="sidebarTrigger" />
            <div className="flex-1 flex flex-col overflow-hidden w-full">
              {/* {!isMobile && (<TopBarComponent />)} */}
              <div className={`flex-1 overflow-auto w-full ${isMobile ? "p-0" : "p-2"}`}>
                {children}
              </div>
            </div>
          </main>
          <Toaster />
          <ModalEnviarConfiguracao />
          <ModalEnviarProdutos />
        </SidebarProvider>
    </ThemeProvider>
  )
}
