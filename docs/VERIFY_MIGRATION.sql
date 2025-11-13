-- VERIFY SCHEMA: fresh installation checklist
-- Run these queries in psql or DBeaver after applying src/database/schema.sql
-- This verifies the current schema includes all required tables and relationships

-- ============================================
-- Verify all required tables exist
-- ============================================
SELECT
    table_name,
    CASE 
        WHEN table_name IN ('users', 'user_profiles', 'properties', 'tenants', 'property_tenants')
        THEN '✅ Required table'
        ELSE '⚠️ Unexpected table'
    END AS status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Expected tables: users, user_profiles, properties, tenants, property_tenants

-- ============================================
-- Verify tenants table structure
-- ============================================
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'tenants'
ORDER BY ordinal_position;

-- Expected columns: id, user_id, name, email, phone, status, notes

-- ============================================
-- Verify property_tenants junction table
-- ============================================
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'property_tenants'
ORDER BY ordinal_position;

-- Expected columns: property_id, tenant_id, start_date, end_date

-- ============================================
-- Check all indexes
-- ============================================
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('properties', 'tenants', 'property_tenants')
ORDER BY tablename, indexname;

-- Expected indexes:
-- properties: idx_properties_user, idx_properties_status
-- tenants: idx_tenants_user, idx_tenants_status
-- property_tenants: idx_property_tenants_property, idx_property_tenants_tenant

-- ============================================
-- Quick PASS/FAIL summary
-- ============================================
SELECT
    'Required tables' AS check_type,
    CASE
        WHEN COUNT(*) FILTER (WHERE table_name IN ('users', 'user_profiles', 'properties', 'tenants', 'property_tenants')) = 5
        THEN '✅ PASS - All required tables present'
        ELSE '❌ FAIL - Missing required tables'
    END AS result
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
UNION ALL
SELECT
    'Tenants table' AS check_type,
    CASE
        WHEN COUNT(*) = 7 THEN '✅ PASS - tenants schema correct'
        ELSE '❌ FAIL - Review tenants schema'
    END AS result
FROM information_schema.columns
WHERE table_name = 'tenants'
UNION ALL
SELECT
    'Property-Tenants junction' AS check_type,
    CASE
        WHEN COUNT(*) = 4 THEN '✅ PASS - property_tenants schema correct'
        ELSE '❌ FAIL - Review property_tenants schema'
    END AS result
FROM information_schema.columns
WHERE table_name = 'property_tenants';

