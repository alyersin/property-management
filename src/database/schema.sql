-- PostgreSQL Database Schema for Home Admin Application
-- This schema supports multi-user data isolation where each user owns their properties and tenants.

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL
);

-- User Profiles table (One-to-One with users)
-- Note: phone field removed for simplified form presentation
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE
);

-- Properties table
-- Note: state, zip, sqft, and notes fields removed for simplified form presentation
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    city VARCHAR(100) NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'Available'
);

-- Tenants table
-- Note: phone and notes fields removed for simplified form presentation
CREATE TABLE tenants (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    UNIQUE(user_id, email)
);

-- Property-Tenants junction table (Many-to-Many relationship)
CREATE TABLE property_tenants (
    property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    start_date DATE,
    end_date DATE,
    PRIMARY KEY (property_id, tenant_id)
);

-- Indexes for better performance
CREATE INDEX idx_properties_user ON properties(user_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_user_profiles_user ON user_profiles(user_id);
CREATE INDEX idx_tenants_user ON tenants(user_id);
CREATE INDEX idx_tenants_status ON tenants(status);
CREATE INDEX idx_property_tenants_property ON property_tenants(property_id);
CREATE INDEX idx_property_tenants_tenant ON property_tenants(tenant_id);


-- No authentication users inserted - users are created via registration page
-- Demo user accounts are configured via environment variables (.env) for mock authentication only
-- Database serves only for proper accounts created via the register page

-- No sample user profiles - users will create their own profiles

-- No sample properties - users will add their own properties

-- No sample tenants - users will add their own tenants
