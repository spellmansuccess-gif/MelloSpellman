import Link from 'next/link'

export const metadata = {
  title: 'Not found',
}

export default function NotFound() {
  return (
    <section className="container-site py-32 text-center">
      <span className="eyebrow">404</span>
      <h1 className="mt-3 text-6xl">Not found</h1>
      <p className="mt-5 max-w-md mx-auto text-ivory/70">
        The page or garment you were looking for has been retired or moved.
      </p>
      <div className="mt-10">
        <Link href="/" className="btn btn-primary">
          Return home
        </Link>
      </div>
    </section>
  )
}
