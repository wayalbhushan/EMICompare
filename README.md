# EMICompare

## 1. Overview
EMICompare is a full-stack web application featuring dynamic smartphone product pages with multi-tier EMI plans backed by mutual funds. It demonstrates a robust relational database design and API integration, ensuring all product and pricing data is fetched dynamically from a live PostgreSQL database rather than being hardcoded. 

## 2. Live Links
- **Deployed app:** https://emi-compare.vercel.app
- **Demo video:** https://youtu.be/ntwk34SzBO0
- **GitHub repo:** https://github.com/wayalbhushan/EMICompare

## 3. Tech Stack
- **Next.js 14 (App Router)** — single codebase for frontend + API routes, server-rendered product pages
- **TypeScript** — type safety across API responses and components
- **Prisma 6.19 + PostgreSQL** — relational schema fits the Product → Variant → EMIPlan data shape (fixed fields, real foreign-key relationships, not document-shaped data)
- **Tailwind CSS** — utility-first styling, custom design tokens for the color/spacing system used throughout
- **Vercel & Neon** — Deployed on Vercel, database hosted on Neon (cloud Postgres from day one — avoids local-vs-prod environment drift)

## 4. Schema
```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Product {
  id          String    @id @default(cuid())
  slug        String    @unique
  name        String
  brand       String?
  category    String?
  description String?
  createdAt   DateTime  @default(now())
  variants    Variant[]
}

model Variant {
  id          String    @id @default(cuid())
  productId   String
  product     Product   @relation(fields: [productId], references: [id])
  color       String?
  storage     String?
  sku         String    @unique
  mrp         Decimal   @db.Decimal(10, 2)
  price       Decimal   @db.Decimal(10, 2)
  imageUrl    String
  createdAt   DateTime  @default(now())
  emiPlans    EMIPlan[]

  @@unique([productId, color, storage])
}

model EMIPlan {
  id             String    @id @default(cuid())
  variantId      String
  variant        Variant   @relation(fields: [variantId], references: [id])
  tenureMonths   Int
  interestRate   Decimal   @db.Decimal(4, 2)
  monthlyAmount  Decimal   @db.Decimal(10, 2)
  cashbackAmount Decimal?  @db.Decimal(10, 2)
  createdAt      DateTime  @default(now())

  @@unique([variantId, tenureMonths])
}
```
- EMI plans belong to Variant, not Product (price differs by variant, so EMI amount must be tied to variant price)
- Decimal type used for all money fields, not Float, to avoid floating point rounding errors on currency
- `@@unique` constraints on `(productId, color, storage)` and `(variantId, tenureMonths)` enforce data integrity at the DB level, not just app-level validation

## 5. Setup and Run Instructions
**Prerequisites:** Node.js (v22.20.0 used for development) and `npm`.

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/wayalbhushan/EMICompare.git
   cd EMICompare
   npm install
   ```
2. **Setup environment variables:**
   Create a `.env` file at the project root. The `DATABASE_URL` needs a real Postgres connection string (e.g. from Neon's free tier).
   ```env
   DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
   ```
3. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```
4. **Deploy database schema:**
   ```bash
   npx prisma migrate deploy
   ```
   *(Note: `migrate deploy` applies existing migrations cleanly to a fresh database environment. `migrate dev` is strictly for generating new migrations during active local development.)*
5. **Seed the database:**
   ```bash
   npx prisma db seed
   ```
6. **Start the application:**
   ```bash
   npm run dev
   ```
   The application will start on `http://localhost:3000`.

## 6. API Endpoints

### Get All Products
- **Method & Path:** `GET /api/products`
- **Description:** Returns a summarized list of all products, dynamically computing the starting price and pulling the default image.
- **Example Response:**
```json
[
  {
    "id": "cmtk95e1o0000wzmsu3lmm2vc",
    "slug": "iphone-17-pro",
    "name": "iPhone 17 Pro",
    "brand": "Apple",
    "startingPrice": 127400,
    "image": "/images/iph17p-256.jpg"
  },
  {
    "id": "cmtk98c41000xwzmsdl4begsm",
    "slug": "galaxy-s24-ultra",
    "name": "Galaxy S24 Ultra",
    "brand": "Samsung",
    "startingPrice": 119999,
    "image": "/images/s24u-256.jpg"
  },
  {
    "id": "cmtk9amya001uwzmsxa9cgauf",
    "slug": "oneplus-13",
    "name": "OnePlus 13",
    "brand": "OnePlus",
    "startingPrice": 64999,
    "image": "/images/op13-256.jpg"
  }
]
```

### Get Product Details
- **Method & Path:** `GET /api/products/[slug]`
- **Description:** Retrieves the full, deeply nested dataset for a specific product, including its variants and EMI plans.
- **Example Response (Success):**
```json
{
  "id": "cmtk95e1o0000wzmsu3lmm2vc",
  "slug": "iphone-17-pro",
  "name": "iPhone 17 Pro",
  "brand": "Apple",
  "category": null,
  "description": "A19 Pro chip for pro-level performance. Titanium design, built to last. Pro camera system with 5x telephoto.",
  "variants": [
    {
      "id": "cmtk95iyw0002wzmsboenzbqf",
      "color": null,
      "storage": "256GB",
      "mrp": 134900,
      "price": 127400,
      "imageUrl": "/images/iph17p-256.jpg",
      "emiPlans": [
        {
          "id": "cmtk95s040004wzms488kja0o",
          "tenureMonths": 3,
          "interestRate": 0,
          "monthlyAmount": 42467,
          "cashbackAmount": 7500
        },
        {
          "id": "cmtk95ydt0006wzmsigyzzn1u",
          "tenureMonths": 6,
          "interestRate": 0,
          "monthlyAmount": 21233,
          "cashbackAmount": 7500
        }
      ]
    }
  ]
}
```
- **Example Response (404 Not Found):**
```json
{
  "error": "Product not found"
}
```

## 7. Known Limitations
- No checkout/payment flow — assignment scope is limited to displaying and selecting a plan, "Proceed" shows a confirmation state only, no backend order processing exists
- Single currency (INR) assumed, not configurable
- EMI amounts are precomputed and stored, not calculated live from a formula at request time
- Trust-signal badges ("Backed by mutual funds," "Instant approval") are generic UI elements for this demo, not claims about a real service
- Product images sourced from manufacturer press assets for demo purposes only, not licensed for production/commercial use

## 8. Project Structure
- `src/app/` — Contains the Next.js App Router structure, including the main page, dynamic routes, and backend API handlers.
- `src/components/` — Contains the React UI components, specifically the interactive `ProductDetail` client component.
- `src/lib/` — Houses shared utility functions and the Prisma database singleton.
- `prisma/` — Holds the PostgreSQL database schema, migrations, and the seed script for initializing data.
