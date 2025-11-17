'use client'

import React, { createContext, use, useEffect } from 'react'

import type { Theme, ThemeContextType } from './types'

import { defaultTheme } from './shared'

const initialContext: ThemeContextType = {
  setTheme: () => null,
  theme: undefined,
}

const ThemeContext = createContext(initialContext)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Light-only: lock the document theme to light and no-op setter
  const theme: Theme = 'light'
  const setTheme = () => null

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', defaultTheme)
  }, [])

  return <ThemeContext value={{ setTheme, theme }}>{children}</ThemeContext>
}

export const useTheme = (): ThemeContextType => use(ThemeContext)
