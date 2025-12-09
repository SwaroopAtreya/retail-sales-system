# Retail Sales Management System

## Overview
A production-grade retail sales dashboard featuring advanced multi-select filtering, full-text search, server-side sorting, and pagination. Built with Next.js and Express.js, using PostgreSQL for data persistence. Processes 10,000+ sales records with real-time query optimization.

## Tech Stack
- **Frontend:** Next.js 14 (App Router), Tailwind CSS, React 18
- **Backend:** Node.js, Express.js, Prisma ORM
- **Database:** PostgreSQL (Supabase Free Tier)
- **Deployment:** Vercel (Frontend), Render (Backend)

## Search Implementation Summary

### Functionality
- Full-text search across **Customer Name** and **Phone Number** fields
- Case-insensitive matching using Prisma's `insensitive` mode
- Real-time search with URL-based state persistence
- Seamless integration with active filters and sorting

### Technical Details
**Backend (Node.js + Prisma):**
```javascript
where.OR = [
  { customerName: { contains: search, mode: "insensitive" } },
  { phone: { contains: search, mode: "insensitive" } }
]
```
- Uses Prisma's `OR` operator for multi-field search
- Database indexing on both fields for performance optimization

**Frontend (Next.js):**
- Search input triggers URL parameter updates on Enter key
- useSearchParams hook maintains search state across navigation
- Automatically resets pagination to page 1 on new search

## Filter Implementation Summary

### Multi-Select Filters
Implemented 7 filter categories with simultaneous multi-selection capability:

1. **Region** - North, South, East, West
2. **Gender** - Male, Female, Other
3. **Age Range** - Min/Max numeric inputs
4. **Product Category** - Electronics, Clothing, Home, Beauty
5. **Payment Method** - Credit Card, Debit Card, Cash, Online Banking
6. **Date Range** - Start and End date inputs
7. **Tags** - Multi-value array support (Prisma `hasSome`)

### Technical Implementation
**Backend (Prisma Dynamic Queries):**
```javascript
if (region) where.region = { in: Array.isArray(region) ? region : [region] };
if (tags) where.tags = { hasSome: Array.isArray(tags) ? tags : [tags] };
if (minAge || maxAge) {
  where.age = {};
  if (minAge) where.age.gte = parseInt(minAge);
  if (maxAge) where.age.lte = parseInt(maxAge);
}
```
- Converts single/multiple filter values into database queries
- Range filters use `gte`/`lte` operators for numeric comparisons
- Array fields use `hasSome` for partial matches

**Frontend (React State Management):**
- URL query parameters preserve filter state across sessions
- Checkbox state binding with `isChecked()` utility
- Range inputs update independently without losing other filters
- "Clear All Filters" button resets to root path

## Sorting Implementation Summary

### Sortable Fields
- **Date** - Newest First (default, descending)
- **Quantity** - Ascending/Descending toggle
- **Customer Name** - A-Z (Ascending/Descending)

### Technical Details
**Backend (Prisma OrderBy):**
```javascript
let orderBy = {};
if (sortBy === "date") orderBy = { date: sortOrder };
else if (sortBy === "quantity") orderBy = { quantity: sortOrder };
else if (sortBy === "customerName") orderBy = { customerName: sortOrder };
```

**Frontend Behavior:**
- Sorting dropdown updates URL parameters
- Toggle sort direction (asc/desc) on same field click
- Preserves active search and filter state
- Resets pagination when sort changes

## Pagination Implementation Summary

### Features
- **Page Size:** 10 items per page (configurable via query param)
- **Navigation:** Previous/Next buttons with disabled state
- **State Persistence:** Maintains search, filters, and sort during pagination
- **Metadata:** Total records, current page, total pages

### Technical Implementation
**Backend Response:**
```javascript
const meta = {
  total: totalCount,
  page: parseInt(page),
  limit: parseInt(limit),
  totalPages: Math.ceil(total / take)
};
```

**Frontend Handling:**
- Pagination buttons disabled at boundaries
- Page number shown with total pages
- All URL parameters carried forward during page navigation
- Resets to page 1 when search, filters, or sort change

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (Supabase recommended for free tier)
- Git

### 1. Clone Repository
```bash
git clone https://github.com/SwaroopAtreya/retail-sales-system.git
cd retail-sales-system
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file with your database URL
cp .env.example .env
# Edit .env and add your DATABASE_URL

# Generate Prisma client and seed database
npx prisma generate
npx prisma db push
node prisma/seed.js

# Start development server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create .env.local file
cp .env.example .env.local
# Edit .env.local and add your NEXT_PUBLIC_API_URL

# Start development server
npm run dev
```

### 4. Access Application
- Frontend: `https://retail-sales-system-production.up.railway.app/`
- Backend API: `https://retail-sales-system-jwdm.onrender.com`

### Production Deployment

**Backend (Render):**
1. Connect GitHub repository
2. Set Build Command: `npm install && npm run build`
3. Add environment variables: `DATABASE_URL`
4. Deploy

**Frontend (Vercel):**
1. Connect GitHub repository
2. Set environment variables: `NEXT_PUBLIC_API_URL` (production backend URL)
3. Deploy

---

**Built with ❤️ for TruEstate SDE Internship Assignment**
