'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const pathname = usePathname()

  return (
    <header className="relative z-20 bg-white text-black">
      <div className="container relative z-20 bg-white text-black">
        <div className="py-2 flex justify-between">
          <Link href="/">
            <Logo loading="eager" priority="high"/>
          </Link>
          <HeaderNav data={data} />
        </div>
      </div>

    </header>
  )
}
