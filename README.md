# EMICompare

A full-stack web application that displays products (smartphones) with multiple EMI plans backed by mutual funds. Built as an assignment to demonstrate frontend UI/UX, backend API design, and database integration.

## Tech Stack

- **Frontend:** Next.js 14+ (App Router), React, Tailwind CSS
- **Backend:** Next.js Route Handlers (Node.js)
- **Database:** PostgreSQL (hosted on Neon)
- **ORM:** Prisma

## Setup and Run Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd emi-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up the environment variables:**
   Create a `.env` file in the root directory and add your PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://user:password@host:port/database"
   ```

4. **Initialize the database:**
   Push the Prisma schema to your database and run the seed script to populate products and EMI plans.
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser.

## Database Schema

The database uses PostgreSQL with three main relational models:

- **Product:** Stores core details (`id`, `slug`, `name`, `brand`, `category`, `description`).
- **Variant:** Stores variations of a product (`productId`, `color`, `storage`, `sku`, `mrp`, `price`, `imageUrl`). Links to Product via 1-to-many.
- **EMIPlan:** Stores the available financing options for each variant (`variantId`, `tenureMonths`, `interestRate`, `monthlyAmount`, `cashbackAmount`). Links to Variant via 1-to-many.

You can view the full schema in `prisma/schema.prisma`.

## API Endpoints

### 1. Get All Products
Retrieves a summary list of all products, calculating the starting price and default image.
- **Endpoint:** `GET /api/products`
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
    }
  ]
  ```

### 2. Get Single Product Details
Retrieves detailed information for a specific product, including all its variants and associated EMI plans.
- **Endpoint:** `GET /api/products/:slug`
- **Example Response:**
  ```json
  {
    "id": "cmtk95e1o0000wzmsu3lmm2vc",
    "slug": "iphone-17-pro",
    "name": "iPhone 17 Pro",
    "brand": "Apple",
    "category": null,
    "description": "A19 Pro chip for pro-level performance...",
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
          }
        ]
      }
    ]
  }
  ```
