import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { fetchProductByHandle } from '@/lib/queries'
import { formatMoney } from '@/lib/shopify'
import AddToCartButton from '@/components/AddToCartButton'

export const revalidate = 60

interface PageProps {
  params: { handle: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await fetchProductByHandle(params.handle)
  if (!product) {
    return {
      title: 'Garment not found',
    }
  }
  const description =
    product.description?.slice(0, 200) ||
    `${product.title} — MelloSpellman heritage menswear.`
  const ogImage = product.featuredImage?.url
  return {
    title: product.title,
    description,
    openGraph: {
      title: product.title,
      description,
      type: 'website',
      images: ogImage
        ? [{ url: ogImage, alt: product.featuredImage?.altText ?? product.title }]
        : undefined,
    },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const product = await fetchProductByHandle(params.handle)
  if (!product) notFound()

  const firstVariant = product.variants.edges[0]?.node
  const price = firstVariant?.price ?? product.priceRange.minVariantPrice
  const gallery = product.images.edges.map((e) => e.node)
  const hero =
    product.featuredImage ??
    (gallery[0] ? gallery[0] : null)

  return (
    <article className="container-site py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        <div className="space-y-4">
          {hero && (
            <div className="relative aspect-[3/4] w-full bg-ink/40 border border-ivory/10 overflow-hidden">
              <Image
                src={hero.url}
                alt={hero.altText ?? product.title}
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          )}
          {gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {gallery.slice(0, 4).map((img, i) => (
                <div
                  key={img.id ?? i}
                  className="relative aspect-square bg-ink/40 border border-ivory/10 overflow-hidden"
                >
                  <Image
                    src={img.url}
                    alt={img.altText ?? `${product.title} view ${i + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:pt-4">
          {product.productType && (
            <span className="eyebrow">{product.productType}</span>
          )}
          <h1 className="mt-3 text-4xl md:text-5xl">{product.title}</h1>
          <p className="mt-3 text-2xl tabular-nums text-ivory/80">
            {formatMoney(price)}
          </p>

          {product.descriptionHtml ? (
            <div
              className="prose prose-invert max-w-none mt-8 text-ivory/75 space-y-3"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          ) : product.description ? (
            <p className="mt-8 text-ivory/75 whitespace-pre-line">
              {product.description}
            </p>
          ) : null}

          <div className="mt-10">
            {firstVariant ? (
              <AddToCartButton
                merchandiseId={firstVariant.id}
                available={firstVariant.availableForSale}
              />
            ) : (
              <p className="text-ivory/60">No variants available.</p>
            )}
          </div>

          <ul className="mt-12 grid grid-cols-2 gap-y-3 gap-x-6 text-sm text-ivory/60 border-t border-ivory/10 pt-8">
            <li>Hand-finished</li>
            <li>Numbered edition</li>
            <li>Free US shipping over $200</li>
            <li>30-day returns</li>
          </ul>
        </div>
      </div>
    </article>
  )
}
