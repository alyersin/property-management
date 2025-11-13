# Database Relations Documentation

> **Last Updated:** December 2024  
> This document provides a complete overview of all database relationships in the Home Admin application.

## Overview

The Home Admin database uses PostgreSQL and implements **all three SQL relationship types**:
- **One-to-One (1:1)**: 1 relationship
- **One-to-Many (1:N)**: 2 relationships  
- **Many-to-Many (N:M)**: 1 relationship

**Total:** 5 tables with 5 foreign key relationships

---

## Database Tables

| Table Name | Description | Primary Key |
|------------|-------------|-------------|
| `users` | User accounts and authentication | `id` |
| `user_profiles` | Extended user profile information | `id` |
| `properties` | Property listings | `id` |
| `tenants` | Tenant information | `id` |
| `property_tenants` | Junction table for property-tenant relationships | `(property_id, tenant_id)` |

---

## Relationship Types

### 1. One-to-One (1:1) Relationships

#### `users` ↔ `user_profiles`

**Relationship:** One user has exactly one profile, and one profile belongs to exactly one user.

**Implementation:**
- `user_profiles.user_id` → `users.id` (Foreign Key)
- `user_profiles.user_id` has `UNIQUE` constraint
- `ON DELETE CASCADE` - Deleting a user deletes their profile

**Constraint Name:** `user_profiles_user_id_fkey`

**SQL:**
```sql
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Usage:**
- Each user can have one profile
- Profile is optional (can be created later)
- Used for storing extended user information

---

### 2. One-to-Many (1:N) Relationships

#### `users` → `properties`

**Relationship:** One user can have many properties, but each property belongs to exactly one user.

**Implementation:**
- `properties.user_id` → `users.id` (Foreign Key)
- `ON DELETE CASCADE` - Deleting a user deletes all their properties

**Constraint Name:** `properties_user_id_fkey`

**SQL:**
```sql
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    city VARCHAR(100) NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'Available',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Usage:**
- Users can own multiple properties
- Each property is owned by a single user
- Data isolation: Users only see their own properties

---

#### `users` → `tenants`

**Relationship:** One user can have many tenants, but each tenant belongs to exactly one user.

**Implementation:**
- `tenants.user_id` → `users.id` (Foreign Key)
- `UNIQUE(user_id, email)` - Same email can exist for different users
- `ON DELETE CASCADE` - Deleting a user deletes all their tenants

**Constraint Name:** `tenants_user_id_fkey`

**SQL:**
```sql
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
```

**Usage:**
- Users can manage multiple tenants
- Each tenant belongs to a single user
- Email uniqueness is scoped per user (multi-tenant support)
- Data isolation: Users only see their own tenants

---


### 3. Many-to-Many (N:M) Relationships

#### `properties` ↔ `tenants` (via `property_tenants`)

**Relationship:** A property can have many tenants, and a tenant can rent many properties.

**Implementation:**
- Junction table: `property_tenants`
- `property_tenants.property_id` → `properties.id` (Foreign Key)
- `property_tenants.tenant_id` → `tenants.id` (Foreign Key)
- Composite Primary Key: `(property_id, tenant_id)`
- `ON DELETE CASCADE` on both foreign keys

**Constraint Names:**
- `property_tenants_property_id_fkey`
- `property_tenants_tenant_id_fkey`
- `property_tenants_pkey` (Composite Primary Key)

**SQL:**
```sql
CREATE TABLE property_tenants (
    property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    lease_start DATE,
    lease_end DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (property_id, tenant_id)
);
```

**Usage:**
- Links properties to tenants
- Stores lease information (start/end dates)
- Enables tracking which tenants rent which properties
- A property can have multiple tenants (e.g., roommates)
- A tenant can rent multiple properties (e.g., multiple units)

**Example Scenarios:**
- Property A has Tenant 1 and Tenant 2 (roommates)
- Tenant 1 rents Property A and Property B (multiple units)
- Lease dates track when tenant-property relationships start/end

---

## Complete Relationship Diagram

```
┌─────────────┐
│    users    │
│             │
│  id (PK)    │
└──────┬──────┘
       │
       ├─────────────────────────────────────────────┐
       │                                               │
       │                                               │
┌──────▼──────┐                              ┌────────▼────────┐
│user_profiles│                              │   properties    │
│             │                              │                 │
│ user_id (FK)│                              │  user_id (FK)   │
│  UNIQUE     │                              │                 │
└─────────────┘                              └────────┬─────────┘
                                                      │
                                                      │
                                                      │
                                              ┌───────▼────────┐
                                              │property_tenants│
                                              │                │
                                              │ property_id(FK)│
                                              │ tenant_id (FK) │
                                              │  PRIMARY KEY   │
                                              └───────┬────────┘
                                                      │
                                                      │
┌─────────────┐
│   tenants   │
│             │
│  user_id(FK)│
│             │
└─────────────┘
```

---

## Foreign Key Constraints Summary

| Constraint Name | From Table | From Column | To Table | To Column | Type | Cascade |
|----------------|------------|-------------|----------|-----------|------|---------|
| `user_profiles_user_id_fkey` | `user_profiles` | `user_id` | `users` | `id` | FK | CASCADE |
| `properties_user_id_fkey` | `properties` | `user_id` | `users` | `id` | FK | CASCADE |
| `tenants_user_id_fkey` | `tenants` | `user_id` | `users` | `id` | FK | CASCADE |
| `property_tenants_property_id_fkey` | `property_tenants` | `property_id` | `properties` | `id` | FK | CASCADE |
| `property_tenants_tenant_id_fkey` | `property_tenants` | `tenant_id` | `tenants` | `id` | FK | CASCADE |

---

## Unique Constraints

| Constraint Name | Table | Columns | Description |
|----------------|-------|---------|-------------|
| `users_email_key` | `users` | `email` | Email must be unique globally |
| `user_profiles_user_id_key` | `user_profiles` | `user_id` | One profile per user (1:1) |
| `tenants_user_id_email_key` | `tenants` | `(user_id, email)` | Email unique per user (multi-tenant support) |

---

## Indexes for Relationships

All foreign key columns are indexed for performance:

| Index Name | Table | Column | Purpose |
|------------|-------|--------|---------|
| `idx_properties_user` | `properties` | `user_id` | Fast user property lookups |
| `idx_tenants_user` | `tenants` | `user_id` | Fast user tenant lookups |
| `idx_property_tenants_property` | `property_tenants` | `property_id` | Fast property-tenant lookups |
| `idx_property_tenants_tenant` | `property_tenants` | `tenant_id` | Fast tenant-property lookups |

---

## Data Isolation

All business tables (`properties`, `tenants`) include `user_id` foreign keys, ensuring:

- **Multi-user support**: Each user's data is isolated
- **Security**: Users can only access their own data
- **Cascade deletes**: Deleting a user removes all associated data
- **Referential integrity**: Foreign keys prevent orphaned records

---

## Query Examples

### Get all properties for a user
```sql
SELECT * FROM properties WHERE user_id = 1;
```

### Get all tenants for a user
```sql
SELECT * FROM tenants WHERE user_id = 1;
```

### Get all tenants for a property (Many-to-Many)
```sql
SELECT t.*, pt.lease_start, pt.lease_end
FROM property_tenants pt
JOIN tenants t ON pt.tenant_id = t.id
WHERE pt.property_id = 1 AND t.user_id = 1;
```

### Get all properties for a tenant (Many-to-Many)
```sql
SELECT p.*, pt.lease_start, pt.lease_end
FROM property_tenants pt
JOIN properties p ON pt.property_id = p.id
WHERE pt.tenant_id = 1 AND p.user_id = 1;
```

### Get user profile (One-to-One)
```sql
SELECT up.*, u.email, u.name
FROM user_profiles up
JOIN users u ON up.user_id = u.id
WHERE up.user_id = 1;
```

---

## Verification Queries

### List all foreign keys
```sql
SELECT 
    conname AS constraint_name,
    conrelid::regclass AS table_name,
    confrelid::regclass AS referenced_table,
    a.attname AS column_name,
    af.attname AS referenced_column
FROM pg_constraint c
JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey)
JOIN pg_attribute af ON af.attrelid = c.confrelid AND af.attnum = ANY(c.confkey)
WHERE c.contype = 'f'
  AND conrelid::regclass::text IN ('users', 'user_profiles', 'properties', 'tenants', 'property_tenants')
ORDER BY conrelid::regclass::text, conname;
```

### Count relationships by type
```sql
-- One-to-One
SELECT COUNT(*) AS one_to_one_count
FROM information_schema.table_constraints
WHERE constraint_type = 'UNIQUE'
  AND table_name = 'user_profiles'
  AND constraint_name = 'user_profiles_user_id_key';

-- One-to-Many (count foreign keys to users)
SELECT COUNT(*) AS one_to_many_count
FROM pg_constraint
WHERE contype = 'f'
  AND confrelid = 'users'::regclass
  AND conrelid::regclass::text IN ('properties', 'tenants');

-- Many-to-Many (junction table)
SELECT COUNT(*) AS many_to_many_count
FROM information_schema.tables
WHERE table_name = 'property_tenants';
```

---

## Notes

- All foreign keys use `ON DELETE CASCADE` for automatic cleanup
- The `property_tenants` junction table enables flexible many-to-many relationships
- Unique constraints ensure data integrity (one profile per user, unique emails per user)
- All relationship columns are indexed for optimal query performance
- The schema supports multi-user data isolation through `user_id` foreign keys

---

**Related Documentation:**
- [DATABASE_SCHEMA_VERIFICATION.md](./DATABASE_SCHEMA_VERIFICATION.md) - Schema verification checklist
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Database schema design guide
- [EXPENSES_REMOVAL.md](./removed-elements/EXPENSES_REMOVAL.md) - Expenses feature removal documentation
- [src/database/schema.sql](../src/database/schema.sql) - Complete SQL schema

