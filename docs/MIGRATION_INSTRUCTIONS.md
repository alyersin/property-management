# Migration Instructions - Remove Simplified Fields

## Overview

This migration removes the following fields from your database:
- **Properties table**: `state`, `zip`, `sqft`
- **Tenants table**: `emergency_contact`, `emergency_phone`
- **User Profiles table**: `emergency_contact`, `emergency_phone`

## Method 1: Using psql CLI

### Step 1: Connect to your database

```bash
psql -U your_username -d your_database_name -h your_host
```

Or if using a connection string:
```bash
psql "postgresql://username:password@host:port/database_name"
```

### Step 2: Run the migration

**Option A: Run from file**
```bash
psql -U your_username -d your_database_name -f src/database/migration_remove_simplified_fields.sql
```

**Option B: Copy and paste SQL**
1. Open the file: `src/database/migration_remove_simplified_fields.sql`
2. Copy all the SQL commands
3. Paste into your psql terminal
4. Press Enter

### Step 3: Verify the changes

Run these verification queries in psql:

```sql
-- Check properties table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'properties' 
ORDER BY ordinal_position;

-- Check tenants table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tenants' 
ORDER BY ordinal_position;
```

You should **NOT** see:
- `state`, `zip`, `sqft` in properties table
- `emergency_contact`, `emergency_phone` in tenants table  
- `emergency_contact`, `emergency_phone` in user_profiles table

## Method 2: Using DBeaver

### Step 1: Open DBeaver and connect to your database

1. Connect to your PostgreSQL database in DBeaver
2. Right-click on your database name in the database navigator
3. Select **SQL Editor** → **New SQL Script**

### Step 2: Open the migration file

1. Click **File** → **Open File** (or press `Ctrl+O`)
2. Navigate to: `src/database/migration_remove_simplified_fields.sql`
3. Open the file

### Step 3: Review and execute

1. Review the SQL commands in the script
2. Click the **Execute SQL Script** button (or press `Ctrl+Alt+X`)
3. Wait for "Success" message in the log

### Step 4: Verify the changes

Run these verification queries in a new SQL Editor:

```sql
-- Check properties table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'properties' 
ORDER BY ordinal_position;

-- Check tenants table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tenants' 
ORDER BY ordinal_position;
```

**Alternative verification in DBeaver:**
1. Expand your database in the navigator
2. Navigate to: **Schemas** → **public** → **Tables**
3. Right-click on `properties` table → **View Structure**
4. Right-click on `tenants` table → **View Structure**
5. Verify the removed columns are not present

## What the Migration Does

The migration script runs these commands:

```sql
-- Remove from properties table
ALTER TABLE properties DROP COLUMN IF EXISTS state;
ALTER TABLE properties DROP COLUMN IF EXISTS zip;
ALTER TABLE properties DROP COLUMN IF EXISTS sqft;

-- Remove from tenants table
ALTER TABLE properties DROP COLUMN IF EXISTS emergency_contact;
ALTER TABLE tenants DROP COLUMN IF EXISTS emergency_phone;
```

**Note**: Using `IF EXISTS` makes the migration safe to run multiple times - it won't error if columns are already removed.

### Step 5: Refresh DBeaver Diagram (If Using DBeaver)

After running the migration, refresh your DBeaver ERD diagram:

1. **Close the ERD diagram** (if open)
2. **Refresh database connection**: Right-click database → **Refresh** (or press `F5`)
3. **Regenerate ERD**: Right-click database → **View Diagram** (or **ER Diagram**)
4. If still showing old fields:
   - Disconnect from database
   - Close and reopen DBeaver
   - Reconnect and regenerate diagram

**Note:** The ERD reflects your actual database schema, so once columns are removed, refreshing should show the updated structure.

## Troubleshooting

### Error: "column does not exist"
- This is okay! It means the column was already removed
- The `IF EXISTS` clause handles this gracefully

### Error: "permission denied"
- Make sure your database user has ALTER TABLE permissions
- You may need to run as a database administrator

### Error: "cannot drop column because of foreign key"
- This shouldn't happen with these fields, but if it does:
  1. Check for any views or triggers that reference these columns
  2. Drop them first, then re-run the migration

## After Migration

Once the migration is complete:
- ✅ Database schema matches simplified forms
- ✅ No more unused columns in database
- ✅ Service layer is already updated to work without these fields
- ✅ Application will work correctly with the simplified schema

## Rollback (If Needed)

If you need to restore these fields later, you can use:

```sql
-- Properties table
ALTER TABLE properties ADD COLUMN state VARCHAR(50);
ALTER TABLE properties ADD COLUMN zip VARCHAR(20);
ALTER TABLE properties ADD COLUMN sqft INTEGER;

-- Tenants table
ALTER TABLE tenants ADD COLUMN emergency_contact VARCHAR(255);
ALTER TABLE tenants ADD COLUMN emergency_phone VARCHAR(50);
```

Note: This will create empty/null values for existing rows.

