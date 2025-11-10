-- VERIFY SCHEMA: fresh installation checklist
-- Run these queries in psql or DBeaver after applying src/database/schema.sql

-- ============================================
-- Confirm legacy tables are gone
-- ============================================
SELECT
    COUNT(*) = 0 AS tenants_tables_absent
FROM information_schema.tables
WHERE table_name IN ('tenants', 'property_tenants', 'transactions', 'expenses');

-- ============================================
-- Inspect financial_records columns
-- ============================================
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'financial_records'
ORDER BY ordinal_position;

-- Expected columns:
-- id, user_id, type, description, amount, date, category, status, vendor,
-- receipt, notes, created_at, updated_at

-- ============================================
-- Check financial_records indexes
-- ============================================
SELECT
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'financial_records'
ORDER BY indexname;

-- Expected indexes:
-- idx_financial_records_user, idx_financial_records_date,
-- idx_financial_records_type, idx_financial_records_status

-- ============================================
-- Quick PASS/FAIL summary
-- ============================================
SELECT
    'financial_records columns' AS check_type,
    CASE
        WHEN COUNT(*) FILTER (WHERE column_name IN ('type','status','vendor','receipt')) = 4
         AND COUNT(*) = 13
        THEN '✅ PASS - financial_records schema matches expected columns'
        ELSE '❌ FAIL - Review financial_records schema'
    END AS result
FROM information_schema.columns
WHERE table_name = 'financial_records'
UNION ALL
SELECT
    'legacy tables removed' AS check_type,
    CASE
        WHEN COUNT(*) = 0 THEN '✅ PASS - tenants/transactions tables absent'
        ELSE '❌ FAIL - drop legacy tables'
    END AS result
FROM information_schema.tables
WHERE table_name IN ('tenants', 'property_tenants', 'transactions', 'expenses');

