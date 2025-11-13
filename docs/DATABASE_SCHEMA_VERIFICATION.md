# Database Schema Verification - December 2024

## Summary

Fresh deployments only require `src/database/schema.sql`. Running it against a new PostgreSQL instance creates exactly five tables:

- `users`
- `user_profiles`
- `properties`
- `tenants`
- `property_tenants` (junction table for many-to-many relationship)

## Verification Checklist

| Check | Command | Expectation |
|-------|---------|-------------|
| Tables created | `\dt` | The five tables listed above |
| `tenants` columns | see SQL below | `id, user_id, name, email, status` |
| `properties` columns | see SQL below | `id, user_id, city, bedrooms, bathrooms, status` |
| `property_tenants` columns | see SQL below | `property_id, tenant_id, start_date, end_date` |
| Indexes | see SQL below | `idx_properties_user`, `idx_tenants_user`, `idx_property_tenants_property`, `idx_property_tenants_tenant` |

## Useful SQL

```sql
-- list tables
\dt

-- inspect tenants columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'tenants'
ORDER BY ordinal_position;

-- inspect property_tenants columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'property_tenants'
ORDER BY ordinal_position;

-- inspect all indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename IN ('tenants', 'property_tenants', 'properties')
ORDER BY tablename, indexname;
```

## Relationship Types

The database includes all three SQL relationship types:

1. **One-to-One (1:1)**: `users` ↔ `user_profiles`
2. **One-to-Many (1:N)**: 
   - `users` → `properties`
   - `users` → `tenants`
3. **Many-to-Many (N:M)**: `properties` ↔ `tenants` (via `property_tenants` junction table)

## Notes

- Running only `schema.sql` keeps the application and documentation in sync.
- The `property_tenants` table enables the many-to-many relationship between properties and tenants.
- Each user's data is isolated through `user_id` foreign keys on all business tables. 

