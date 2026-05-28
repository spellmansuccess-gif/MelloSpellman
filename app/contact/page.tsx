import Section from '@/components/Section'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Reach the house of MelloSpellman.',
}

export default function ContactPage() {
  return (
    <Section eyebrow="The atelier" title="Contact" align="center">
      <div className="max-w-xl mx-auto text-center space-y-12 text-ivory/80">
        <div>
          <p className="eyebrow mb-2">Email</p>
          <a
            href="mailto:hello@mellospellman.com"
            className="text-2xl font-display hover:text-gold"
          >
            hello@mellospellman.com
          </a>
        </div>

        <div>
          <p className="eyebrow mb-2">Atelier</p>
          <address className="not-italic font-display text-lg leading-relaxed">
            MelloSpellman
            <br />
            New York, NY
          </address>
        </div>

        <div>
          <p className="eyebrow mb-2">Returns &amp; care</p>
          <p className="text-sm text-ivory/70 max-w-md mx-auto">
            Garments may be returned in unworn condition within thirty days of
            delivery. Care instructions are sewn into each piece — please follow
            them closely. We do not dry-clean unless instructed.
          </p>
        </div>
      </div>
    </Section>
  )
}
