# Retail Sales Frontend

## Overview
Next.js 14 frontend for the Retail Sales Management System. Provides a modern, responsive dashboard for searching, filtering, sorting, and paginating sales data with real-time updates.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **React:** 18.x
- **Styling:** Tailwind CSS
- **State Management:** URL Query Parameters
- **HTTP Client:** Fetch API

## Features

### Search
- Full-text search on Customer Name and Phone Number
- Case-insensitive matching
- Real-time search results
- Keyboard enter to submit

### Multi-Select Filters
- **Region:** North, South, East, West
- **Gender:** Male, Female, Other
- **Age Range:** Min/Max numeric inputs
- **Category:** Electronics, Clothing, Home, Beauty
- **Payment Method:** Credit Card, Debit Card, Cash, Online Banking
- **Date Range:** Start and end date selectors
- Combine multiple filters simultaneously
- Clear all filters with one click

### Sorting
- Sort by Date (Newest First - default)
- Sort by Quantity
- Sort by Customer Name (A-Z)
- Toggle between ascending/descending
- Preserves filters and search

### Pagination
- 10 items per page
- Next/Previous navigation
- Page indicator (Page X of Y)
- Disabled buttons at boundaries
- Maintains search, filters, sort state

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env.local
# Edit .env.local and set NEXT_PUBLIC_API_URL
# For development: http://localhost:5000
# For production: your deployed backend URL
```

### 3. Start Development Server
```bash
npm run dev
```

App runs on `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.jsx       # Root layout component
│   │   ├── page.jsx         # Main dashboard page
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   └── FilterPanel.jsx  # Filter UI component
│   ├── services/            # API client utilities
│   ├── utils/               # Helper functions
│   ├── hooks/               # Custom React hooks
│   └── styles/              # Component styles
├── public/                  # Static assets
├── .env.example             # Environment template
├── package.json
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
└── README.md
```

## Key Components

### Dashboard (page.jsx)
Main application component handling:
- Data fetching from backend API
- Search input and handler
- Sort dropdown
- Transaction table rendering
- Pagination controls
- Loading and error states
- URL query parameter management

**State Management:**
- Uses Next.js `useSearchParams()` for URL-based state
- `useRouter()` for navigation and parameter updates
- `useState()` for local component state (sales data, loading)

### FilterPanel (components/FilterPanel.jsx)
Reusable filter component with:
- Checkbox groups (Region, Gender, Category, Payment)
- Range inputs (Age, Date)
- Multi-select state synchronization
- Clear filters functionality

**Features:**
- Dynamic checkbox state management
- Independent range filter inputs
- URL parameter updates on change
- Reset pagination to page 1 on filter change

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Code Style
- Uses Next.js recommended patterns
- Tailwind CSS for styling
- Component-based architecture
- URL query parameters for state persistence

## Production Deployment

### Deploy to Vercel

1. **Connect GitHub Repository**
   - Go to vercel.com and sign in
   - Click "New Project"
   - Select your GitHub repository

2. **Configure Environment Variables**
   - Add `NEXT_PUBLIC_API_URL`: Your deployed backend URL
   - Example: `https://your-backend-api.onrender.com`

3. **Deploy**
   - Vercel auto-detects Next.js
   - Click "Deploy"
   - Your app is live!

### Deploy to Other Platforms

**Netlify:**
```bash
npm run build
# Deploy the .next folder
```

**Traditional Server:**
```bash
npm run build
npm start
# Server listens on PORT 3000
```

## Environment Variables

### Development (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Production (.env.production)
```env
NEXT_PUBLIC_API_URL=https://your-deployed-backend.com
```

**Note:** `NEXT_PUBLIC_*` variables are exposed to the browser.

## UI Components

### Search Bar
- Text input with placeholder
- Triggered on Enter key press
- Updates URL search parameter
- Resets to page 1

### Sort Dropdown
```html
<select>
  <option value="date">Date (Newest)</option>
  <option value="quantity">Quantity</option>
  <option value="customerName">Customer (A-Z)</option>
</select>
```

### Transaction Table
Displays:
- Date (formatted)
- Customer Name & Phone
- Product Name
- Region
- Category (badge)
- Final Amount

### Pagination
- Previous button (disabled if page 1)
- Page indicator
- Next button (disabled if last page)

## Performance Tips

1. **Code Splitting:** Next.js automatic code splitting
2. **Image Optimization:** Use next/image component
3. **Caching:** Browser caching for static assets
4. **API Optimization:** Backend handles filtering/sorting

## Troubleshooting

### API Connection Error
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend is running and accessible
- Check CORS configuration on backend

### Filters Not Working
- Verify URL parameters are updating
- Check browser console for errors
- Ensure backend supports all filter parameters

### Styling Issues
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `npm run build`
- Check Tailwind config: `tailwind.config.js`

## Browser Support
- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers

## License

MIT

---

**For API documentation, see `/backend/README.md`**
**For system architecture, see `/docs/architecture.md`**
