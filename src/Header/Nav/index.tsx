'use client'

import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const [open, setOpen] = useState(false)

  const handleClose = () => setOpen(false)

  return (
    <nav className="relative flex w-full items-center gap-3">
      {/* Desktop nav */}
      <div className="hidden md:flex w-full items-center justify-between gap-3 mr-2">
        {navItems.map(({ link }, i) => {
          return <CMSLink key={i} className="text-2xl uppercase" {...link} appearance="link" />
        })}
        <CMSLink appearance={"default"} url={'/donate'}>
          Donate Now
        </CMSLink>
      </div>

      {/* Mobile toggle */}
      <button
        aria-label="Toggle menu"
        className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-white text-black hover:bg-accent"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-md border border-border bg-white p-2 shadow-lg md:hidden z-50">
          <div className="flex flex-col">
            {navItems.map(({ link }, i) => (
              <CMSLink
                key={i}
                {...link}
                appearance="link"
                className="py-2 px-2 text-left"
                onClick={handleClose}
              />
            ))}
            <div className="border-t my-2" />
            <CMSLink appearance={"default"} url={'/donate'} className="mx-2"
                     onClick={handleClose}>
              Donate Now
            </CMSLink>
          </div>
        </div>
      )}
    </nav>
  )
}
