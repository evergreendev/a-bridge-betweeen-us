import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import { Facebook, Instagram, Mail } from 'lucide-react'

import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []
  // `rightColumn` is a new optional rich text field added to the Footer global
  const rightColumn = (footerData)?.rightColumn

  return (
    <footer className="mt-auto border-t border-border bg-white text-black">
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-3 center">
          {/* Left column: logo + nav */}
          <div className="flex flex-col gap-4">
            {/* Donate button */}
            {footerData?.donate && (
              <CMSLink
                appearance="default"
                className="w-fit z-10"
                label="Donate"
                {...footerData.donate}
              />
            )}
            {/* Social icons */}
            <div className="flex items-center gap-4 text-muted-foreground">
              {footerData?.facebook && (
                <a
                  href={footerData.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="hover:text-foreground transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {footerData?.instagram && (
                <a
                  href={footerData.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="hover:text-foreground transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {footerData?.email && (
                <a
                  href={`mailto:${footerData.email}`}
                  aria-label="Email"
                  className="hover:text-foreground transition-colors"
                >
                  <Mail className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 justify-center">
            <nav className="flex flex-col md:flex-row gap-4 md:items-center">
              {navItems.map(({ link }, i) => {
                return <CMSLink className="" key={i} {...link} />
              })}
            </nav>
          </div>

          {/* Right column: rich text (optional) */}
          {rightColumn && (
            <div className="flex flex-col justify-center">
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
