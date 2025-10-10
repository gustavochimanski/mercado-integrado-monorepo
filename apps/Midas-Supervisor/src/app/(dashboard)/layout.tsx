'use client'

import { Sidebar } from '@/components/layout/sidebar'
import { SidebarProvider, useSidebar } from '@/contexts/sidebar-context'
import { ReauthProvider } from '@/contexts/reauth-context'
import { LockScreenProvider } from '@/components/security/lock-screen-provider'

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      {/* Main Content - ajusta dinamicamente */}
      <main
        className={`transition-all duration-300 ${
          isCollapsed ? 'pl-20' : 'pl-64'
        }`}
      >
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ReauthProvider>
      <SidebarProvider>
        <LockScreenProvider timeout={2}>
          <DashboardContent>{children}</DashboardContent>
        </LockScreenProvider>
      </SidebarProvider>
    </ReauthProvider>
  )
}
