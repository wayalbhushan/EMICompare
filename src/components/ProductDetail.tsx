'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { Product } from '@/app/products/[slug]/page'

interface Props {
  product: Product
}

function formatINR(amount: number) {
  return amount.toLocaleString('en-IN')
}

export default function ProductDetail({ product }: Props) {
  const { variants } = product

  const [selectedVariantId, setSelectedVariantId] = useState(variants[0]?.id ?? '')
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  const selectedVariant = variants.find((v) => v.id === selectedVariantId) ?? variants[0]

  // Determine which attribute varies across variants
  const hasStorageVariants = variants.some((v) => v.storage !== null)
  const hasColorVariants = variants.some((v) => v.color !== null)

  function handleVariantChange(variantId: string) {
    setSelectedVariantId(variantId)
    setSelectedPlanId(null) // clear plan selection when variant changes
    setConfirmed(false)
  }

  function handlePlanSelect(planId: string) {
    setSelectedPlanId(planId)
    setConfirmed(false)
  }

  function handleProceed() {
    const plan = selectedVariant.emiPlans.find((p) => p.id === selectedPlanId)
    if (!plan) return
    setConfirmed(true)
  }

  const selectedPlan = selectedVariant.emiPlans.find((p) => p.id === selectedPlanId)

  return (
    <div>
      {/* Back link */}
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text mb-8 transition-colors">
        ← All products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-8 lg:gap-12">
        {/* ── LEFT COLUMN ── */}
        <div className="flex flex-col gap-6">
          {/* Product image */}
          <div className="relative w-full aspect-square bg-surface border border-border rounded-lg overflow-hidden">
            <Image
              src={selectedVariant.imageUrl}
              alt={`${product.name} – ${selectedVariant.storage ?? selectedVariant.color ?? ''}`}
              fill
              priority
              className="object-contain p-8"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </div>

          {/* Variant selector */}
          {variants.length > 1 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
                {hasStorageVariants ? 'Storage' : 'Color'}
              </p>
              <div className="flex flex-wrap gap-2">
                {hasColorVariants && !hasStorageVariants
                  ? // Color swatches
                    variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => handleVariantChange(v.id)}
                        title={v.color ?? ''}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          v.id === selectedVariantId
                            ? 'border-accent scale-110'
                            : 'border-border hover:border-text-muted'
                        }`}
                        style={{ backgroundColor: v.color ?? '#ccc' }}
                      />
                    ))
                  : // Storage pills
                    variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => handleVariantChange(v.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                          v.id === selectedVariantId
                            ? 'border-accent bg-accent-light text-accent border-2'
                            : 'border-border bg-surface text-text hover:border-text-muted'
                        }`}
                      >
                        {v.storage}
                      </button>
                    ))}
              </div>
            </div>
          )}

          {/* Product name and price */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-text-muted uppercase tracking-wide">{product.brand}</p>
            <h1 className="text-3xl font-bold text-text tracking-wide">{product.name}</h1>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="tabular text-2xl font-bold text-text">₹{formatINR(selectedVariant.price)}</span>
              <span className="tabular text-base text-text-muted line-through">₹{formatINR(selectedVariant.mrp)}</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-widest">EMI Plans</p>

          {/* EMI plan list */}
          <div className="flex flex-col gap-2">
            {selectedVariant.emiPlans.map((plan) => {
              const isSelected = plan.id === selectedPlanId
              return (
                <div
                  key={plan.id}
                  onClick={() => handlePlanSelect(plan.id)}
                  className={`flex items-start gap-4 p-4 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-accent-light border-2 border-accent'
                      : 'bg-surface border border-border hover:border-text-muted'
                  }`}
                >
                  {/* Radio circle */}
                  <div
                    className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected ? 'border-accent bg-accent' : 'border-border bg-surface'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>

                  {/* Plan info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="tabular text-lg font-semibold text-text">
                        ₹{formatINR(plan.monthlyAmount)}/mo
                      </span>
                      {/* Interest badge */}
                      {plan.interestRate === 0 ? (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green/10 text-green">
                          0% interest
                        </span>
                      ) : (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-text-muted/10 text-text-muted">
                          {plan.interestRate}% interest
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-muted mt-0.5">{plan.tenureMonths} months</p>
                    {plan.cashbackAmount !== null && (
                      <p className="text-xs text-green mt-1 font-medium">
                        +₹{formatINR(plan.cashbackAmount)} cashback
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Sticky CTA */}
          <div className="sticky bottom-4 mt-2">
            {confirmed && selectedPlan ? (
              <div className="w-full rounded-lg p-4 bg-accent-light border border-accent text-center">
                <p className="text-sm font-semibold text-accent">
                  ✓ Plan selected: ₹{formatINR(selectedPlan.monthlyAmount)}/mo × {selectedPlan.tenureMonths} months
                </p>
                <p className="text-xs text-text-muted mt-1">Checkout flow coming soon.</p>
              </div>
            ) : (
              <button
                onClick={handleProceed}
                disabled={!selectedPlanId}
                className={`w-full py-4 rounded-lg text-sm font-semibold transition-all ${
                  selectedPlanId
                    ? 'bg-accent text-white cursor-pointer hover:opacity-90'
                    : 'bg-accent text-white opacity-40 cursor-not-allowed'
                }`}
              >
                Proceed with this plan
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
