-- Migration Script: Add Multi-User Data Isolation
-- Run this script on existing databases to add user_id columns and constraints
-- For fresh installations, the main schema.sql already includes these changes

BEGIN;

-- Step 1: Add user_id columns (without NOT NULL constraint first)
ALTER TABLE properties ADD COLUMN IF NOT EXISTS user_id INTEGER;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS user_id INTEGER;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS user_id INTEGER;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS user_id INTEGER;

-- Step 2: Set default user_id for existing data (use user ID 1 as default admin)
UPDATE properties SET user_id = 1 WHERE user_id IS NULL;
UPDATE tenants SET user_id = 1 WHERE user_id IS NULL;
UPDATE transactions SET user_id = 1 WHERE user_id IS NULL;
UPDATE expenses SET user_id = 1 WHERE user_id IS NULL;

-- Step 3: Add foreign key constraints
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_properties_user'
    ) THEN
        ALTER TABLE properties ADD CONSTRAINT fk_properties_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_tenants_user'
    ) THEN
        ALTER TABLE tenants ADD CONSTRAINT fk_tenants_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_transactions_user'
    ) THEN
        ALTER TABLE transactions ADD CONSTRAINT fk_transactions_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_expenses_user'
    ) THEN
        ALTER TABLE expenses ADD CONSTRAINT fk_expenses_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Step 4: Make user_id NOT NULL (now safe since all rows have values)
ALTER TABLE properties ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE tenants ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE transactions ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE expenses ALTER COLUMN user_id SET NOT NULL;

-- Step 5: Update tenants email constraint (drop old unique, add composite unique)
DO $$ 
BEGIN
    -- Drop old unique constraint on tenants.email if it exists
    IF EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'tenants_email_key'
    ) THEN
        ALTER TABLE tenants DROP CONSTRAINT tenants_email_key;
    END IF;
    
    -- Add new composite unique constraint
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'tenants_user_email_unique'
    ) THEN
        ALTER TABLE tenants ADD CONSTRAINT tenants_user_email_unique 
        UNIQUE (user_id, email);
    END IF;
END $$;

-- Step 6: Create indexes for performance (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_properties_user ON properties(user_id);
CREATE INDEX IF NOT EXISTS idx_tenants_user ON tenants(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_user ON expenses(user_id);

COMMIT;

-- Verification queries (run these to verify migration)
-- SELECT 'properties' as table_name, COUNT(*) as total_rows, COUNT(DISTINCT user_id) as distinct_users FROM properties
-- UNION ALL
-- SELECT 'tenants', COUNT(*), COUNT(DISTINCT user_id) FROM tenants
-- UNION ALL
-- SELECT 'transactions', COUNT(*), COUNT(DISTINCT user_id) FROM transactions
-- UNION ALL
-- SELECT 'expenses', COUNT(*), COUNT(DISTINCT user_id) FROM expenses;

