import Section from '@/components/Section'
import ProductGrid from '@/components/ProductGrid'
import { fetchProducts } from '@/lib/queries'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Browse the MelloSpellman collection.',
}

export default async function ShopPage() {
  const products = await fetchProducts(24)

  return (
    <Section
      eyebrow="The collection"
      title="Shop"
      intro="Limited runs. Hand-finished. Numbered and signed."
    >
      <ProductGrid
        products={products}
        emptyMessage="No garments are currently listed. New pieces drop monthly."
      />
    </Section>
  )
}
