-- PostgreSQL Database Schema for Home Admin Application
-- This schema supports multi-user data isolation where each user owns their properties, tenants, transactions, and expenses

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Profiles table (One-to-One with users)
-- Note: emergency_contact and emergency_phone fields removed for simplified form presentation
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    avatar_url VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    date_of_birth DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Properties table
-- Note: state, zip, and sqft fields removed for simplified form presentation
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms INTEGER NOT NULL,
    rent DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Available',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tenants table
-- Note: emergency_contact and emergency_phone fields removed for simplified form presentation
CREATE TABLE tenants (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, email)
);

-- Property-Tenants junction table (Many-to-Many)
CREATE TABLE property_tenants (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    tenant_id INTEGER REFERENCES tenants(id) ON DELETE CASCADE,
    lease_start DATE NOT NULL,
    lease_end DATE,
    rent_amount DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(property_id, tenant_id, lease_start)
);

-- Transactions table (for finances)
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'Income' or 'Expense'
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    property_id INTEGER REFERENCES properties(id),
    tenant_id INTEGER REFERENCES tenants(id),
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expenses table
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    category VARCHAR(100) NOT NULL,
    property_id INTEGER REFERENCES properties(id),
    vendor VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Paid',
    receipt VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_properties_user ON properties(user_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_tenants_user ON tenants(user_id);
CREATE INDEX idx_tenants_status ON tenants(status);
CREATE INDEX idx_property_tenants_property ON property_tenants(property_id);
CREATE INDEX idx_property_tenants_tenant ON property_tenants(tenant_id);
CREATE INDEX idx_property_tenants_status ON property_tenants(status);
CREATE INDEX idx_user_profiles_user ON user_profiles(user_id);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_expenses_user ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_category ON expenses(category);


-- No authentication users inserted - users are created via registration page
-- Demo user accounts are configured via environment variables (.env) for mock authentication only
-- Database serves only for proper accounts created via the register page

-- No sample user profiles - users will create their own profiles

-- No sample properties - users will add their own properties

-- No sample tenants - users will add their own tenants

-- No sample property-tenant relationships

-- No sample transactions - users will add their own transactions

-- No sample expenses - users will add their own expenses
