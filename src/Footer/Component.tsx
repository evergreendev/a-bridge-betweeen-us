import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import RichText from '@/components/RichText'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []
  // `rightColumn` is a new optional rich text field added to the Footer global
  const rightColumn = (footerData)?.rightColumn

  return (
    <footer className="mt-auto border-t border-border bg-white text-black">
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Left column: logo + nav */}
          <div className="flex flex-col gap-4">
            <Link className="flex items-center" href="/">
              <Logo />
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            <nav className="flex flex-col md:flex-row gap-4 md:items-center">
              {navItems.map(({ link }, i) => {
                return <CMSLink className="" key={i} {...link} />
              })}
            </nav>
          </div>

          {/* Right column: rich text (optional) */}
          {rightColumn && (
            <div className="md:justify-self-end">
              <RichText
                data={rightColumn}
                enableGutter={false}
                className="prose-sm md:prose max-w-none"
              />
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
