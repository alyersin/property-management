-- Migration: Remove Amenities Feature
-- Date: December 2024
-- Purpose: Remove amenities tables and data for simplified property management
-- 
-- This migration removes:
-- - amenities table
-- - property_amenities junction table
-- - amenities index
-- - all amenities data

-- ============================================
-- REMOVE AMENITIES TABLES AND DATA
-- ============================================

-- Drop the junction table first (due to foreign key constraints)
DROP TABLE IF EXISTS property_amenities CASCADE;

-- Drop the amenities table
DROP TABLE IF EXISTS amenities CASCADE;

-- Note: The index will be automatically dropped with the table
-- No need to explicitly drop: idx_amenities_category

-- ============================================
-- VERIFICATION QUERIES (Optional - run to verify)
-- ============================================

-- Verify tables are removed (should return 0 rows)
-- SELECT table_name 
-- FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('amenities', 'property_amenities');

-- Expected result: 0 rows (tables removed)

