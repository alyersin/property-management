# Expenses Page – Utility Tracking

The Home Admin application now focuses on a single **Expenses** page (`/expenses`) dedicated to utility costs. Monthly income is inferred from property rents, so only outgoing utility payments need to be captured here.

## What Changed

- ✅ **Expenses-only UI:** the former Finances page has been replaced with an Expenses view that lets you track any utility or operating cost via free-form descriptions.
- ✅ **Simplified data entry:** the form captures description, amount, date, and optional notes—no income toggle or extra billing fields required.
- ✅ **Cleaner database model:** the `financial_records` table has been replaced with an `expenses` table tailored for utilities.
- ✅ **Dashboard alignment:** monthly income now derives from occupied property rent, while expenses aggregate from utility records.

## Expense Fields

- `description`: short summary of the expense  
- `amount`: decimal amount stored as a positive value  
- `date`: posting date  
- `notes`: optional free-text details  

## How to Use the Page

1. **Add an expense** – click *Add expense* and enter the bill details.
2. **Search & filter** – search across description or notes.
3. **Export** – export downloads the currently filtered view for reporting or reconciliation.

## Why the Change Helps

- Keeps income logic tied to property rent values.
- Reduces data entry to only actionable utility bills.
- Simplifies reporting and schema maintenance.

For schema specifics and verification, refer to:

- `docs/DATABASE_SCHEMA_VERIFICATION.md`
- `docs/VERIFY_MIGRATION.sql`
- `src/database/schema.sql`
