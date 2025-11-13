# Expenses Feature Removal - December 2024

## Overview

The expenses feature has been completely removed from the Home Admin application. This includes the expenses table, API routes, UI components, and all related functionality.

## Reason for Removal

- Simplified application focus on property and tenant management
- Removed financial tracking to streamline the application
- Focus shifted to core property management features

---

## Elements Removed

### 1. Database Schema

**File:** `src/database/schema.sql`

**Removed:**
- `expenses` table definition
- `idx_expenses_user` index
- `idx_expenses_date` index
- Comment references to expenses

**Before:**
```sql
-- Expenses table (utility tracking)
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_expenses_user ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(date);
```

**After:**
```sql
-- Expenses table removed - application now focuses on properties and tenants only
```

---

### 2. API Routes

**Files Deleted:**
- `src/app/api/expenses/route.js` - GET and POST endpoints
- `src/app/api/expenses/[expenseId]/route.js` - PUT and DELETE endpoints

**Removed Endpoints:**
- `GET /api/expenses?userId=123` - Get all expenses for a user
- `POST /api/expenses` - Create a new expense
- `PUT /api/expenses/[expenseId]` - Update an expense
- `DELETE /api/expenses/[expenseId]` - Delete an expense

---

### 3. Database Service Methods

**File:** `src/services/databaseService.js`

**Removed Methods:**
- `getExpenses(userId)` - Get all expenses for a user
- `addExpenses(expense, userId)` - Create a new expense
- `updateExpenses(id, updates, userId)` - Update an expense
- `deleteExpenses(id, userId)` - Delete an expense

**Updated Methods:**
- `getDashboardStats(userId)` - Removed `monthlyExpenses` calculation
- `getRecentActivities(userId)` - Changed from expenses-only to properties and tenants

**Before:**
```javascript
async getDashboardStats(userId) {
  // ... properties query
  const expensesResult = await this.query(`
    SELECT COALESCE(SUM(amount), 0) as expenses
    FROM expenses 
    WHERE date >= $1 AND date < $2 AND user_id = $3
  `, [`${currentMonth}-01`, `${currentMonth}-32`, userId]);
  
  const stats = {
    // ...
    monthlyExpenses: parseFloat(expensesResult.rows[0].expenses || 0),
  };
}
```

**After:**
```javascript
async getDashboardStats(userId) {
  // ... properties query only
  const stats = {
    totalProperties: ...,
    occupiedProperties: ...,
    occupancyRate: ...,
    availableProperties: ...
  };
}
```

---

### 4. UI Components

#### Dashboard Page

**File:** `src/app/dashboard/page.js`

**Removed:**
- Expenses tab (case 3) from switch statement

**Before:**
```javascript
case 3: // Expenses
  return (
    <UniversalPage
      dataType="expenses"
      title="Expenses"
      columns={getColumnsByType('expenses')}
      emptyMessage="No expenses recorded"
      hidePageLayout={true}
    />
  );
```

**After:**
```javascript
// Expenses tab removed - only Dashboard, Properties, and Tenants remain
```

#### Dashboard Stats Component

**File:** `src/components/shared/DashboardStats.js`

**Removed:**
- `monthlyExpenses` from `EMPTY_STATS`
- "Monthly Expenses" StatCard
- `expense` type from `getActivityIcon`
- `activity.amount` display in recent activities

**Before:**
```javascript
const EMPTY_STATS = {
  totalProperties: 0,
  occupiedProperties: 0,
  monthlyExpenses: 0,  // REMOVED
  availableProperties: 0,
  occupancyRate: 0,
};

<StatCard
  label="Monthly Expenses"
  value={`$${safeStats.monthlyExpenses.toLocaleString()}`}
  helpText="This month"
  color="danger.default"
  arrowType="decrease"
/>
```

**After:**
```javascript
const EMPTY_STATS = {
  totalProperties: 0,
  occupiedProperties: 0,
  availableProperties: 0,
  occupancyRate: 0,
};

// Monthly Expenses card removed - now 3 cards instead of 4
```

---

### 5. Navigation & Constants

**File:** `src/constants/app.js`

**Removed:**
- Expenses from `TAB_ITEMS` array

**Before:**
```javascript
export const TAB_ITEMS = [
  { id: "dashboard", label: "🏠 Dashboard" },
  { id: "properties", label: "🏘️ Properties" },
  { id: "tenants", label: "👥 Tenants" },
  { id: "expenses", label: "💡 Expenses" },  // REMOVED
];
```

**After:**
```javascript
export const TAB_ITEMS = [
  { id: "dashboard", label: "🏠 Dashboard" },
  { id: "properties", label: "🏘️ Properties" },
  { id: "tenants", label: "👥 Tenants" },
];
```

**File:** `src/contexts/TabContext.js`

**Removed:**
- "Expenses" from tab titles array

**Before:**
```javascript
const titles = ["Dashboard", "Property Management", "Tenant Management", "Expenses"];
```

**After:**
```javascript
const titles = ["Dashboard", "Property Management", "Tenant Management"];
```

---

### 6. Form & Table Configuration

**File:** `src/config/formFields.js`

**Removed:**
- `EXPENSE_FIELDS` array
- `expenses` case from `getFieldsByType` switch

**Before:**
```javascript
export const EXPENSE_FIELDS = [
  { name: 'description', label: 'Description', type: 'text', required: true },
  { name: 'amount', label: 'Amount', type: 'number', required: true },
  { name: 'date', label: 'Date', type: 'date', required: true },
  { name: 'notes', label: 'Notes', type: 'textarea' }
];

export const getFieldsByType = (dataType) => {
  switch (dataType) {
    case 'properties': return PROPERTY_FIELDS;
    case 'expenses': return EXPENSE_FIELDS;  // REMOVED
    case 'tenants': return TENANT_FIELDS;
  }
};
```

**After:**
```javascript
// EXPENSE_FIELDS removed

export const getFieldsByType = (dataType) => {
  switch (dataType) {
    case 'properties': return PROPERTY_FIELDS;
    case 'tenants': return TENANT_FIELDS;
  }
};
```

**File:** `src/config/tableColumns.js`

**Removed:**
- `EXPENSE_COLUMNS` array
- `expenses` case from `getColumnsByType` switch

**Before:**
```javascript
export const EXPENSE_COLUMNS = [
  { key: 'description', label: 'Description' },
  { key: 'amount', label: 'Amount', render: ... },
  { key: 'date', label: 'Date', render: ... },
  { key: 'notes', label: 'Notes', render: ... }
];

export const getColumnsByType = (dataType) => {
  switch (dataType) {
    case 'properties': return PROPERTY_COLUMNS;
    case 'expenses': return EXPENSE_COLUMNS;  // REMOVED
    case 'tenants': return TENANT_COLUMNS;
  }
};
```

**After:**
```javascript
// EXPENSE_COLUMNS removed

export const getColumnsByType = (dataType) => {
  switch (dataType) {
    case 'properties': return PROPERTY_COLUMNS;
    case 'tenants': return TENANT_COLUMNS;
  }
};
```

---

### 7. Universal Page Component

**File:** `src/components/shared/UniversalPage.js`

**Removed:**
- `expenses` from `singularForm` mapping
- `expenses` from `displayName` mapping

**Before:**
```javascript
const singularForm = {
  properties: 'property',
  expenses: 'expense',  // REMOVED
  tenants: 'tenant'
}[dataType] || dataType.slice(0, -1);

const displayName = {
  properties: 'properties',
  expenses: 'expenses',  // REMOVED
  tenants: 'tenants'
}[dataType] || ...;
```

**After:**
```javascript
const singularForm = {
  properties: 'property',
  tenants: 'tenant'
}[dataType] || dataType.slice(0, -1);

const displayName = {
  properties: 'properties',
  tenants: 'tenants'
}[dataType] || ...;
```

---

### 8. API Helpers

**File:** `src/utils/apiHelpers.js`

**Updated:**
- Removed expenses-specific naming logic
- Removed `expenseId` parameter handling
- Simplified method naming to use singular form for all resources

**Before:**
```javascript
// Handle inconsistent naming: properties uses singular for add/update/delete, expenses uses plural
const addMethod = (resourceName === 'properties' || resourceName === 'tenants')
  ? `add${resourceSingularCapitalized}` 
  : `add${resourceCapitalized}`;  // expenses used plural

// Handle propertyId, expenseId, and tenantId
const idParam = params.propertyId || params.expenseId || params.tenantId;
```

**After:**
```javascript
// Handle naming: properties and tenants use singular for add/update/delete methods
const addMethod = `add${resourceSingularCapitalized}`;  // All use singular now

// Handle propertyId and tenantId
const idParam = params.propertyId || params.tenantId;
```

---

## Impact

### Database Changes
- **Tables:** Reduced from 6 to 5 tables
- **Relationships:** Still maintains all 3 SQL relationship types:
  - ✅ One-to-One: `users` ↔ `user_profiles`
  - ✅ One-to-Many: `users` → `properties`, `users` → `tenants`
  - ✅ Many-to-Many: `properties` ↔ `tenants`

### UI Changes
- **Navigation:** Reduced from 4 tabs to 3 tabs (Dashboard, Properties, Tenants)
- **Dashboard Stats:** Reduced from 4 stat cards to 3 stat cards
- **Recent Activities:** Now shows properties and tenants instead of expenses

### Code Changes
- **API Routes:** Removed 2 route files
- **Database Methods:** Removed 4 expense-related methods
- **Configuration:** Removed expense form fields and table columns
- **Components:** Updated DashboardStats and UniversalPage

---

## Migration Notes

### For Existing Databases

If you have an existing database with expenses data:

1. **Backup your data** (if needed):
   ```sql
   COPY expenses TO '/tmp/expenses_backup.csv' CSV HEADER;
   ```

2. **Drop the expenses table**:
   ```sql
   DROP TABLE IF EXISTS expenses CASCADE;
   ```

3. **Drop related indexes** (if they exist):
   ```sql
   DROP INDEX IF EXISTS idx_expenses_user;
   DROP INDEX IF EXISTS idx_expenses_date;
   ```

### For Fresh Installations

Simply apply the updated `schema.sql` - expenses table will not be created.

---

## Verification

After removal, verify:

1. ✅ No expenses table in database
2. ✅ No expenses API routes accessible
3. ✅ Dashboard shows only 3 tabs
4. ✅ Dashboard stats shows only 3 cards
5. ✅ Recent activities shows properties and tenants only
6. ✅ No references to expenses in codebase

**Verification Query:**
```sql
-- Should return 0 rows
SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'expenses';
```

---

## Restoration

If expenses need to be restored in the future:

1. Restore `expenses` table in `schema.sql`
2. Restore API routes from Git history
3. Restore database service methods
4. Restore form/table configurations
5. Restore UI components
6. Update navigation and constants
7. Update documentation

**Note:** All removed code can be found in Git history before this removal commit.

---

**Removal Date:** December 2024  
**Status:** ✅ Complete  
**Database Tables:** 5 (users, user_profiles, properties, tenants, property_tenants)  
**Relationship Types:** All 3 types still present (One-to-One, One-to-Many, Many-to-Many)

