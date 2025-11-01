-- Migration: Remove Simplified Form Fields
-- Date: December 2024
-- Purpose: Remove fields that were simplified from forms for exam presentation
-- 
-- Fields to be removed:
-- Properties: state, zip, sqft
-- Tenants: emergency_contact, emergency_phone

-- ============================================
-- REMOVE FROM PROPERTIES TABLE
-- ============================================

-- Remove state column
ALTER TABLE properties DROP COLUMN IF EXISTS state;

-- Remove zip column  
ALTER TABLE properties DROP COLUMN IF EXISTS zip;

-- Remove sqft column
ALTER TABLE properties DROP COLUMN IF EXISTS sqft;

-- ============================================
-- REMOVE FROM TENANTS TABLE
-- ============================================

-- Remove emergency_contact column
ALTER TABLE tenants DROP COLUMN IF EXISTS emergency_contact;

-- Remove emergency_phone column
ALTER TABLE tenants DROP COLUMN IF EXISTS emergency_phone;

-- ============================================
-- REMOVE FROM USER_PROFILES TABLE
-- ============================================

-- Remove emergency_contact column from user profiles
ALTER TABLE user_profiles DROP COLUMN IF EXISTS emergency_contact;

-- Remove emergency_phone column from user profiles
ALTER TABLE user_profiles DROP COLUMN IF EXISTS emergency_phone;

-- ============================================
-- VERIFICATION QUERIES (Optional - run to verify)
-- ============================================

-- Verify properties table structure
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'properties' 
-- ORDER BY ordinal_position;

-- Verify tenants table structure
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'tenants' 
-- ORDER BY ordinal_position;

