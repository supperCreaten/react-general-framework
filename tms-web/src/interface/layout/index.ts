import type { ReactNode } from "react"

export interface LayoutSidebarProps {
  children?: ReactNode
  computedSidebarWidth: number
}

export interface LayoutHeaderProps {
  className?: string
  children?: ReactNode
}

export interface LogoProps {
  sidebarCollapsed: boolean
  className?: string
}
