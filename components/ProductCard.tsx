import Image from 'next/image'
import Link from 'next/link'
import { formatMoney, type Product } from '@/lib/shopify'

export default function ProductCard({ product }: { product: Product }) {
  const img = product.featuredImage
  const price = product.priceRange.minVariantPrice

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group block"
      aria-label={product.title}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-ink/40 border border-ivory/10">
        {img ? (
          <Image
            src={img.url}
            alt={img.altText ?? product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ivory/30 text-xs uppercase tracking-widest2">
            No image
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-display group-hover:text-gold transition-colors">
          {product.title}
        </h3>
        <p className="mt-1 text-sm text-ivory/60">{formatMoney(price)}</p>
      </div>
    </Link>
  )
}
