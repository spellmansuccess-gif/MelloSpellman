'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import {
  cartCreate,
  cartFetch,
  cartLinesAdd,
  cartLinesRemove,
  cartLinesUpdate,
} from '@/lib/queries'
import type { Cart } from '@/lib/shopify'

const CART_ID_KEY = 'mellospellman_cart_id'

interface CartContextValue {
  cart: Cart | null
  loading: boolean
  open: boolean
  setOpen: (open: boolean) => void
  addItem: (merchandiseId: string, quantity?: number) => Promise<void>
  updateItem: (lineId: string, quantity: number) => Promise<void>
  removeItem: (lineId: string) => Promise<void>
  refresh: () => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const persistId = (id: string | null) => {
    if (typeof window === 'undefined') return
    if (id) localStorage.setItem(CART_ID_KEY, id)
    else localStorage.removeItem(CART_ID_KEY)
  }

  const refresh = useCallback(async () => {
    if (typeof window === 'undefined') return
    const id = localStorage.getItem(CART_ID_KEY)
    if (!id) {
      setCart(null)
      return
    }
    setLoading(true)
    try {
      const fresh = await cartFetch(id)
      if (!fresh) {
        // Cart expired or was deleted on Shopify's side.
        persistId(null)
        setCart(null)
      } else {
        setCart(fresh)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // Load once on mount.
  useEffect(() => {
    refresh()
  }, [refresh])

  const addItem = useCallback(async (merchandiseId: string, quantity = 1) => {
    setLoading(true)
    try {
      const existingId =
        typeof window !== 'undefined' ? localStorage.getItem(CART_ID_KEY) : null
      let next: Cart
      if (existingId) {
        try {
          next = await cartLinesAdd(existingId, merchandiseId, quantity)
        } catch (err) {
          // Stale cart id — create a fresh one.
          console.warn('cartLinesAdd failed, creating new cart:', (err as Error).message)
          next = await cartCreate(merchandiseId, quantity)
          persistId(next.id)
        }
      } else {
        next = await cartCreate(merchandiseId, quantity)
        persistId(next.id)
      }
      setCart(next)
      setOpen(true)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateItem = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) return
      setLoading(true)
      try {
        if (quantity <= 0) {
          const next = await cartLinesRemove(cart.id, [lineId])
          setCart(next)
        } else {
          const next = await cartLinesUpdate(cart.id, lineId, quantity)
          setCart(next)
        }
      } finally {
        setLoading(false)
      }
    },
    [cart],
  )

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cart) return
      setLoading(true)
      try {
        const next = await cartLinesRemove(cart.id, [lineId])
        setCart(next)
      } finally {
        setLoading(false)
      }
    },
    [cart],
  )

  return (
    <CartContext.Provider
      value={{ cart, loading, open, setOpen, addItem, updateItem, removeItem, refresh }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within <CartProvider>')
  return ctx
}
