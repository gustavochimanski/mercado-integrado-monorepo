'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ThemeToggleProps {
  isCollapsed?: boolean
}

export function ThemeToggle({ isCollapsed = false }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Evitar hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-10 w-full animate-pulse bg-slate-800/50 rounded-lg" />
    )
  }

  const isDark = resolvedTheme === 'dark'

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  const toggleButton = (
    <button
      onClick={toggleTheme}
      className="w-full flex items-center justify-center px-4 py-3 rounded-lg transition-colors duration-200 cursor-pointer group"
      aria-label={`Trocar para ${isDark ? 'modo claro' : 'modo escuro'}`}
    >
      {/* Switch Slider que desliza */}
      <div
        className={`
          relative w-12 h-6 rounded-full transition-colors duration-300
          ${isDark ? 'bg-blue-600' : 'bg-slate-600'}
        `}
      >
        {/* Círculo que desliza */}
        <div
          className={`
            absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md
            transition-transform duration-300 ease-in-out
            flex items-center justify-center
            ${isDark ? 'translate-x-6' : 'translate-x-0.5'}
          `}
        >
          {isDark ? (
            <Moon className="h-3 w-3 text-blue-600" />
          ) : (
            <Sun className="h-3 w-3 text-yellow-500" />
          )}
        </div>
      </div>
    </button>
  )

  if (isCollapsed) {
    // Quando colapsada, mostra apenas o ícone sem fundo
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center px-4 py-3 rounded-lg transition-colors duration-200 cursor-pointer group"
            aria-label={`Trocar para ${isDark ? 'modo claro' : 'modo escuro'}`}
          >
            {isDark ? (
              <Moon className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
            ) : (
              <Sun className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="bg-slate-800 text-white border border-slate-700 shadow-xl px-3 py-2 text-sm font-medium"
          sideOffset={10}
        >
          {isDark ? 'Modo Escuro' : 'Modo Claro'}
        </TooltipContent>
      </Tooltip>
    )
  }

  return toggleButton
}
