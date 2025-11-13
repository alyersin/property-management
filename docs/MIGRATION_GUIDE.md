# Database Schema Guide: Multi-User Data Isolation

> **Update – December 2024**  
> Tenant management has been restored. The database now includes `tenants` and `property_tenants` tables.

## Important Note

**This guide explains the database schema design. For fresh installations, you don't need to run migrations.**

If you're using Docker and always start fresh (delete volumes), the `schema.sql` file runs automatically. See `docker-compose.yml` for details.

**To reset database:**
```bash
docker-compose down -v  # -v removes volumes
docker-compose up -d    # Fresh start with latest schema.sql
```

---

This guide explains the database schema design and how multi-user data isolation works in the Home Admin application.

## Overview

The application has been upgraded from a single-user demo to a production-ready multi-user system where each user can only see and manage their own properties and tenants.

> **Note:** The expenses feature has been removed as of December 2024. See [EXPENSES_REMOVAL.md](./removed-elements/EXPENSES_REMOVAL.md) for details.

## Key Changes

### 1. Database Schema Updates

All business data tables now include a `user_id` foreign key to link records to their owners:

- **properties**: `user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE`
- **tenants**: `user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE`

Additionally, the **property_tenants** junction table enables many-to-many relationships between properties and tenants.

### 2. Database Driver Change

- **Removed**: `mysql2` (MySQL driver)
- **Added**: `pg` (PostgreSQL driver v8.13.1)

### 3. Indexing Improvements

New indexes added for performance:
- `idx_properties_user` on `properties(user_id)`
- `idx_properties_status` on `properties(status)`
- `idx_tenants_user` on `tenants(user_id)`
- `idx_tenants_status` on `tenants(status)`
- `idx_property_tenants_property` on `property_tenants(property_id)`
- `idx_property_tenants_tenant` on `property_tenants(tenant_id)`

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

# 3. Set default user_id for existing data (use user ID 1 as default admin)
UPDATE properties SET user_id = 1 WHERE user_id IS NULL;
UPDATE tenants SET user_id = 1 WHERE user_id IS NULL;

# 4. Add foreign key constraints
ALTER TABLE properties ADD CONSTRAINT fk_properties_user 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE tenants ADD CONSTRAINT fk_tenants_user 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

# 5. Make user_id NOT NULL (now safe since all rows have values)
ALTER TABLE properties ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE tenants ALTER COLUMN user_id SET NOT NULL;

# 6. Drop old unique constraint on tenants.email
ALTER TABLE tenants DROP CONSTRAINT tenants_email_key;

# 7. Add new composite unique constraint
ALTER TABLE tenants ADD CONSTRAINT tenants_user_email_unique 
  UNIQUE (user_id, email);

# 8. Create indexes for performance
CREATE INDEX idx_properties_user ON properties(user_id);
CREATE INDEX idx_tenants_user ON tenants(user_id);

# 9. Exit
\q
```

## Sample Data Distribution

The updated schema distributes sample data across the three demo users:

- **Admin User (user_id: 1)**: 2 properties, 2 tenants
- **Property Manager (user_id: 2)**: 1 property, 1 tenant
- **Demo User (user_id: 3)**: 1 property, 1 tenant

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
   - Should see: 1 property, 1 tenant

## Rollback Plan

If you need to rollback to the old schema:

```bash
# Backup first!
docker exec home-admin-postgres pg_dump -U postgres home_admin > backup_before_rollback.sql

# Remove constraints and columns
# Note: This rollback script is for historical reference only.
# The expenses and transactions tables have been removed from the application.
ALTER TABLE properties DROP CONSTRAINT IF EXISTS fk_properties_user CASCADE;
ALTER TABLE tenants DROP CONSTRAINT IF EXISTS fk_tenants_user CASCADE;

ALTER TABLE properties DROP COLUMN IF EXISTS user_id CASCADE;
ALTER TABLE tenants DROP COLUMN IF EXISTS user_id CASCADE;

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

