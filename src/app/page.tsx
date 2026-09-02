import Image from 'next/image'
import Link from 'next/link'
import { headers } from 'next/headers'

interface Product {
  id: string
  slug: string
  name: string
  brand: string
  startingPrice: number
  image: string
}

async function getProducts(): Promise<Product[]> {
  const hdrs = await headers()
  const host = hdrs.get('host') ?? 'localhost:3000'
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  const res = await fetch(`${protocol}://${host}/api/products`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export default async function HomePage() {
  let products: Product[] = []
  let error: string | null = null

  try {
    products = await getProducts()
  } catch {
    error = 'Could not load products. Please try again later.'
  }

  if (error) {
    return (
      <main className="max-w-[1400px] mx-auto px-8 py-12">
        <p className="text-text-muted">{error}</p>
      </main>
    )
  }

  return (
    <main className="max-w-[1400px] mx-auto px-8 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-text">EMICompare</h1>
        <p className="mt-2 text-text-muted">Compare EMI plans on the latest smartphones.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group block bg-surface border border-border rounded-lg overflow-hidden hover:border-text-muted transition-colors duration-150"
          >
            <div className="relative w-full aspect-square bg-bg">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-6"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <div className="p-4 border-t border-border">
              <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-1">
                {product.brand}
              </p>
              <h2 className="text-base font-semibold text-text mb-2">{product.name}</h2>
              <p className="text-sm text-text-muted">
                Starting from{' '}
                <span className="tabular font-bold text-text">
                  ₹{product.startingPrice.toLocaleString('en-IN')}
                </span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
