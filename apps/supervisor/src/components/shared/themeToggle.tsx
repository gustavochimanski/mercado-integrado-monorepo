"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

type ThemeToggleProps = {
  sidebar?: boolean
  className?: string
  label?: string
}

export const ThemeToggle = ({ className,label, sidebar = false }: ThemeToggleProps) => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const icon = theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />

  if (sidebar) {
    return (
      <div onClick={toggleTheme} className={className}>
        {icon} {label}
      </div>
    )
  }

  return (
    <div
      onClick={toggleTheme}
    >
      {icon}
    </div>
  )
}
