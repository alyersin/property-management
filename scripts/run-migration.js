// Script to run database migration: Remove Simplified Form Fields
// Usage: node scripts/run-migration.js
// Requires: DATABASE_URL environment variable

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Try to load .env.local if dotenv is available (optional)
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // dotenv not installed, use environment variables directly
}

async function runMigration() {
  // Get database URL from environment
  const databaseUrl = process.env.DATABASE_URL || 
    process.env.POSTGRES_URL || 
    'postgresql://user:password@localhost:5432/homeadmin';

  console.log('🔌 Connecting to database...');
  console.log(`📍 Database URL: ${databaseUrl.replace(/:[^:@]+@/, ':****@')}`); // Hide password

  const pool = new Pool({
    connectionString: databaseUrl,
  });

  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, '../src/database/migration_remove_simplified_fields.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('\n📄 Running migration: Remove Simplified Form Fields\n');

    // Execute each command separately for better error handling
    const commands = [
      'ALTER TABLE properties DROP COLUMN IF EXISTS state;',
      'ALTER TABLE properties DROP COLUMN IF EXISTS zip;',
      'ALTER TABLE properties DROP COLUMN IF EXISTS sqft;',
      'ALTER TABLE tenants DROP COLUMN IF EXISTS emergency_contact;',
      'ALTER TABLE tenants DROP COLUMN IF EXISTS emergency_phone;',
      'ALTER TABLE user_profiles DROP COLUMN IF EXISTS emergency_contact;',
      'ALTER TABLE user_profiles DROP COLUMN IF EXISTS emergency_phone;',
    ];

    for (const command of commands) {
      try {
        await pool.query(command);
        const table = command.includes('properties') ? 'properties' : 'tenants';
        const column = command.match(/DROP COLUMN IF EXISTS (\w+)/)?.[1];
        console.log(`✅ Removed ${column} from ${table} table`);
      } catch (error) {
        if (error.message.includes('does not exist')) {
          console.log(`ℹ️  Column already removed (or doesn't exist)`);
        } else {
          throw error;
        }
      }
    }

    console.log('\n✅ Migration completed successfully!\n');

    // Verify the changes
    console.log('🔍 Verifying changes...\n');
    
    const propertiesCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'properties' 
      ORDER BY column_name;
    `);
    
    const tenantsCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'tenants' 
      ORDER BY column_name;
    `);

    const propertiesColumns = propertiesCheck.rows.map(r => r.column_name);
    const tenantsColumns = tenantsCheck.rows.map(r => r.column_name);

    console.log('Properties table columns:');
    console.log('  ' + propertiesColumns.join(', '));
    
    console.log('\nTenants table columns:');
    console.log('  ' + tenantsColumns.join(', '));

    // Check if removed columns are gone
    const removedPropertiesCols = ['state', 'zip', 'sqft'];
    const removedTenantsCols = ['emergency_contact', 'emergency_phone'];
    const removedUserProfilesCols = ['emergency_contact', 'emergency_phone'];
    
    const userProfilesCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'user_profiles' 
      ORDER BY column_name;
    `);

    const userProfilesColumns = userProfilesCheck.rows.map(r => r.column_name);

    console.log('\nUser Profiles table columns:');
    console.log('  ' + userProfilesColumns.join(', '));

    const stillInProperties = removedPropertiesCols.filter(col => propertiesColumns.includes(col));
    const stillInTenants = removedTenantsCols.filter(col => tenantsColumns.includes(col));
    const stillInUserProfiles = removedUserProfilesCols.filter(col => userProfilesColumns.includes(col));

    if (stillInProperties.length === 0 && stillInTenants.length === 0 && stillInUserProfiles.length === 0) {
      console.log('\n✨ Verification passed! All removed columns are gone.\n');
    } else {
      console.log('\n⚠️  Warning: Some columns may still exist:');
      if (stillInProperties.length > 0) {
        console.log(`   Properties: ${stillInProperties.join(', ')}`);
      }
      if (stillInTenants.length > 0) {
        console.log(`   Tenants: ${stillInTenants.join(', ')}`);
      }
      if (stillInUserProfiles.length > 0) {
        console.log(`   User Profiles: ${stillInUserProfiles.join(', ')}`);
      }
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the migration
runMigration().catch(console.error);

