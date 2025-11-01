-- VERIFY MIGRATION: Check if fields are removed
-- Run this in DBeaver or psql to verify the migration worked

-- ============================================
-- Check Properties Table
-- ============================================
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'properties' 
ORDER BY ordinal_position;

-- Expected columns: id, user_id, address, city, bedrooms, bathrooms, rent, status, notes, created_at, updated_at
-- Should NOT see: state, zip, sqft

-- ============================================
-- Check Tenants Table
-- ============================================
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'tenants' 
ORDER BY ordinal_position;

-- Expected columns: id, user_id, name, email, phone, status, notes, created_at, updated_at
-- Should NOT see: emergency_contact, emergency_phone

-- ============================================
-- Check User Profiles Table
-- ============================================
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;

-- Expected columns: id, user_id, bio, avatar_url, phone, address, date_of_birth, created_at, updated_at
-- Should NOT see: emergency_contact, emergency_phone

-- ============================================
-- Quick Check (returns TRUE if fields are gone)
-- ============================================
SELECT 
    'Properties columns check' as check_type,
    CASE 
        WHEN COUNT(*) FILTER (WHERE column_name IN ('state', 'zip', 'sqft')) = 0 
        THEN '✅ PASS - Fields removed'
        ELSE '❌ FAIL - Fields still exist'
    END as result
FROM information_schema.columns 
WHERE table_name = 'properties'
UNION ALL
SELECT 
    'Tenants columns check' as check_type,
    CASE 
        WHEN COUNT(*) FILTER (WHERE column_name IN ('emergency_contact', 'emergency_phone')) = 0 
        THEN '✅ PASS - Fields removed'
        ELSE '❌ FAIL - Fields still exist'
    END as result
FROM information_schema.columns 
WHERE table_name = 'tenants'
UNION ALL
SELECT 
    'User Profiles columns check' as check_type,
    CASE 
        WHEN COUNT(*) FILTER (WHERE column_name IN ('emergency_contact', 'emergency_phone')) = 0 
        THEN '✅ PASS - Fields removed'
        ELSE '❌ FAIL - Fields still exist'
    END as result
FROM information_schema.columns 
WHERE table_name = 'user_profiles';

