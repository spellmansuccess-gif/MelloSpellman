import Hero from '@/components/Hero'
import Section from '@/components/Section'
import ProductGrid from '@/components/ProductGrid'
import { fetchProducts } from '@/lib/queries'

export const revalidate = 60

export default async function HomePage() {
  const products = await fetchProducts(8)

  return (
    <>
      <Hero />

      <Section
        eyebrow="The current edition"
        title="Featured"
        intro="A small, careful selection from the current season."
      >
        <ProductGrid
          products={products}
          emptyMessage="The new collection is in final fittings. Check back shortly."
        />
      </Section>

      <Section eyebrow="The house" title="Of restraint and ritual" align="center">
        <div className="max-w-2xl mx-auto text-ivory/70 text-lg space-y-4 text-center">
          <p>
            MelloSpellman is a small house. Every garment is cut from a single
            length, finished by hand, numbered, and signed.
          </p>
          <p>
            We release in editions. When a piece is gone, it stays gone.
          </p>
        </div>
        <div className="mt-10 text-center">
          <a href="/story" className="btn btn-ghost">
            Read our story
          </a>
        </div>
      </Section>
    </>
  )
}
