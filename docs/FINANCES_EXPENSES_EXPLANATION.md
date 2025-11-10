# Finances & Expenses Page – Combined Overview

The Home Admin application now uses a single **Finances & Expenses** page (`/finances`) to keep financial tracking simple. Instead of juggling separate Finances and Expenses tabs, everything lives in one place.

## What Changed

- ✅ **Single financial workspace:** incomes and expenses share one table called **Financial Records**.
- ✅ **Unified data entry:** one form captures type, amount, category, status, vendor, receipts, and notes.
- ✅ **Lightweight filtering:** quickly filter by status (Completed, Pending, Overdue) or search across description, category, or vendor.
- ✅ **Consistent actions:** export still works the same; add/edit/delete flows are unchanged but operate on the combined dataset.
- ❌ **Tenants tab removed:** tenant management, property-tenant assignments, and related database tables were removed for clarity.
- ❌ **Expenses page removed:** there is no `/expenses` route anymore; all expense tracking happens on `/finances`.

## Financial Records Fields

Each record captures both high-level cash flow and the detail previously stored on the dedicated expenses page:

- `type`: Income or Expense  
- `description`: Free-text summary  
- `amount`: Positive decimal value  
- `date`: Posting date  
- `category`: Rent, Taxes, Insurance, Repair, Utilities, Cleaning, Landscaping, Other  
- `status`: Completed, Pending, Overdue  
- `vendor`: Optional text for payee  
- `receipt`: Optional reference number  
- `notes`: Optional free-text details  

## How to Use the Page

1. **Add a record** – click *Add record*, choose Income or Expense, and fill in the fields you need.
2. **Search** – use the search bar to match description, category, or vendor values.
3. **Filter** – use the status filter to focus on pending or overdue items.
4. **Export** – export still pulls every record shown in the current view.

## Why the Change Helps

- Easier to explain: one page, one dataset, one story.
- Less navigation: no more switching between Finances and Expenses to chase numbers.
- Fewer database tables and API endpoints to maintain.
- Documentation and schema upgrades stay aligned with the simplified UI.

For migration details and the database changes behind this update, see:

- `docs/DATABASE_SCHEMA_VERIFICATION.md`
- `docs/removed-elements/REMOVED_ELEMENTS_DOCUMENTATION.md`
- `src/database/schema.sql`
