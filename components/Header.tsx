'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from './CartProvider'

const NAV = [
  { href: '/shop', label: 'Shop' },
  { href: '/lookbook', label: 'Lookbook' },
  { href: '/story', label: 'Story' },
  { href: '/contact', label: 'Contact' },
]

export default function Header() {
  const { cart, setOpen } = useCart()
  const count = cart?.totalQuantity ?? 0

  return (
    <header className="sticky top-0 z-50 border-b border-ivory/10 bg-ink/85 backdrop-blur">
      <nav
        className="container-site flex items-center justify-between h-16 md:h-20"
        aria-label="Primary"
      >
        <Link href="/" className="flex items-center gap-3" aria-label="MelloSpellman home">
          <Image
            src="/logo-ivory.png"
            alt="MelloSpellman crest"
            width={120}
            height={120}
            className="h-8 md:h-9 w-auto"
            priority
          />
          <span className="hidden sm:inline font-display text-xl tracking-wide">
            MelloSpellman
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-9 text-[12px] tracking-[0.22em] uppercase">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="text-ivory/80 hover:text-ivory">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="relative text-[12px] tracking-[0.22em] uppercase text-ivory/80 hover:text-gold transition-colors"
          onClick={() => setOpen(true)}
          aria-label={`Cart (${count} items)`}
        >
          Bag
          {count > 0 && (
            <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gold text-ink text-[10px] font-semibold px-1.5">
              {count}
            </span>
          )}
        </button>
      </nav>
    </header>
  )
}
