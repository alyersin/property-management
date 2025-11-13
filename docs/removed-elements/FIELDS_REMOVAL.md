# Database Fields Removal - December 2024

## Overview

Several database fields have been removed from the Home Admin application to simplify the schema and reduce unnecessary tracking. This includes timestamp fields (`created_at`, `updated_at`) from all tables and user-specific fields (`role`, `last_login`) from the users table.

---

## Fields Removed

### 1. From `users` Table

**Removed Fields:**
- `role VARCHAR(50) DEFAULT 'user'` - User role/privilege level
- `last_login TIMESTAMP` - Last login timestamp
- `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP` - Account creation timestamp
- `updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP` - Last update timestamp

**Remaining Fields:**
- `id SERIAL PRIMARY KEY`
- `email VARCHAR(255) UNIQUE NOT NULL`
- `password VARCHAR(255) NOT NULL`
- `name VARCHAR(255) NOT NULL`

**Before:**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**After:**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL
);
```

---

### 2. From `user_profiles` Table

**Removed Fields:**
- `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
- `updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

**Remaining Fields:**
- `id SERIAL PRIMARY KEY`
- `user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE`

**Before:**
```sql
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**After:**
```sql
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE
);
```

---

### 3. From `properties` Table

**Removed Fields:**
- `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
- `updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
- `notes TEXT` - Additional notes field (removed December 2024)

**Remaining Fields:**
- `id SERIAL PRIMARY KEY`
- `user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE`
- `city VARCHAR(100) NOT NULL`
- `bedrooms INTEGER NOT NULL`
- `bathrooms INTEGER NOT NULL`
- `status VARCHAR(50) DEFAULT 'Available'`

---

### 4. From `tenants` Table

**Removed Fields:**
- `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
- `updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
- `phone VARCHAR(50)` - Phone number field (removed December 2024)
- `notes TEXT` - Additional notes field (removed December 2024)

**Remaining Fields:**
- `id SERIAL PRIMARY KEY`
- `user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE`
- `name VARCHAR(255) NOT NULL`
- `email VARCHAR(255) NOT NULL`
- `status VARCHAR(50) DEFAULT 'Active'`
- `UNIQUE(user_id, email)`

---

### 5. From `property_tenants` Table

**Removed Fields:**
- `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

**Remaining Fields:**
- `property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE`
- `tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE`
- `start_date DATE`
- `end_date DATE`
- `PRIMARY KEY (property_id, tenant_id)`

---

## Code Changes

### Database Service (`src/services/databaseService.js`)

**Changes:**
1. **`createUser()` method:**
   - Removed `role` parameter and column from INSERT
   - Removed `created_at` from RETURNING clause
   - Changed from: `INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role, created_at`
   - Changed to: `INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name`

2. **`addProperty()` method:**
   - Removed `notes` from INSERT statement
   - Changed from: `INSERT INTO properties (user_id, city, bedrooms, bathrooms, status, notes) VALUES ($1, $2, $3, $4, $5, $6)`
   - Changed to: `INSERT INTO properties (user_id, city, bedrooms, bathrooms, status) VALUES ($1, $2, $3, $4, $5)`

3. **`addTenant()` method:**
   - Removed `phone` and `notes` from INSERT statement
   - Changed from: `INSERT INTO tenants (user_id, name, email, phone, status, notes) VALUES ($1, $2, $3, $4, $5, $6)`
   - Changed to: `INSERT INTO tenants (user_id, name, email, status) VALUES ($1, $2, $3, $4)`

2. **`updateUser()` method:**
   - Removed `updated_at = CURRENT_TIMESTAMP` from UPDATE statement
   - Changed from: `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1`
   - Changed to: `UPDATE users SET ${setClause} WHERE id = $1`

3. **`updateUserProfile()` method:**
   - Removed `updated_at = CURRENT_TIMESTAMP` from UPDATE statement

4. **`getProperties()` method:**
   - Changed default ordering from `'created_at DESC'` to `'id DESC'`

5. **`getTenants()` method:**
   - Changed default ordering from `'created_at DESC'` to `'id DESC'`

6. **`getPropertyTenants()` method:**
   - Changed ORDER BY from `pt.created_at DESC` to `pt.property_id DESC`

7. **`getTenantProperties()` method:**
   - Changed ORDER BY from `pt.created_at DESC` to `pt.property_id DESC`

8. **`getRecentActivities()` method:**
   - Removed `created_at` from SELECT queries
   - Removed `getTimeAgo()` calls and time display
   - Changed ordering from `created_at DESC` to `id DESC`
   - Removed time-related fields from activity objects
   - Changed sorting to use ID instead of timestamp

9. **`getTimeAgo()` method:**
   - **Removed entirely** - no longer needed without timestamps

### Database Helpers (`src/services/dbHelpers.js`)

**Changes:**
1. **`createGetAll()` function:**
   - Changed default `orderBy` parameter from `'created_at DESC'` to `'id DESC'`

2. **`createUpdate()` function:**
   - Removed `updated_at = CURRENT_TIMESTAMP` from UPDATE statement
   - Changed from: `UPDATE ${tableName} SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND user_id = $2`
   - Changed to: `UPDATE ${tableName} SET ${setClause} WHERE id = $1 AND user_id = $2`

---

### API Routes

#### Registration Route (`src/app/api/auth/register/route.js`)

**Changes:**
- Removed `role: 'user'` from `createUser()` call
- Removed `role` from response object
- Removed `loginTime` from response object
- Updated comment to remove role reference

**Before:**
```javascript
const newUser = await databaseService.createUser({
  email,
  password: hashedPassword,
  name,
  role: 'user'
});

return NextResponse.json({
  success: true,
  user: {
    id: userWithoutPassword.id,
    email: userWithoutPassword.email,
    name: userWithoutPassword.name,
    role: userWithoutPassword.role,
    loginTime: new Date().toISOString()
  }
});
```

**After:**
```javascript
const newUser = await databaseService.createUser({
  email,
  password: hashedPassword,
  name
});

return NextResponse.json({
  success: true,
  user: {
    id: userWithoutPassword.id,
    email: userWithoutPassword.email,
    name: userWithoutPassword.name
  }
});
```

#### Login Route (`src/app/api/auth/login/route.js`)

**Changes:**
- Removed `DEMO_USER_ROLE` from required environment variables
- Removed `role` and `lastLogin` from demo user object
- Removed `role` and `loginTime` from response object

**Before:**
```javascript
const requiredVars = [
  'DEMO_USER_EMAIL', 'DEMO_USER_PASSWORD', 'DEMO_USER_NAME', 'DEMO_USER_ROLE'
];

return [{
  id: 1,
  email: process.env.DEMO_USER_EMAIL,
  password: process.env.DEMO_USER_PASSWORD,
  name: process.env.DEMO_USER_NAME,
  role: process.env.DEMO_USER_ROLE,
  createdAt: "2024-02-01T00:00:00Z",
  lastLogin: "2024-12-15T09:15:00Z"
}];

return NextResponse.json({
  success: true,
  user: {
    id: userWithoutPassword.id,
    email: userWithoutPassword.email,
    name: userWithoutPassword.name,
    role: userWithoutPassword.role,
    loginTime: new Date().toISOString()
  }
});
```

**After:**
```javascript
const requiredVars = [
  'DEMO_USER_EMAIL', 'DEMO_USER_PASSWORD', 'DEMO_USER_NAME'
];

return [{
  id: 1,
  email: process.env.DEMO_USER_EMAIL,
  password: process.env.DEMO_USER_PASSWORD,
  name: process.env.DEMO_USER_NAME
}];

return NextResponse.json({
  success: true,
  user: {
    id: userWithoutPassword.id,
    email: userWithoutPassword.email,
    name: userWithoutPassword.name
  }
});
```

#### Users Route (`src/app/api/users/[userId]/route.js`)

**Changes:**
- Updated comments to remove `role` references
- Changed example from `{ name: "New Name", role: "admin" }` to `{ name: "New Name" }`
- Removed "changing roles" from description

---

### UI Components

#### DashboardStats (`src/components/shared/DashboardStats.js`)

**Changes:**
- Removed `activity.time` display from recent activities
- Activities now show only message without timestamp

**Before:**
```javascript
<Text fontSize="sm" fontWeight="bold" color="text.primary">
  {activity.message}
</Text>
<Text fontSize="xs" color="text.muted">
  {activity.time}
</Text>
```

**After:**
```javascript
<Text fontSize="sm" fontWeight="bold" color="text.primary">
  {activity.message}
</Text>
```

---

## Impact

### Database Schema
- **Users table:** Reduced from 7 columns to 4 columns
- **User_profiles table:** Reduced from 4 columns to 2 columns
- **Properties table:** Reduced from 8 columns to 5 columns (removed created_at, updated_at, notes)
- **Tenants table:** Reduced from 9 columns to 5 columns (removed created_at, updated_at, phone, notes)
- **Property_tenants table:** Reduced from 5 columns to 4 columns

### Functionality Changes
- **No role-based access control:** All users have equal permissions
- **No login tracking:** Last login time is no longer recorded
- **No creation timestamps:** Cannot determine when records were created
- **No update timestamps:** Cannot determine when records were last modified
- **Ordering changed:** Records are now ordered by `id DESC` instead of `created_at DESC`
- **Recent activities simplified:** No longer shows "time ago" information

### Benefits
- **Simpler schema:** Fewer columns to maintain
- **Reduced complexity:** No timestamp management needed
- **Faster queries:** Fewer columns to select and update
- **Cleaner code:** Less timestamp handling logic

---

## Migration Notes

### For Existing Databases

If you have an existing database with these fields:

1. **Backup your data** (if needed):
   ```sql
   -- Backup users table
   COPY users TO '/tmp/users_backup.csv' CSV HEADER;
   ```

2. **Drop the columns**:
   ```sql
   -- Remove from users table
   ALTER TABLE users DROP COLUMN IF EXISTS role CASCADE;
   ALTER TABLE users DROP COLUMN IF EXISTS last_login CASCADE;
   ALTER TABLE users DROP COLUMN IF EXISTS created_at CASCADE;
   ALTER TABLE users DROP COLUMN IF EXISTS updated_at CASCADE;

   -- Remove from user_profiles table
   ALTER TABLE user_profiles DROP COLUMN IF EXISTS created_at CASCADE;
   ALTER TABLE user_profiles DROP COLUMN IF EXISTS updated_at CASCADE;

   -- Remove from properties table
   ALTER TABLE properties DROP COLUMN IF EXISTS created_at CASCADE;
   ALTER TABLE properties DROP COLUMN IF EXISTS updated_at CASCADE;

   -- Remove from tenants table
   ALTER TABLE tenants DROP COLUMN IF EXISTS created_at CASCADE;
   ALTER TABLE tenants DROP COLUMN IF EXISTS updated_at CASCADE;

   -- Remove from property_tenants table
   ALTER TABLE property_tenants DROP COLUMN IF EXISTS created_at CASCADE;
   ```

### For Fresh Installations

Simply apply the updated `schema.sql` - these fields will not be created.

---

## Verification

After removal, verify:

1. ✅ No `role` column in users table
2. ✅ No `last_login` column in users table
3. ✅ No `created_at` columns in any table
4. ✅ No `updated_at` columns in any table
5. ✅ API responses don't include removed fields
6. ✅ Recent activities don't show timestamps
7. ✅ Records ordered by ID instead of creation date

**Verification Queries:**
```sql
-- Check users table columns
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
-- Should return: id, email, password, name

-- Check for removed columns (should return 0 rows)
SELECT COUNT(*) FROM information_schema.columns 
WHERE table_name IN ('users', 'user_profiles', 'properties', 'tenants', 'property_tenants')
AND column_name IN ('role', 'last_login', 'created_at', 'updated_at');
```

---

## Restoration

If these fields need to be restored in the future:

1. Add columns back to `schema.sql`
2. Update database service methods to handle timestamps
3. Update API routes to include role/loginTime in responses
4. Restore `getTimeAgo()` method
5. Update UI components to display timestamps
6. Update documentation

**Note:** All removed code can be found in Git history before this removal commit.

---

**Removal Date:** December 2024  
**Status:** ✅ Complete  
**Tables Affected:** 5 (users, user_profiles, properties, tenants, property_tenants)  
**Fields Removed:** 14 total (role, last_login, 9 timestamp fields, phone, notes from tenants, notes from properties)

