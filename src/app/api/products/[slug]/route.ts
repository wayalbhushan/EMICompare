import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { serializeDecimal } from '@/lib/serialize'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        variants: {
          include: {
            emiPlans: {
              orderBy: { tenureMonths: 'asc' }
            }
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(serializeDecimal(product))
  } catch (error) {
    console.error('Failed to fetch product detail:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
