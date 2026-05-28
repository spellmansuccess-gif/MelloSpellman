import type { ReactNode } from 'react'

interface SectionProps {
  eyebrow?: string
  title?: string
  intro?: string
  align?: 'left' | 'center'
  className?: string
  children?: ReactNode
}

export default function Section({
  eyebrow,
  title,
  intro,
  align = 'left',
  className = '',
  children,
}: SectionProps) {
  return (
    <section className={`py-20 md:py-28 border-t border-ivory/10 ${className}`}>
      <div className="container-site">
        {(eyebrow || title || intro) && (
          <header
            className={`mb-12 md:mb-16 ${align === 'center' ? 'text-center max-w-2xl mx-auto' : 'max-w-2xl'}`}
          >
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            {title && (
              <h2 className="mt-3 text-4xl md:text-5xl leading-[1.05]">{title}</h2>
            )}
            {intro && <p className="mt-5 text-ivory/70 text-lg">{intro}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  )
}
