-- VERIFY SCHEMA: fresh installation checklist
-- Run these queries in psql or DBeaver after applying src/database/schema.sql

-- ============================================
-- Confirm legacy tables are gone
-- ============================================
SELECT
    COUNT(*) = 0 AS tenants_tables_absent
FROM information_schema.tables
WHERE table_name IN ('tenants', 'property_tenants', 'transactions');

-- ============================================
-- Inspect expenses columns
-- ============================================
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'expenses'
ORDER BY ordinal_position;

-- Expected columns:
-- id, user_id, description, amount, date, notes, created_at, updated_at

-- ============================================
-- Check expenses indexes
-- ============================================
SELECT
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'expenses'
ORDER BY indexname;

-- Expected indexes:
-- idx_expenses_user, idx_expenses_date

-- ============================================
-- Quick PASS/FAIL summary
-- ============================================
SELECT
    'expenses columns' AS check_type,
    CASE
        WHEN COUNT(*) FILTER (WHERE column_name = 'notes') = 1
         AND COUNT(*) = 8
        THEN '✅ PASS - expenses schema matches expected columns'
        ELSE '❌ FAIL - Review expenses schema'
    END AS result
FROM information_schema.columns
WHERE table_name = 'expenses'
UNION ALL
SELECT
    'legacy tables removed' AS check_type,
    CASE
        WHEN COUNT(*) = 0 THEN '✅ PASS - tenants/transactions tables absent'
        ELSE '❌ FAIL - drop legacy tables'
    END AS result
FROM information_schema.tables
WHERE table_name IN ('tenants', 'property_tenants', 'transactions');

