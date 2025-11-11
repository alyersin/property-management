# Database Schema Verification - November 2025

## Summary

Fresh deployments only require `src/database/schema.sql`. Running it against a new PostgreSQL instance creates exactly four tables:

- `users`
- `user_profiles`
- `properties`
- `expenses`

No tenant-related tables remain (`tenants`, `property_tenants`, `transactions` are absent).

## Verification Checklist

| Check | Command | Expectation |
|-------|---------|-------------|
| Tables created | `\dt` | The four tables listed above |
| `expenses` columns | see SQL below | `id, user_id, description, amount, date, notes, created_at, updated_at` |
| Indexes | see SQL below | `idx_expenses_user`, `idx_expenses_date` |

## Useful SQL

```sql
-- list tables
\dt

-- inspect expenses columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'expenses'
ORDER BY ordinal_position;

-- inspect expenses indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'expenses'
ORDER BY indexname;
```

## Notes

- Running only `schema.sql` keeps the application and documentation in sync.
- Legacy migration scripts were removed for a clean slate. Restore them from Git history only if you need to patch an existing database. 

