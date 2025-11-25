import React from 'react'

type Props = {
  color?: 'blue' | 'red'
  className?: string
}

// Renders a 250px wide, 2px high horizontal divider, centered.
export default function Divider({ color = 'blue', className }: Props) {
  const colorClass = color === 'red' ? 'bg-brand-red' : 'bg-brand-blue'
  return (
    <div className={className}>
      <div className={`mx-auto h-[2px] w-[250px] ${colorClass}`} />
    </div>
  )
}
