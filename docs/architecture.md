# Architecture Documentation

## 1. System Overview
This is a full-stack monolithic application demonstrating professional SDE practices. The system handles retail sales data with optimized search, filtering, sorting, and pagination. Built for performance, maintainability, and scalability.

**Technology Stack:**
- **Frontend:** Next.js 14 (App Router), React 18, Tailwind CSS
- **Backend:** Node.js, Express.js, Prisma ORM
- **Database:** PostgreSQL (Supabase)
- **Hosting:** Vercel (Frontend), Render (Backend)

---

## 2. Architecture Layers

### Frontend Architecture (Next.js)
```
src/
├── app/
│   ├── layout.jsx          # Root layout with Tailwind setup
│   ├── page.jsx            # Main dashboard component
│   └── globals.css         # Global styles
├── components/
│   └── FilterPanel.jsx     # Reusable filter component
├── services/               # API client utilities
├── utils/                  # Helper functions
├── hooks/                  # Custom React hooks
└── styles/                 # Component-level styles
```

**Key Components:**
- **Dashboard (page.jsx):** Main entry point
  - State management via URL query parameters
  - Search bar with keyboard event handling
  - Sort dropdown with toggle functionality
  - Pagination controls with boundary detection
  - Transaction table with data mapping

- **FilterPanel Component:**
  - Multi-select checkbox groups (Region, Gender, Category, Payment)
  - Range inputs (Age, Date Range)
  - State synchronization via URL params
  - Clear filters button

### Backend Architecture (Express.js)
```
src/
├── index.js                # App initialization & middleware
├── routes/
│   └── sales.js           # Route handlers
├── controllers/
│   └── saleController.js  # Business logic
├── services/              # Database & external services
└── utils/                 # Helper functions
prisma/
├── schema.prisma          # Database schema
└── seed.js               # Data seeding script
```

**Key Modules:**
- **index.js:** Express app setup with CORS middleware
- **saleController.js:** `getSales()` method handling:
  - Query parameter extraction and validation
  - Dynamic Prisma query building
  - Pagination calculation
  - Response formatting with metadata
- **routes/sales.js:** API endpoint definition

---

## 3. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER INTERACTION                             │
│  (Search Input, Filter Selection, Sort Dropdown, Pagination)     │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │   Frontend (Next.js Page Component)  │
        │ - Update URL Query Parameters        │
        │ - Maintain component state           │
        │ - Re-render on param changes         │
        └──────────────────────┬───────────────┘
                               │
                               ▼
        ┌──────────────────────────────────────┐
        │  Browser API Call (fetch)            │
        │  GET /api/sales?search=...&          │
        │      filter=...&sort=...&page=...    │
        └──────────────────────┬───────────────┘
                               │
        ┌──────────────────────▼───────────────┐
        │   Backend (Express Server)            │
        │ - Parse query parameters              │
        │ - Extract filters: search, region,    │
        │   gender, category, dates, etc.       │
        └──────────────────────┬───────────────┘
                               │
                               ▼
        ┌──────────────────────────────────────┐
        │  Controller Logic (saleController)   │
        │ - Build dynamic Prisma where clause   │
        │ - Set orderBy based on sortBy param   │
        │ - Calculate skip/take for pagination  │
        └──────────────────────┬───────────────┘
                               │
                               ▼
        ┌──────────────────────────────────────┐
        │  Prisma ORM                           │
        │ - Convert JS to SQL                   │
        │ - Execute database transaction        │
        │ - Use database indexes for speed      │
        └──────────────────────┬───────────────┘
                               │
                               ▼
        ┌──────────────────────────────────────┐
        │  PostgreSQL Database                  │
        │ - Execute optimized SQL query         │
        │ - Return filtered/sorted records      │
        │ - Count total matching records        │
        └──────────────────────┬───────────────┘
                               │
        ┌──────────────────────▼───────────────┐
        │  Backend Response                     │
        │ {                                     │
        │   data: [...],                        │
        │   meta: {                             │
        │     total, page, limit, totalPages    │
        │   }                                   │
        │ }                                     │
        └──────────────────────┬───────────────┘
                               │
                               ▼
        ┌──────────────────────────────────────┐
        │  Frontend Update                      │
        │ - Parse JSON response                 │
        │ - Update state (sales, meta)          │
        │ - Re-render table with new data       │
        └──────────────────────┬───────────────┘
                               │
                               ▼
        ┌──────────────────────────────────────┐
        │  Browser Displays Updated Results     │
        │  (Filtered, Sorted, Paginated Data)   │
        └──────────────────────────────────────┘
```

---

## 4. Database Schema

### Sale Model (PostgreSQL Table)
```prisma
model Sale {
  id              String   @id @default(uuid())
  
  // Customer Fields
  customerId      String
  customerName    String   @index    // Indexed for search
  phone           String   @index    // Indexed for search
  gender          String
  age             Int
  region          String   @index    // Indexed for filtering
  customerType    String
  
  // Product Fields
  productId       String
  productName     String
  brand           String
  category        String   @index    // Indexed for filtering
  tags            String[]           // Array for multi-value
  description     String?
  
  // Sales Fields
  quantity        Int
  pricePerUnit    Float
  discount        Float
  totalAmount     Float
  finalAmount     Float
  
  // Operational Fields
  date            DateTime @index    // Indexed for filtering
  paymentMethod   String
  orderStatus     String
  deliveryType    String
  storeId         String
  storeLocation   String
  salespersonId   String
  employeeName    String
}
```

**Indexing Strategy:**
- Indexes on frequently searched/filtered fields: `customerName`, `phone`, `region`, `category`, `date`
- Improves query performance for large datasets

---

## 5. Key Implementation Details

### Search (Full-Text)
**Query Building:**
```javascript
if (search) {
  where.OR = [
    { customerName: { contains: search, mode: "insensitive" } },
    { phone: { contains: search, mode: "insensitive" } }
  ];
}
```
- Case-insensitive substring matching
- Multi-field OR operator for combined search
- Works with other filters (AND logic)

### Filtering (Multi-Select)
**Single-Value Filters (Region, Gender, Category):**
```javascript
where.region = { in: Array.isArray(region) ? region : [region] };
```
- Accepts comma-separated URL params: `?region=North&region=South`
- Converted to array, then to SQL IN clause

**Range Filters (Age, Date):**
```javascript
where.age = { gte: minAge, lte: maxAge };
where.date = { gte: startDate, lte: endDate };
```
- Independent min/max parameters
- Supports partial ranges (only min, only max, or both)

**Array Filters (Tags):**
```javascript
where.tags = { hasSome: tagArray };
```
- Uses PostgreSQL array intersection
- Finds records where tags overlap

### Sorting
**Dynamic OrderBy:**
```javascript
const orderByMap = {
  "date": { date: "desc" },
  "quantity": { quantity: sortOrder },
  "customerName": { customerName: sortOrder }
};
```
- Default: newest first (date descending)
- User can toggle ascending/descending
- Preserves pagination and filters

### Pagination
**Offset-Limit Strategy:**
```javascript
const skip = (page - 1) * limit;  // Default limit: 10
const [data, total] = await prisma.$transaction([
  prisma.sale.findMany({ where, take: limit, skip, orderBy }),
  prisma.sale.count({ where })
]);
```
- Transaction ensures consistency between count and data
- Efficient for moderate datasets (< 1M records)

---

## 6. Folder Structure

```
retail-sales-system/
│
├── backend/
│   ├── src/
│   │   ├── index.js
│   │   ├── controllers/
│   │   │   └── saleController.js
│   │   ├── routes/
│   │   │   └── sales.js
│   │   ├── services/
│   │   └── utils/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.js
│   │   └── migrations/
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.jsx
│   │   │   ├── page.jsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   └── FilterPanel.jsx
│   │   ├── services/
│   │   ├── utils/
│   │   ├── hooks/
│   │   └── styles/
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── docs/
│   └── architecture.md
│
├── data.csv
├── README.md
└── package.json
```

---

## 7. Module Responsibilities

| Module | Responsibility |
|--------|-----------------|
| `saleController.js` | Query validation, Prisma query building, response formatting |
| `sales.js (route)` | HTTP endpoint definition, request routing |
| `FilterPanel.jsx` | Filter UI, state management via URL params |
| `page.jsx` | Main dashboard, data fetching, table rendering, pagination |
| `schema.prisma` | Data model definition, constraints, indexes |
| `seed.js` | CSV parsing, batch database insertion |
| `index.js (backend)` | Express app initialization, middleware setup |

---

## 8. Performance Optimizations

1. **Database Indexing:** Indexes on search and filter fields
2. **Transactions:** Consistent count and data retrieval
3. **Pagination:** Offset-limit avoids loading entire dataset
4. **URL State Management:** No Redux/Context API overhead
5. **CSV Streaming:** Batch insertion during seeding (100 records/batch)
6. **Prisma Transactions:** Atomic database operations

---

## 9. Error Handling

**Backend:**
- Try-catch in controller with 500 error responses
- Validation of query parameters

**Frontend:**
- Loading states during API calls
- Error logging to console
- Graceful "No results found" message
- Disabled pagination buttons at boundaries

---

## 10. Deployment Architecture

### Frontend (Vercel)
- Automatic deployment on GitHub push
- Environment variables: `NEXT_PUBLIC_API_URL`
- Build command: `next build`
- Start command: `next start`

### Backend (Render)
- Web Service deployment
- Environment variables: `DATABASE_URL`, `PORT`
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Health check endpoint: `GET /`

---

**Last Updated:** December 2025
