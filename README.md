# EMICompare

A full-stack web application that displays smartphones with multiple EMI plans backed by mutual funds, similar to [Snapmint](https://snapmint.com). Built as the 1Fi SDE1 Assignment.

## Live Demo

> Deploy to Vercel and add your link here.

## Tech Stack

| Layer     | Technology                               |
|-----------|------------------------------------------|
| Frontend  | Next.js 14+ (App Router), React, Tailwind CSS |
| Backend   | Next.js Route Handlers (Node.js)         |
| Database  | PostgreSQL (hosted on Neon)              |
| ORM       | Prisma 6                                 |

---

## Setup and Run Instructions

### 1. Clone the repository
```bash
git clone https://github.com/wayalbhushan/EMICompare.git
cd EMICompare
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
```
> Get a free PostgreSQL database at [neon.tech](https://neon.tech).

### 4. Push schema to database
```bash
npx prisma db push
```

### 5. Seed the database with sample data
```bash
npx prisma db seed
```
This will populate the database with 3 products (iPhone 17 Pro, Galaxy S24 Ultra, OnePlus 13), 2 variants each (256GB and 512GB), and 7 EMI plans per variant (42 total).

### 6. Start the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Database Schema

Three models with 1-to-many relationships: `Product → Variant → EMIPlan`.

```prisma
model Product {
  id          String    @id @default(cuid())
  slug        String    @unique        // used for URL routing
  name        String
  brand       String?
  category    String?
  description String?
  createdAt   DateTime  @default(now())
  variants    Variant[]
}

model Variant {
  id        String    @id @default(cuid())
  productId String
  product   Product   @relation(fields: [productId], references: [id])
  color     String?
  storage   String?
  sku       String    @unique
  mrp       Decimal   @db.Decimal(10, 2)
  price     Decimal   @db.Decimal(10, 2)
  imageUrl  String
  createdAt DateTime  @default(now())
  emiPlans  EMIPlan[]

  @@unique([productId, color, storage])
}

model EMIPlan {
  id             String   @id @default(cuid())
  variantId      String
  variant        Variant  @relation(fields: [variantId], references: [id])
  tenureMonths   Int
  interestRate   Decimal  @db.Decimal(4, 2)
  monthlyAmount  Decimal  @db.Decimal(10, 2)
  cashbackAmount Decimal? @db.Decimal(10, 2)
  createdAt      DateTime @default(now())

  @@unique([variantId, tenureMonths])
}
```

---

## API Endpoints

### `GET /api/products`
Returns a summary list of all products with their starting price and image.

**Example Response:**
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

---

### `GET /api/products/:slug`
Returns full product details including all variants and their EMI plans.

**Example:** `GET /api/products/iphone-17-pro`

**Example Response:**
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

Returns `404` if the slug does not match any product.

---

## Next Steps (Remaining Deliverables)

There are two things left to submit this assignment:

### 1. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account.
2. Click **"Add New Project"** → Import `wayalbhushan/EMICompare`.
3. Under **Environment Variables**, add `DATABASE_URL` with your Neon connection string.
4. Click **Deploy**.
5. Copy the live URL (e.g., `https://emi-compare.vercel.app`) and add it at the top of this README.

### 2. Record a 2-5 Minute Demo Video
Cover the following in the video:
- [ ] Show the homepage listing all 3 products
- [ ] Click a product card to navigate to its unique URL (`/products/iphone-17-pro`)
- [ ] Switch between the 256GB and 512GB variants and show the price and EMI plans update
- [ ] Select an EMI plan and click "Proceed with this plan"
- [ ] Open the Network tab in DevTools and show the `/api/products` and `/api/products/:slug` API calls returning real data
- [ ] Open Neon (or any DB client) and show the seeded `Product`, `Variant`, and `EMIPlan` tables

Upload to Google Drive or YouTube (unlisted is fine) and make sure **anyone with the link can view**.

### 3. Submit the Form
Fill in the assignment submission form: [https://forms.gle/V4vqbcSAhJV7BqoAA](https://forms.gle/V4vqbcSAhJV7BqoAA) with:
- GitHub repo link: `https://github.com/wayalbhushan/EMICompare`
- Deployed demo link (after Vercel deploy)
- Video link
