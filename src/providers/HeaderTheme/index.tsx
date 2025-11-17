'use client'

import React, { createContext, use } from 'react'

// Light-only: keep a no-op header theme context for compatibility
export interface ContextType {
  headerTheme?: null
  setHeaderTheme: (theme: null) => void
}

const initialContext: ContextType = {
  headerTheme: null,
  setHeaderTheme: () => null,
}

const HeaderThemeContext = createContext(initialContext)

export const HeaderThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <HeaderThemeContext value={initialContext}>{children}</HeaderThemeContext>
}

export const useHeaderTheme = (): ContextType => use(HeaderThemeContext)
