import * as React from 'react'

export const Width: React.FC<{
  children: React.ReactNode
  className?: string
  width?: number | string
}> = ({ children, className = '', width }) => {
  // Normalize width to a number between 0 and 100
  const w = typeof width === 'string' ? parseFloat(width) : typeof width === 'number' ? width : 100
  const normalized = isNaN(w) ? 100 : Math.max(1, Math.min(100, w))

  // Convert percentage to 12-column grid span
  const span = Math.max(1, Math.min(12, Math.round((normalized / 100) * 12)))

  // Always full width on small screens, switch to computed span on md+
  const spanClass = `col-span-12 md:col-span-${span}`

  return <div className={`${spanClass} ${className}`}>{children}</div>
}
