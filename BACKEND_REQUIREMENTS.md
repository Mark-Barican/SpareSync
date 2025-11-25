# Backend Requirements for SpareSync

This document outlines the backend implementation needed to complete the Spare Parts Reordering Assistant system using Next.js, Vercel, and Neon Postgres.

## Current Status

✅ **Frontend Complete**: The application currently works with mock data stored in browser state. All sorting algorithms, search functionality, and UI components are implemented.

## Backend Tasks Required

### 1. Database Setup (Neon Postgres)

#### 1.1 Database Schema

Create the following tables:

```sql
-- Spare Parts Table
CREATE TABLE spare_parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  current_stock INTEGER NOT NULL DEFAULT 0,
  reorder_point INTEGER NOT NULL DEFAULT 0,
  supplier_lead_time INTEGER NOT NULL DEFAULT 0, -- in days
  cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster name searches
CREATE INDEX idx_spare_parts_name ON spare_parts(name);
CREATE INDEX idx_spare_parts_urgency ON spare_parts((current_stock - reorder_point));

-- Suppliers Table (optional enhancement)
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Part-Supplier Relationship (optional enhancement)
CREATE TABLE part_suppliers (
  part_id UUID REFERENCES spare_parts(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  lead_time INTEGER NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  PRIMARY KEY (part_id, supplier_id)
);

-- Reorder History (optional enhancement for tracking)
CREATE TABLE reorder_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part_id UUID REFERENCES spare_parts(id) ON DELETE CASCADE,
  quantity_ordered INTEGER NOT NULL,
  order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expected_delivery_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'pending' -- pending, shipped, delivered
);
```

#### 1.2 Environment Variables

Set up in Vercel:

- `DATABASE_URL`: Neon Postgres connection string
- `NEXT_PUBLIC_API_URL`: API base URL (if needed)

### 2. API Routes (Next.js API Routes)

#### 2.1 GET `/api/parts`

- Fetch all spare parts from database
- Calculate urgency on the fly or use database view
- Support query parameters:
  - `sort`: 'urgency' | 'name' | 'cost'
  - `algorithm`: 'quicksort' | 'mergesort' (for frontend sorting)
  - `needsReorder`: boolean (filter by reorder status)

**Response:**

```json
{
  "parts": [
    {
      "id": "uuid",
      "name": "Hydraulic Pump Seal",
      "currentStock": 2,
      "reorderPoint": 5,
      "supplierLeadTime": 7,
      "cost": 45.99,
      "urgency": -3,
      "needsReorder": true
    }
  ],
  "total": 10,
  "needsReorderCount": 3
}
```

#### 2.2 POST `/api/parts`

- Create a new spare part
- Validate input data
- Return created part with calculated urgency

**Request Body:**

```json
{
  "name": "New Part",
  "currentStock": 10,
  "reorderPoint": 5,
  "supplierLeadTime": 7,
  "cost": 25.99
}
```

#### 2.3 PUT `/api/parts/[id]`

- Update an existing spare part
- Update `updated_at` timestamp
- Return updated part with recalculated urgency

#### 2.4 DELETE `/api/parts/[id]`

- Soft delete or hard delete a part
- Return success status

#### 2.5 GET `/api/parts/search`

- Search parts by name
- Support binary search optimization (if sorted by name)
- Query parameter: `q` (search term)
- Query parameter: `useBinary` (boolean)

#### 2.6 GET `/api/parts/stats`

- Return summary statistics:
  - Total parts count
  - Parts needing reorder
  - Parts with adequate stock
  - Total inventory value
  - Average lead time

### 3. Database Client Setup

#### 3.1 Install Dependencies

```bash
npm install @neondatabase/serverless
# or
npm install postgres
# or
npm install drizzle-orm drizzle-kit
```

#### 3.2 Database Connection

Create `lib/db.ts`:

```typescript
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
export { sql };
```

Or using Drizzle ORM:

```typescript
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

### 4. Data Validation & Security

#### 4.1 Input Validation

- Use Zod or similar for schema validation
- Validate all numeric inputs (stock, reorder point, cost)
- Sanitize string inputs (part names)

#### 4.2 Error Handling

- Implement proper error handling middleware
- Return appropriate HTTP status codes
- Log errors for debugging

#### 4.3 Authentication (Optional but Recommended)

- Add authentication for multi-user support
- Use NextAuth.js or similar
- Protect API routes

### 5. Performance Optimizations

#### 5.1 Database Indexing

- Index on `(current_stock - reorder_point)` for urgency calculations
- Index on `name` for search operations
- Consider materialized views for frequently accessed data

#### 5.2 Caching

- Use Vercel's Edge Caching for read operations
- Cache stats and frequently accessed queries
- Implement cache invalidation on updates

#### 5.3 Pagination

- Implement pagination for large datasets
- Use cursor-based or offset-based pagination

### 6. Real-time Updates (Optional Enhancement)

#### 6.1 WebSocket/Server-Sent Events

- Real-time stock updates
- Notifications when parts fall below reorder point
- Use Vercel's Edge Functions or separate WebSocket service

### 7. Testing

#### 7.1 Unit Tests

- Test sorting algorithms
- Test search functions
- Test urgency calculations

#### 7.2 Integration Tests

- Test API endpoints
- Test database operations
- Test error scenarios

### 8. Deployment Checklist

- [ ] Set up Neon Postgres database
- [ ] Run database migrations
- [ ] Configure environment variables in Vercel
- [ ] Set up database connection pooling
- [ ] Implement API routes
- [ ] Add error handling and logging
- [ ] Set up monitoring (Vercel Analytics)
- [ ] Test all endpoints
- [ ] Update frontend to use API routes instead of mock data
- [ ] Add loading states and error handling in frontend
- [ ] Deploy to Vercel

### 9. Frontend Updates Needed

Once backend is ready, update frontend:

1. **Replace mock data** with API calls:
   - Use `fetch()` or a library like `axios` or `swr`
   - Replace `generateSampleParts()` with API call
   - Replace local state management with server state

2. **Add loading states**:
   - Show loading spinners during API calls
   - Handle loading states in components

3. **Add error handling**:
   - Display error messages for failed API calls
   - Implement retry logic

4. **Optimistic updates**:
   - Update UI immediately, sync with server
   - Rollback on error

### 10. Optional Enhancements

- **Multi-tenant support**: Separate data by factory/company
- **User roles**: Admin, Manager, Viewer
- **Audit logs**: Track all changes to parts
- **Email notifications**: Alert when parts need reordering
- **Export functionality**: CSV/PDF export of inventory
- **Bulk operations**: Import/update multiple parts
- **Supplier management**: Full CRUD for suppliers
- **Reorder automation**: Auto-generate purchase orders
- **Analytics dashboard**: Charts and trends
- **Mobile app**: React Native or PWA

## Implementation Priority

1. **High Priority** (MVP):
   - Database schema and connection
   - CRUD API routes for parts
   - Update frontend to use API

2. **Medium Priority**:
   - Search API endpoint
   - Stats API endpoint
   - Error handling and validation

3. **Low Priority** (Nice to have):
   - Authentication
   - Real-time updates
   - Advanced features

## Estimated Time

- Database setup: 2-4 hours
- API routes implementation: 4-6 hours
- Frontend integration: 2-3 hours
- Testing and debugging: 2-3 hours
- **Total: 10-16 hours**
