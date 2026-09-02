import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import ProductDetail from '@/components/ProductDetail'

interface EMIPlan {
  id: string
  tenureMonths: number
  interestRate: number
  monthlyAmount: number
  cashbackAmount: number | null
}

interface Variant {
  id: string
  color: string | null
  storage: string | null
  mrp: number
  price: number
  imageUrl: string
  emiPlans: EMIPlan[]
}

export interface Product {
  id: string
  slug: string
  name: string
  brand: string
  category: string | null
  description: string | null
  variants: Variant[]
}

async function getProduct(slug: string): Promise<Product | null> {
  const hdrs = await headers()
  const host = hdrs.get('host') ?? 'localhost:3000'
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  const res = await fetch(`${protocol}://${host}/api/products/${slug}`, { cache: 'no-store' })
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to fetch product')
  return res.json()
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let product: Product | null = null
  let error: string | null = null

  try {
    product = await getProduct(slug)
  } catch {
    error = 'Could not load this product. Please try again later.'
  }

  if (error) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-12">
        <p className="text-text-muted">{error}</p>
      </main>
    )
  }

  if (!product) {
    notFound()
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <ProductDetail product={product} />
    </main>
  )
}
