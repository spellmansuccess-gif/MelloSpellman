import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Vignette */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,152,90,0.10),transparent_60%)]"
      />
      <div className="container-site relative z-10 py-24 md:py-36 text-center">
        <div className="mx-auto mb-8 w-32 md:w-44">
          <Image
            src="/logo-gold.png"
            alt="MelloSpellman crest"
            width={520}
            height={520}
            priority
            className="w-full h-auto"
          />
        </div>
        <span className="eyebrow">Heritage · Craft · Restraint</span>
        <h1 className="mt-5 text-5xl md:text-7xl leading-[1.02]">
          The Mello<span className="text-gold">Spellman</span> Collection
        </h1>
        <p className="mt-6 max-w-xl mx-auto text-ivory/70 text-lg">
          Garments cut for the long quiet. Limited drops, archived seasons, gold
          on ink.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/shop" className="btn btn-primary">
            Shop the collection
          </Link>
          <Link href="/story" className="btn btn-ghost">
            Our story
          </Link>
        </div>
      </div>
    </section>
  )
}
