import ProductCard from './ProductCard'
import type { Product } from '@/lib/shopify'

export default function ProductGrid({
  products,
  emptyMessage = 'Nothing in this season just yet.',
}: {
  products: Product[]
  emptyMessage?: string
}) {
  if (products.length === 0) {
    return (
      <div className="py-24 text-center text-ivory/50">
        <p>{emptyMessage}</p>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
