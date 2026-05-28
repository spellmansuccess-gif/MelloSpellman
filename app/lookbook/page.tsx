import Section from '@/components/Section'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lookbook',
  description: 'Editorial imagery from the current season.',
}

export default function LookbookPage() {
  return (
    <Section
      eyebrow="Editorial"
      title="Lookbook"
      intro="Cuts and silhouettes from the current season. Photographed in studio."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="relative aspect-[4/5] bg-gradient-to-b from-ivory/[0.04] to-transparent border border-ivory/10 flex items-center justify-center"
          >
            <span className="text-ivory/30 text-xs uppercase tracking-widest2">
              Plate {String(i).padStart(2, '0')}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-12 text-center text-ivory/50 text-sm">
        New imagery published with each release.
      </p>
    </Section>
  )
}
