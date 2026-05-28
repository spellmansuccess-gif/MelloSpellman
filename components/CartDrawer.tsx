'use client'

import Image from 'next/image'
import { useEffect } from 'react'
import { useCart } from './CartProvider'
import { formatMoney } from '@/lib/shopify'

export default function CartDrawer() {
  const { cart, open, setOpen, updateItem, removeItem, loading } = useCart()

  // Close on Escape.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-[60] transition-opacity duration-300 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <button
        aria-label="Close cart"
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <aside
        role="dialog"
        aria-label="Shopping bag"
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-ink border-l border-ivory/10 shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between px-6 py-5 border-b border-ivory/10">
          <h2 className="font-display text-2xl">Your bag</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-[11px] uppercase tracking-[0.22em] text-ivory/70 hover:text-gold"
          >
            Close
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {!cart || cart.lines.edges.length === 0 ? (
            <div className="text-center py-20 text-ivory/50">
              <p>Your bag is empty.</p>
            </div>
          ) : (
            <ul className="space-y-6">
              {cart.lines.edges.map(({ node: line }) => {
                const img =
                  line.merchandise.image ?? line.merchandise.product.featuredImage
                return (
                  <li key={line.id} className="flex gap-4">
                    <div className="relative w-20 h-24 bg-ink/40 border border-ivory/10 flex-shrink-0">
                      {img && (
                        <Image
                          src={img.url}
                          alt={img.altText ?? line.merchandise.product.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-base leading-tight">
                        {line.merchandise.product.title}
                      </p>
                      {line.merchandise.title !== 'Default Title' && (
                        <p className="text-xs text-ivory/60 mt-1">
                          {line.merchandise.title}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-3 text-sm">
                        <button
                          type="button"
                          onClick={() => updateItem(line.id, Math.max(0, line.quantity - 1))}
                          className="w-7 h-7 border border-ivory/20 hover:border-gold hover:text-gold"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-6 text-center tabular-nums">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateItem(line.id, line.quantity + 1)}
                          className="w-7 h-7 border border-ivory/20 hover:border-gold hover:text-gold"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(line.id)}
                          className="ml-auto text-xs uppercase tracking-[0.18em] text-ivory/50 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <p className="text-sm tabular-nums text-ivory/80">
                      {formatMoney(line.cost.totalAmount)}
                    </p>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {cart && cart.lines.edges.length > 0 && (
          <footer className="border-t border-ivory/10 px-6 py-6 space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-[11px] uppercase tracking-[0.22em] text-ivory/60">
                Subtotal
              </span>
              <span className="text-lg tabular-nums">
                {formatMoney(cart.cost.subtotalAmount)}
              </span>
            </div>
            <a
              href={cart.checkoutUrl}
              className={`btn btn-primary w-full ${loading ? 'opacity-60' : ''}`}
            >
              Checkout
            </a>
            <p className="text-[11px] text-ivory/50 text-center">
              Taxes and shipping calculated at checkout.
            </p>
          </footer>
        )}
      </aside>
    </div>
  )
}
