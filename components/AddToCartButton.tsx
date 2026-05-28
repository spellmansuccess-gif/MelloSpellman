'use client'

import { useState } from 'react'
import { useCart } from './CartProvider'

interface Props {
  merchandiseId: string
  available: boolean
  label?: string
}

export default function AddToCartButton({
  merchandiseId,
  available,
  label = 'Add to bag',
}: Props) {
  const { addItem, loading } = useCart()
  const [working, setWorking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    if (!available || working || loading) return
    setError(null)
    setWorking(true)
    try {
      await addItem(merchandiseId, 1)
    } catch (err) {
      setError((err as Error).message || 'Something went wrong.')
    } finally {
      setWorking(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={!available || working || loading}
        className={`btn btn-primary w-full ${(!available || working || loading) ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        {!available ? 'Sold out' : working ? 'Adding…' : label}
      </button>
      {error && (
        <p className="mt-3 text-sm text-red-300/90" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
