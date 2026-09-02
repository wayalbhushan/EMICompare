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

    const payload = {
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      category: product.category,
      description: product.description,
      variants: product.variants.map((v) => ({
        id: v.id,
        color: v.color,
        storage: v.storage,
        mrp: v.mrp,
        price: v.price,
        imageUrl: v.imageUrl,
        emiPlans: v.emiPlans.map((plan) => ({
          id: plan.id,
          tenureMonths: plan.tenureMonths,
          interestRate: plan.interestRate,
          monthlyAmount: plan.monthlyAmount,
          cashbackAmount: plan.cashbackAmount,
        })),
      })),
    }

    return NextResponse.json(serializeDecimal(payload))
  } catch (error) {
    console.error('Failed to fetch product detail:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
