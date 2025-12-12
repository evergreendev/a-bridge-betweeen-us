"use client"

import React, { useEffect } from 'react'

import type { DonationBlock as DonationBlockProps } from '@/payload-types'
import { cn } from '@/utilities/ui'

export function DonationBlock(props: DonationBlockProps & { className?: string }) {
  const { className } = props

  useEffect(() => {
    if (typeof window === 'undefined') return
    const src = 'https://secure.givelively.org/widgets/branded_donation/a-bridge-between-us.js'
    const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null
    if (!existing) {
      const gl = document.createElement('script')
      gl.src = src
      gl.async = true
      document.getElementsByTagName('head')[0].appendChild(gl)
    }
  }, [])

  return (
    <div className={cn('container', className)}>
      {/* Give Lively branded donation widget target */}
      <div
        id="give-lively-widget"
        className="gl-branded-donation-widget"
        data-widget-src="https://secure.givelively.org/donate/a-bridge-between-us?ref=sd_widget"
      />
    </div>
  )
}
