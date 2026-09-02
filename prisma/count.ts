import prisma from './src/lib/db';
async function run() {
  const products = await prisma.product.count();
  const variants = await prisma.variant.count();
  const emi_plans = await prisma.eMIPlan.count();
  console.log(`[ { products: ${products}, variants: ${variants}, emi_plans: ${emi_plans} } ]`);
}
run().catch(console.error).finally(()=>process.exit(0));
