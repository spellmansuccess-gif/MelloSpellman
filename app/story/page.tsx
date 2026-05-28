import Section from '@/components/Section'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Story',
  description: 'The house of MelloSpellman — heritage, craft, restraint.',
}

export default function StoryPage() {
  return (
    <Section eyebrow="The house" title="Our story" align="center">
      <div className="max-w-2xl mx-auto text-ivory/75 text-lg space-y-6 text-center">
        <p>
          MelloSpellman began in a single room above a tailor&rsquo;s shop in
          lower Manhattan. The brief was simple: clothing for the long quiet —
          garments built for the kind of life lived between obligations, with
          nothing wasted and nothing rushed.
        </p>
        <div className="divider mx-auto" />
        <p>
          We work in editions. A pattern is drawn, a cloth is chosen, and a
          run of fifty or one hundred is cut. When the run is finished, the
          pattern goes into the archive. We do not re-release.
        </p>
        <p>
          Every piece is finished by hand in New York, signed in the seam,
          and numbered. The number on your label is the number on our ledger.
        </p>
        <div className="divider mx-auto" />
        <p>
          We choose materials slowly. Most come from mills that have run for a
          century or more. Where we can, we use deadstock. Where we can&rsquo;t,
          we work with our cloth merchants to commission small custom orders.
        </p>
        <p>
          The result is small and we mean it to stay that way.
        </p>
      </div>
    </Section>
  )
}
