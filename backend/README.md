# Retail Sales Backend API

## Overview
Node.js/Express backend serving the Retail Sales Management System. Provides RESTful API endpoints for searching, filtering, sorting, and paginating sales data with PostgreSQL database persistence.

## Tech Stack
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Language:** JavaScript

## API Endpoints

### GET /api/sales
Fetch sales data with filtering, searching, sorting, and pagination.

**Query Parameters:**
```
- search (string): Search term for customer name or phone
- region (string|array): Filter by customer region
- gender (string|array): Filter by gender
- category (string|array): Filter by product category
- paymentMethod (string|array): Filter by payment method
- minAge (number): Minimum age filter
- maxAge (number): Maximum age filter
- startDate (ISO date): Start of date range
- endDate (ISO date): End of date range
- tags (string|array): Filter by product tags
- sortBy (string): Sort field - date|quantity|customerName
- sortOrder (string): asc|desc (default: desc)
- page (number): Page number (default: 1)
- limit (number): Records per page (default: 10)
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "customerId": "string",
      "customerName": "string",
      "phone": "string",
      "gender": "string",
      "age": 25,
      "region": "North",
      "productName": "string",
      "category": "Electronics",
      "quantity": 2,
      "finalAmount": 19999.50,
      "date": "2025-12-09T10:30:00Z",
      "paymentMethod": "Credit Card"
    }
  ],
  "meta": {
    "total": 1500,
    "page": 1,
    "limit": 10,
    "totalPages": 150
  }
}
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env
# Edit .env and add your PostgreSQL connection string
```

### 3. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Create/update database schema
npx prisma db push

# Seed database with CSV data
node prisma/seed.js
```

### 4. Start Development Server
```bash
npm run dev
```

Server runs on `http://localhost:5000`

## Production Deployment

### Deploy to Render.com

1. **Create Render Web Service**
   - Connect GitHub repository
   - Set Build Command: `npm install && npm run build`
   - Set Start Command: `npm start`

2. **Add Environment Variables**
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `PORT`: 5000 (optional, defaults to 5000)

3. **Deploy**
   - Click "Deploy" and wait for build to complete

### Database Migration
```bash
# On first deploy, run migrations
npx prisma migrate deploy
# or
npx prisma db push
```

## Project Structure

```
backend/
├── src/
│   ├── index.js              # Express app & server setup
│   ├── controllers/
│   │   └── saleController.js # Business logic
│   ├── routes/
│   │   └── sales.js          # Route definitions
│   ├── services/             # Database & external services
│   └── utils/                # Helper functions
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.js               # Data seeding script
├── .env.example              # Environment template
├── package.json              # Dependencies
└── README.md                 # This file
```

## Key Features

### Dynamic Query Building
- Converts query parameters to Prisma where/orderBy clauses
- Supports multi-select filters with OR/AND logic
- Handles numeric ranges and date ranges

### Performance Optimizations
- Database indexes on search/filter fields
- Pagination with offset-limit strategy
- Transaction support for data consistency
- Efficient CSV seeding with batch processing

### Error Handling
- Try-catch error handling in controller
- Proper HTTP status codes
- Logging for debugging

## Database Schema

### Sale Model
Stores complete sales transaction data with:
- Customer information (name, phone, demographics)
- Product details (name, brand, category, tags)
- Sales metrics (quantity, price, discount, totals)
- Operational data (date, payment method, delivery type)

See `prisma/schema.prisma` for complete schema definition.

## Development

### Available Scripts

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed database
node prisma/seed.js

# View database in Prisma Studio
npx prisma studio
```

### Troubleshooting

**Prisma Permission Denied:**
- Ensure `npm install` completes before running `npx prisma` commands
- Run `npm run build` first on deployment

**Database Connection Error:**
- Verify `DATABASE_URL` is correct and accessible
- Check firewall/IP whitelist rules
- Ensure database server is running

**Large file upload issues:**
- CSV seeding uses streaming parser for memory efficiency
- Batch insertion prevents connection timeouts

## Testing

Manual API testing with cURL:
```bash
# Search for customer
curl "http://localhost:5000/api/sales?search=John&page=1"

# Multi-select filter
curl "http://localhost:5000/api/sales?region=North&region=South&page=1"

# Date range filter
curl "http://localhost:5000/api/sales?startDate=2025-01-01&endDate=2025-12-31&page=1"

# Sort by quantity descending
curl "http://localhost:5000/api/sales?sortBy=quantity&sortOrder=desc&page=1"
```

## Performance Benchmarks

- **Cold Start:** < 2s
- **Query Response:** < 200ms (typical, depends on filter complexity)
- **Large Filter Combinations:** < 500ms
- **Database Connection Pool:** 5 connections (Prisma default)

## License

MIT

---

**For detailed architecture, see `/docs/architecture.md`**
