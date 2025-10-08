'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Store,
  Truck,
  Tags,
  CreditCard,
  MapPin,
  BarChart3,
  UserCog,
  Gift,
  ClipboardList
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { logoutAction } from '@/actions/auth/logout'
import { useSidebar } from '@/contexts/sidebar-context'

const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Pedidos',
    href: '/pedidos',
    icon: ShoppingCart,
  },
  {
    title: 'Clientes',
    href: '/clientes',
    icon: Users,
  },
  {
    title: 'Produtos',
    href: '/produtos',
    icon: Package,
  },
  {
    title: 'Categorias',
    href: '/categorias',
    icon: Tags,
  },
  {
    title: 'Empresas',
    href: '/empresas',
    icon: Store,
  },
  {
    title: 'Entregadores',
    href: '/entregadores',
    icon: Truck,
  },
  {
    title: 'Regiões de Entrega',
    href: '/regioes-entrega',
    icon: MapPin,
  },
  {
    title: 'Meios de Pagamento',
    href: '/meios-pagamento',
    icon: CreditCard,
  },
  {
    title: 'Cupons',
    href: '/cupons',
    icon: Gift,
  },
  {
    title: 'Vitrines',
    href: '/vitrines',
    icon: ClipboardList,
  },
  {
    title: 'Relatórios',
    href: '/relatorios',
    icon: BarChart3,
  },
  {
    title: 'Usuários',
    href: '/usuarios',
    icon: UserCog,
  },
  {
    title: 'Configurações',
    href: '/configuracoes',
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isCollapsed, setIsCollapsed } = useSidebar()

  const handleLogout = async () => {
    await logoutAction()
  }

  return (
    <TooltipProvider delayDuration={0}>
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen bg-slate-900 border-r border-slate-800
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-20 border-b border-slate-800">
          <Image
            src="/images/logo.png"
            alt="UNITEC Logo"
            width={isCollapsed ? 40 : 50}
            height={isCollapsed ? 40 : 50}
            className="object-contain transition-all duration-300"
            draggable={false}
            style={{ width: 'auto', height: 'auto' }}
          />
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-4 top-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg transition-all hover:scale-110 z-50 cursor-pointer"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            const linkContent = (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center px-4 py-3 rounded-lg text-sm font-medium
                  transition-colors duration-200
                  ${
                    isActive
                      ? 'bg-slate-800 text-blue-400 border-l-4 border-blue-500'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }
                `}
              >
                <div className="flex items-center gap-3 w-full">
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span
                    className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                      isCollapsed ? 'w-0 opacity-0' : 'flex-1 opacity-100'
                    }`}
                  >
                    {item.title}
                  </span>
                </div>
              </Link>
            )

            if (isCollapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    {linkContent}
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="bg-slate-800 text-white border border-slate-700 shadow-xl px-3 py-2 text-sm font-medium"
                    sideOffset={10}
                  >
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return linkContent
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-800">
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors duration-200 cursor-pointer"
                >
                  <LogOut className="h-5 w-5 flex-shrink-0" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-slate-800 text-white border border-slate-700 shadow-xl px-3 py-2 text-sm font-medium"
                sideOffset={10}
              >
                Sair
              </TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-start px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <LogOut className="h-5 w-5 flex-shrink-0" />
                <span className="whitespace-nowrap">Sair</span>
              </div>
            </button>
          )}
        </div>
      </aside>
    </TooltipProvider>
  )
}
