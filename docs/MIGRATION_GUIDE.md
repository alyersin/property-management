# Migration Guide: Adding Multi-User Data Isolation

This guide explains the database changes made to implement proper multi-user data isolation in the Home Admin application.

## Overview

The application has been upgraded from a single-user demo to a production-ready multi-user system where each user can only see and manage their own properties, tenants, expenses, and transactions.

## Key Changes

### 1. Database Schema Updates

All business data tables now include a `user_id` foreign key to link records to their owners:

- **properties**: Added `user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE`
- **tenants**: Added `user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE`
- **transactions**: Added `user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE`
- **expenses**: Added `user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE`

### 2. Database Driver Change

- **Removed**: `mysql2` (MySQL driver)
- **Added**: `pg` (PostgreSQL driver v8.13.1)

### 3. Indexing Improvements

New indexes added for performance:
- `idx_properties_user` on `properties(user_id)`
- `idx_tenants_user` on `tenants(user_id)`
- `idx_transactions_user` on `transactions(user_id)`
- `idx_expenses_user` on `expenses(user_id)`

### 4. Data Integrity

- **Tenants**: Changed email from `UNIQUE` to `UNIQUE(user_id, email)` - allows same email across different users
- **Cascade Deletes**: All `user_id` foreign keys use `ON DELETE CASCADE` - ensures data cleanup when a user is deleted

## Migration Steps

### For New Installations

If you're setting up the application fresh, just run the updated schema:

```bash
# Start PostgreSQL container
docker start home-admin-postgres

# Run the schema script
docker exec -i home-admin-postgres psql -U postgres -d home_admin -f /docker-entrypoint-initdb.d/schema.sql
```

### For Existing Installations

If you have an existing database with data, you'll need to migrate:

```bash
# 1. Connect to your database
docker exec -it home-admin-postgres psql -U postgres -d home_admin

# 2. Add user_id columns (without NOT NULL constraint first)
ALTER TABLE properties ADD COLUMN user_id INTEGER;
ALTER TABLE tenants ADD COLUMN user_id INTEGER;
ALTER TABLE transactions ADD COLUMN user_id INTEGER;
ALTER TABLE expenses ADD COLUMN user_id INTEGER;

# 3. Set default user_id for existing data (use user ID 1 as default admin)
UPDATE properties SET user_id = 1 WHERE user_id IS NULL;
UPDATE tenants SET user_id = 1 WHERE user_id IS NULL;
UPDATE transactions SET user_id = 1 WHERE user_id IS NULL;
UPDATE expenses SET user_id = 1 WHERE user_id IS NULL;

# 4. Add foreign key constraints
ALTER TABLE properties ADD CONSTRAINT fk_properties_user 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE tenants ADD CONSTRAINT fk_tenants_user 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE transactions ADD CONSTRAINT fk_transactions_user 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE expenses ADD CONSTRAINT fk_expenses_user 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

# 5. Make user_id NOT NULL (now safe since all rows have values)
ALTER TABLE properties ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE tenants ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE transactions ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE expenses ALTER COLUMN user_id SET NOT NULL;

# 6. Drop old unique constraint on tenants.email
ALTER TABLE tenants DROP CONSTRAINT tenants_email_key;

# 7. Add new composite unique constraint
ALTER TABLE tenants ADD CONSTRAINT tenants_user_email_unique 
  UNIQUE (user_id, email);

# 8. Create indexes for performance
CREATE INDEX idx_properties_user ON properties(user_id);
CREATE INDEX idx_tenants_user ON tenants(user_id);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_expenses_user ON expenses(user_id);

# 9. Exit
\q
```

## Sample Data Distribution

The updated schema distributes sample data across the three demo users:

- **Admin User (user_id: 1)**: 2 properties, 2 tenants, 5 transactions, 4 expenses
- **Property Manager (user_id: 2)**: 1 property, 1 tenant, 1 transaction, 1 expense
- **Demo User (user_id: 3)**: 1 property, 1 tenant, 1 transaction, 1 expense

## Security Improvements

### Data Isolation
- All queries now filter by `user_id` to ensure users only see their own data
- Foreign key constraints prevent orphaned records
- Cascade deletes ensure data cleanup when users are removed

### API Security
All API endpoints now require `userId` parameters:
```javascript
// Before
await databaseService.getProperties()

// After
await databaseService.getProperties(userId)
```

### Backend Validation
All database operations validate `userId` and ensure users can only:
- View their own data
- Create records in their own account
- Update/delete their own records

## Environment Variables

Required environment variables for production:

```bash
# Enable database mode
USE_DATABASE=true

# Database connection
DATABASE_URL=postgresql://postgres:password@localhost:5432/home_admin

# JWT secrets (for authentication)
JWT_SECRET=your-super-secret-jwt-key-here
SESSION_SECRET=your-super-secret-session-key-here
```

## Testing Multi-User Functionality

1. **Login as Demo User** (configured in `.env`):
   - Email: `demo@homeadmin.ro` (or value from `DEMO_USER_EMAIL`)
   - Password: Value from `DEMO_USER_PASSWORD` in `.env`
   - **Note:** Additional users can be created via the registration page

2. **Create Additional Users**:
   - Email: `demo@homeadmin.ro`
   - Password: `demo123`
   - Should see: 1 property, 1 tenant, 1 transaction

## Rollback Plan

If you need to rollback to the old schema:

```bash
# Backup first!
docker exec home-admin-postgres pg_dump -U postgres home_admin > backup_before_rollback.sql

# Remove constraints and columns
ALTER TABLE properties DROP CONSTRAINT IF EXISTS fk_properties_user CASCADE;
ALTER TABLE tenants DROP CONSTRAINT IF EXISTS fk_tenants_user CASCADE;
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS fk_transactions_user CASCADE;
ALTER TABLE expenses DROP CONSTRAINT IF EXISTS fk_expenses_user CASCADE;

ALTER TABLE properties DROP COLUMN IF EXISTS user_id CASCADE;
ALTER TABLE tenants DROP COLUMN IF EXISTS user_id CASCADE;
ALTER TABLE transactions DROP COLUMN IF EXISTS user_id CASCADE;
ALTER TABLE expenses DROP COLUMN IF EXISTS user_id CASCADE;

# Restore old unique constraint on tenants
ALTER TABLE tenants ADD CONSTRAINT tenants_email_key UNIQUE (email);
```

## Next Steps

1. **Install dependencies**: `npm install`
2. **Restart database**: `docker start home-admin-postgres`
3. **Run migrations**: Follow the migration steps above
4. **Test**: Login with different users to verify data isolation
5. **Update API routes**: Ensure all API endpoints pass `userId` from authenticated sessions

## Support

If you encounter issues during migration, check:
1. Database logs: `docker logs home-admin-postgres`
2. Application logs: Check console output when running `npm run dev`
3. Foreign key constraints: Ensure users exist before assigning user_id

---

**Last Updated**: 2024-12-15
**Version**: 2.0.0 (Multi-User Production Ready)

