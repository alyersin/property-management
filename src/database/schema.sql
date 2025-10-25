-- PostgreSQL Database Schema for Home Admin Application
-- This schema is designed to support the current JSON data structure

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

-- Properties table
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip VARCHAR(20) NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms INTEGER NOT NULL,
    sqft INTEGER NOT NULL,
    rent DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Available',
    tenant_id INTEGER REFERENCES tenants(id),
    tenant_email VARCHAR(255),
    tenant_phone VARCHAR(50),
    lease_end DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tenants table
CREATE TABLE tenants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    property_id INTEGER REFERENCES properties(id),
    lease_start DATE,
    lease_end DATE,
    rent_amount DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'Active',
    emergency_contact VARCHAR(255),
    emergency_phone VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table (for finances)
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
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
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_tenant ON properties(tenant_id);
CREATE INDEX idx_tenants_property ON tenants(property_id);
CREATE INDEX idx_tenants_status ON tenants(status);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_category ON expenses(category);

-- Insert sample data (matching JSON structure)
INSERT INTO users (email, password, name, role) VALUES
('admin@homeadmin.com', 'password', 'Admin User', 'admin'),
('manager@homeadmin.com', 'manager123', 'Property Manager', 'manager'),
('demo@homeadmin.com', 'demo123', 'Demo User', 'user');

-- Insert sample properties
INSERT INTO properties (address, city, state, zip, bedrooms, bathrooms, sqft, rent, status, notes) VALUES
('123 Main Street', 'San Francisco', 'CA', '94102', 3, 2, 1200, 3500.00, 'Occupied', 'Well-maintained property with recent renovations.'),
('456 Oak Avenue', 'San Francisco', 'CA', '94103', 2, 1, 900, 2800.00, 'Available', 'Recently renovated kitchen and bathroom.'),
('789 Pine Road', 'San Francisco', 'CA', '94107', 3, 2, 1800, 4500.00, 'Renovating', 'Needs new flooring in living room.'),
('321 Elm Street', 'San Francisco', 'CA', '94105', 4, 3, 2200, 5500.00, 'Occupied', 'Luxury property with modern amenities.');

-- Insert sample tenants
INSERT INTO tenants (name, email, phone, property_id, lease_start, lease_end, rent_amount, status, emergency_contact, emergency_phone, notes) VALUES
('John Smith', 'john@email.com', '(555) 123-4567', 1, '2024-01-01', '2024-12-31', 3500.00, 'Active', 'Jane Smith', '(555) 123-4568', 'Reliable tenant, always pays on time.'),
('Mike Davis', 'mike@email.com', '(555) 456-7890', 3, '2024-02-01', '2024-08-15', 4500.00, 'Active', 'Lisa Davis', '(555) 456-7891', 'Property under renovation, temporary arrangement.'),
('Sarah Johnson', 'sarah@email.com', '(555) 789-0123', 4, '2024-03-01', '2025-06-30', 5500.00, 'Active', 'Tom Johnson', '(555) 789-0124', 'Long-term tenant, excellent payment history.'),
('Alex Wilson', 'alex@email.com', '(555) 321-6547', NULL, NULL, NULL, NULL, 'Prospective', 'Maria Wilson', '(555) 321-6548', 'Looking for 2-bedroom apartment, budget $3000/month.');

-- Update properties with tenant information
UPDATE properties SET tenant_email = 'john@email.com', tenant_phone = '(555) 123-4567', lease_end = '2024-12-31' WHERE id = 1;
UPDATE properties SET tenant_email = 'mike@email.com', tenant_phone = '(555) 456-7890', lease_end = '2024-08-15' WHERE id = 3;
UPDATE properties SET tenant_email = 'sarah@email.com', tenant_phone = '(555) 789-0123', lease_end = '2025-06-30' WHERE id = 4;

-- Insert sample transactions
INSERT INTO transactions (type, description, amount, date, property_id, tenant_id, category, status) VALUES
('Income', 'Rent Payment - John Smith', 3500.00, '2024-12-01', 1, 1, 'Rent', 'Completed'),
('Income', 'Rent Payment - Sarah Johnson', 5500.00, '2024-12-01', 4, 3, 'Rent', 'Completed'),
('Expense', 'Property Tax - 123 Main Street', -800.00, '2024-12-05', 1, NULL, 'Taxes', 'Completed'),
('Expense', 'Repair - AC Unit', -500.00, '2024-12-15', 2, NULL, 'Repair', 'Completed'),
('Expense', 'Insurance Premium', -1200.00, '2024-12-10', NULL, NULL, 'Insurance', 'Completed'),
('Income', 'Rent Payment - Mike Davis', 4500.00, '2024-12-01', 3, 2, 'Rent', 'Completed');

-- Insert sample expenses
INSERT INTO expenses (description, amount, date, category, property_id, vendor, status, receipt, notes) VALUES
('Property Tax - 123 Main Street', 800.00, '2024-12-05', 'Taxes', 1, 'City of San Francisco', 'Paid', 'receipt_001.pdf', 'Quarterly property tax payment'),
('Water Bill - 456 Oak Avenue', 120.00, '2024-12-10', 'Utilities', 2, 'San Francisco Water', 'Paid', 'receipt_002.pdf', 'Monthly water bill'),
('Repair - AC Unit', 500.00, '2024-12-15', 'Repair', 2, 'Cool Air Services', 'Paid', 'receipt_003.pdf', 'AC unit repair and maintenance'),
('Insurance Premium', 1200.00, '2024-12-10', 'Insurance', NULL, 'Property Insurance Co.', 'Paid', 'receipt_004.pdf', 'Annual property insurance premium'),
('Cleaning Services', 200.00, '2024-12-12', 'Cleaning', 3, 'Clean Pro Services', 'Paid', 'receipt_005.pdf', 'Deep cleaning after renovation'),
('Landscaping', 150.00, '2024-12-08', 'Landscaping', 4, 'Green Thumb Landscaping', 'Paid', 'receipt_006.pdf', 'Monthly landscaping maintenance');
