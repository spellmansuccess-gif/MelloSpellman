import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ivory/10 bg-ink">
      <div className="container-site py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="/logo-gold.png"
              alt="MelloSpellman crest"
              width={80}
              height={80}
              className="h-9 w-auto"
            />
            <span className="font-display text-xl text-gold">MelloSpellman</span>
          </div>
          <p className="text-ivory/60 text-sm max-w-xs">
            Heritage menswear. Made in small numbered runs. Designed in New York,
            cut by hand.
          </p>
        </div>

        <FooterCol title="Shop">
          <FooterLink href="/shop">All garments</FooterLink>
          <FooterLink href="/lookbook">Lookbook</FooterLink>
        </FooterCol>

        <FooterCol title="House">
          <FooterLink href="/story">Our story</FooterLink>
          <FooterLink href="/contact">Contact</FooterLink>
        </FooterCol>

        <FooterCol title="Service">
          <FooterLink href="/contact">Returns &amp; care</FooterLink>
          <FooterLink href="mailto:hello@mellospellman.com">Email us</FooterLink>
        </FooterCol>
      </div>
      <div className="border-t border-ivory/10">
        <div className="container-site py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[11px] uppercase tracking-[0.22em] text-ivory/50">
          <span>© {new Date().getFullYear()} MelloSpellman</span>
          <span>Made in New York</span>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-[11px] uppercase tracking-[0.22em] text-gold mb-4 font-body font-medium">
        {title}
      </h4>
      <ul className="space-y-2 text-sm text-ivory/70">{children}</ul>
    </div>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="hover:text-gold">
        {children}
      </Link>
    </li>
  )
}
