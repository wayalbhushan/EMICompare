import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { serializeDecimal } from '@/lib/serialize'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        variants: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    const payload = products.map((product) => {
      let startingPrice = 0
      let image = ''
      
      if (product.variants && product.variants.length > 0) {
        // Calculate min price using toNumber()
        startingPrice = Math.min(...product.variants.map(v => v.price.toNumber()))
        image = product.variants[0].imageUrl
      }
      
      return {
        id: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        startingPrice,
        image
      }
    })

    return NextResponse.json(serializeDecimal(payload))
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
