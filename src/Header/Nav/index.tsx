'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Button } from '@/components/ui/button'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex gap-3 items-center">
      <div className="flex gap-3 items-center mr-4">
        {navItems.map(({ link }, i) => {
          return <CMSLink key={i} {...link} appearance="link" />
        })}
      </div>
      <Button>Donate Now</Button>
    </nav>
  )
}
