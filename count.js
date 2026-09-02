const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const products = await prisma.product.count();
  const variants = await prisma.variant.count();
  const emi_plans = await prisma.eMIPlan.count();
  console.log(`products=${products}, variants=${variants}, emi_plans=${emi_plans}`);
}
main().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1)});
