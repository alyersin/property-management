# Database Schema Verification - November 2025

## Summary

Fresh deployments only require `src/database/schema.sql`. Running it against a new PostgreSQL instance creates exactly four tables:

- `users`
- `user_profiles`
- `properties`
- `financial_records`

No tenant-related tables remain (`tenants`, `property_tenants`, `transactions`, `expenses` are absent).

## Verification Checklist

| Check | Command | Expectation |
|-------|---------|-------------|
| Tables created | `\dt` | The four tables listed above |
| `financial_records` columns | see SQL below | `id, user_id, type, description, amount, date, category, status, vendor, receipt, notes, created_at, updated_at` |
| Indexes | see SQL below | `idx_financial_records_user`, `idx_financial_records_date`, `idx_financial_records_type`, `idx_financial_records_status` |

## Useful SQL

```sql
-- list tables
\dt

-- inspect financial_records columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'financial_records'
ORDER BY ordinal_position;

-- inspect financial_records indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'financial_records'
ORDER BY indexname;
```

## Notes

- Running only `schema.sql` keeps the application and documentation in sync.
- Legacy migration scripts were removed for a clean slate. Restore them from Git history only if you need to patch an existing database. 

