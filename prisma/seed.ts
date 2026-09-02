import prisma from '../src/lib/db'

async function main() {
  console.log('Starting seed...')
  
  // --- Product 1: iPhone 17 Pro ---
  const iphone = await prisma.product.upsert({
    where: { slug: 'iphone-17-pro' },
    update: {},
    create: {
      slug: 'iphone-17-pro',
      name: 'iPhone 17 Pro',
      brand: 'Apple',
    },
  })

  const iph256 = await prisma.variant.upsert({
    where: { sku: 'IPH17P-256' },
    update: {},
    create: {
      productId: iphone.id,
      sku: 'IPH17P-256',
      storage: '256GB',
      mrp: 134900,
      price: 127400,
      imageUrl: '/images/iph17p-256.jpg',
    },
  })
  
  const iph256Plans = [
    { tenureMonths: 3, interestRate: 0, monthlyAmount: 42467, cashbackAmount: 7500 },
    { tenureMonths: 6, interestRate: 0, monthlyAmount: 21233, cashbackAmount: 7500 },
    { tenureMonths: 12, interestRate: 0, monthlyAmount: 10617, cashbackAmount: 7500 },
    { tenureMonths: 24, interestRate: 0, monthlyAmount: 5308, cashbackAmount: 7500 },
    { tenureMonths: 36, interestRate: 10.5, monthlyAmount: 4141, cashbackAmount: 7500 },
    { tenureMonths: 48, interestRate: 10.5, monthlyAmount: 3262, cashbackAmount: 7500 },
    { tenureMonths: 60, interestRate: 10.5, monthlyAmount: 2738, cashbackAmount: 7500 },
  ]
  for (const plan of iph256Plans) {
    await prisma.eMIPlan.upsert({
      where: { variantId_tenureMonths: { variantId: iph256.id, tenureMonths: plan.tenureMonths } },
      update: {},
      create: { variantId: iph256.id, ...plan },
    })
  }

  const iph512 = await prisma.variant.upsert({
    where: { sku: 'IPH17P-512' },
    update: {},
    create: {
      productId: iphone.id,
      sku: 'IPH17P-512',
      storage: '512GB',
      mrp: 154900,
      price: 146400,
      imageUrl: '/images/iph17p-512.jpg',
    },
  })
  const iph512Plans = [
    { tenureMonths: 3, interestRate: 0, monthlyAmount: 48800, cashbackAmount: 8500 },
    { tenureMonths: 6, interestRate: 0, monthlyAmount: 24400, cashbackAmount: 8500 },
    { tenureMonths: 12, interestRate: 0, monthlyAmount: 12200, cashbackAmount: 8500 },
    { tenureMonths: 24, interestRate: 0, monthlyAmount: 6100, cashbackAmount: 8500 },
    { tenureMonths: 36, interestRate: 10.5, monthlyAmount: 4758, cashbackAmount: 8500 },
    { tenureMonths: 48, interestRate: 10.5, monthlyAmount: 3748, cashbackAmount: 8500 },
    { tenureMonths: 60, interestRate: 10.5, monthlyAmount: 3147, cashbackAmount: 8500 },
  ]
  for (const plan of iph512Plans) {
    await prisma.eMIPlan.upsert({
      where: { variantId_tenureMonths: { variantId: iph512.id, tenureMonths: plan.tenureMonths } },
      update: {},
      create: { variantId: iph512.id, ...plan },
    })
  }

  // --- Product 2: Galaxy S24 Ultra ---
  const s24u = await prisma.product.upsert({
    where: { slug: 'galaxy-s24-ultra' },
    update: {},
    create: {
      slug: 'galaxy-s24-ultra',
      name: 'Galaxy S24 Ultra',
      brand: 'Samsung',
    },
  })

  const s24u256 = await prisma.variant.upsert({
    where: { sku: 'S24U-256' },
    update: {},
    create: {
      productId: s24u.id,
      sku: 'S24U-256',
      storage: '256GB',
      mrp: 129999,
      price: 119999,
      imageUrl: '/images/s24u-256.jpg',
    },
  })
  const s24u256Plans = [
    { tenureMonths: 3, interestRate: 0, monthlyAmount: 40000, cashbackAmount: 6500 },
    { tenureMonths: 6, interestRate: 0, monthlyAmount: 20000, cashbackAmount: 6500 },
    { tenureMonths: 12, interestRate: 0, monthlyAmount: 10000, cashbackAmount: 6500 },
    { tenureMonths: 24, interestRate: 0, monthlyAmount: 5000, cashbackAmount: 6500 },
    { tenureMonths: 36, interestRate: 10.5, monthlyAmount: 3900, cashbackAmount: 6500 },
    { tenureMonths: 48, interestRate: 10.5, monthlyAmount: 3072, cashbackAmount: 6500 },
    { tenureMonths: 60, interestRate: 10.5, monthlyAmount: 2579, cashbackAmount: 6500 },
  ]
  for (const plan of s24u256Plans) {
    await prisma.eMIPlan.upsert({
      where: { variantId_tenureMonths: { variantId: s24u256.id, tenureMonths: plan.tenureMonths } },
      update: {},
      create: { variantId: s24u256.id, ...plan },
    })
  }

  const s24u512 = await prisma.variant.upsert({
    where: { sku: 'S24U-512' },
    update: {},
    create: {
      productId: s24u.id,
      sku: 'S24U-512',
      storage: '512GB',
      mrp: 144999,
      price: 134999,
      imageUrl: '/images/s24u-512.jpg',
    },
  })
  const s24u512Plans = [
    { tenureMonths: 3, interestRate: 0, monthlyAmount: 45000, cashbackAmount: 7500 },
    { tenureMonths: 6, interestRate: 0, monthlyAmount: 22500, cashbackAmount: 7500 },
    { tenureMonths: 12, interestRate: 0, monthlyAmount: 11250, cashbackAmount: 7500 },
    { tenureMonths: 24, interestRate: 0, monthlyAmount: 5625, cashbackAmount: 7500 },
    { tenureMonths: 36, interestRate: 10.5, monthlyAmount: 4388, cashbackAmount: 7500 },
    { tenureMonths: 48, interestRate: 10.5, monthlyAmount: 3456, cashbackAmount: 7500 },
    { tenureMonths: 60, interestRate: 10.5, monthlyAmount: 2902, cashbackAmount: 7500 },
  ]
  for (const plan of s24u512Plans) {
    await prisma.eMIPlan.upsert({
      where: { variantId_tenureMonths: { variantId: s24u512.id, tenureMonths: plan.tenureMonths } },
      update: {},
      create: { variantId: s24u512.id, ...plan },
    })
  }

  // --- Product 3: OnePlus 13 ---
  const op13 = await prisma.product.upsert({
    where: { slug: 'oneplus-13' },
    update: {},
    create: {
      slug: 'oneplus-13',
      name: 'OnePlus 13',
      brand: 'OnePlus',
    },
  })

  const op13_256 = await prisma.variant.upsert({
    where: { sku: 'OP13-256' },
    update: {},
    create: {
      productId: op13.id,
      sku: 'OP13-256',
      storage: '256GB',
      mrp: 69999,
      price: 64999,
      imageUrl: '/images/op13-256.jpg',
    },
  })
  const op13_256Plans = [
    { tenureMonths: 3, interestRate: 0, monthlyAmount: 21666, cashbackAmount: 3000 },
    { tenureMonths: 6, interestRate: 0, monthlyAmount: 10833, cashbackAmount: 3000 },
    { tenureMonths: 12, interestRate: 0, monthlyAmount: 5417, cashbackAmount: 3000 },
    { tenureMonths: 24, interestRate: 0, monthlyAmount: 2708, cashbackAmount: 3000 },
    { tenureMonths: 36, interestRate: 10.5, monthlyAmount: 2113, cashbackAmount: 3000 },
    { tenureMonths: 48, interestRate: 10.5, monthlyAmount: 1664, cashbackAmount: 3000 },
    { tenureMonths: 60, interestRate: 10.5, monthlyAmount: 1397, cashbackAmount: 3000 },
  ]
  for (const plan of op13_256Plans) {
    await prisma.eMIPlan.upsert({
      where: { variantId_tenureMonths: { variantId: op13_256.id, tenureMonths: plan.tenureMonths } },
      update: {},
      create: { variantId: op13_256.id, ...plan },
    })
  }

  const op13_512 = await prisma.variant.upsert({
    where: { sku: 'OP13-512' },
    update: {},
    create: {
      productId: op13.id,
      sku: 'OP13-512',
      storage: '512GB',
      mrp: 74999,
      price: 69999,
      imageUrl: '/images/op13-512.jpg',
    },
  })
  const op13_512Plans = [
    { tenureMonths: 3, interestRate: 0, monthlyAmount: 23333, cashbackAmount: 3500 },
    { tenureMonths: 6, interestRate: 0, monthlyAmount: 11666, cashbackAmount: 3500 },
    { tenureMonths: 12, interestRate: 0, monthlyAmount: 5833, cashbackAmount: 3500 },
    { tenureMonths: 24, interestRate: 0, monthlyAmount: 2917, cashbackAmount: 3500 },
    { tenureMonths: 36, interestRate: 10.5, monthlyAmount: 2275, cashbackAmount: 3500 },
    { tenureMonths: 48, interestRate: 10.5, monthlyAmount: 1792, cashbackAmount: 3500 },
    { tenureMonths: 60, interestRate: 10.5, monthlyAmount: 1505, cashbackAmount: 3500 },
  ]
  for (const plan of op13_512Plans) {
    await prisma.eMIPlan.upsert({
      where: { variantId_tenureMonths: { variantId: op13_512.id, tenureMonths: plan.tenureMonths } },
      update: {},
      create: { variantId: op13_512.id, ...plan },
    })
  }

  console.log('Seed completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    // Let Next.js dev handle disconnection or we can do nothing since it's a singleton
    process.exit(0)
  })
