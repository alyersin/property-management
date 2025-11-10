# 📚 Home Admin Documentation

> **Update – November 2025**  
> Documentation has been refreshed to reflect the removal of tenant management and the new `financial_records` schema. Legacy guides remain for historical purposes and are annotated where applicable.

This directory contains all documentation for the Home Admin property management system, organized by category.

## 📂 Documentation Structure

### 🏗️ Architecture (`/architecture`)
Technical documentation about the application structure, data flow, and component interactions.

- **[ARCHITECTURE_DOCUMENTATION.md](./architecture/ARCHITECTURE_DOCUMENTATION.md)** - Complete application architecture overview, including frontend, backend, and data management
- **[ARCHITECTURE_FLOW.md](./architecture/ARCHITECTURE_FLOW.md)** - Detailed flow diagrams and process documentation
- **[COMPONENT_INTERACTIONS.md](./architecture/COMPONENT_INTERACTIONS.md)** - How components communicate and interact with each other

### 🔒 Security (`/security`)
Security-related documentation, fixes, and best practices.

- **[SECURITY_FIX_SUMMARY.md](./security/SECURITY_FIX_SUMMARY.md)** - Summary of security vulnerabilities and their fixes

### 🚀 Deployment (`/deployment`)
Deployment guides and environment configuration.

- **[VERCEL_DEPLOYMENT_SECURITY.md](./deployment/VERCEL_DEPLOYMENT_SECURITY.md)** - Secure deployment guide for Vercel
- **[ENVIRONMENT_SETUP.md](./deployment/ENVIRONMENT_SETUP.md)** - Environment variables setup guide

### 💻 Development (`/development`)
Development-related documentation, error fixes, and configuration guides.

- **[RUNTIME_ERROR_FIX.md](./development/RUNTIME_ERROR_FIX.md)** - Runtime error troubleshooting and fixes
- **[CONFIG_README.md](./development/CONFIG_README.md)** - Configuration file documentation

### 🗑️ Removed Elements (`/removed-elements`)
Documentation of features and code that have been removed from the application.

- **[REMOVED_ELEMENTS_DOCUMENTATION.md](./removed-elements/REMOVED_ELEMENTS_DOCUMENTATION.md)** - Comprehensive list of all removed features, components, and code for future reference

### 📊 Recent Updates (December 2024)

**Form Simplification:**
- Simplified property and tenant forms for exam presentation
- Removed fields: state, zip, sqft, emergency contact/phone from properties, tenants, and user profiles
- Updated database schema to match simplified forms
- Legacy migration script lives in Git history (`src/database/migration_remove_simplified_fields.sql`)

**Documentation:**
- **[FINANCES_EXPENSES_EXPLANATION.md](./FINANCES_EXPENSES_EXPLANATION.md)** - Explanation of Finances vs Expenses pages
- **[MIGRATION_INSTRUCTIONS.md](./MIGRATION_INSTRUCTIONS.md)** - Guide for running database migrations
- **[VERIFY_MIGRATION.sql](./VERIFY_MIGRATION.sql)** - SQL queries to verify migration success

---

## 🔍 Quick Links

### For New Developers
1. Start with [ARCHITECTURE_DOCUMENTATION.md](./architecture/ARCHITECTURE_DOCUMENTATION.md)
2. Review [ENVIRONMENT_SETUP.md](./deployment/ENVIRONMENT_SETUP.md)
3. Check [SECURITY_FIX_SUMMARY.md](./security/SECURITY_FIX_SUMMARY.md)

### For Deployment
1. [VERCEL_DEPLOYMENT_SECURITY.md](./deployment/VERCEL_DEPLOYMENT_SECURITY.md)
2. [ENVIRONMENT_SETUP.md](./deployment/ENVIRONMENT_SETUP.md)

### For Troubleshooting
1. [RUNTIME_ERROR_FIX.md](./development/RUNTIME_ERROR_FIX.md)
2. [SECURITY_FIX_SUMMARY.md](./security/SECURITY_FIX_SUMMARY.md)

---

**Last Updated:** December 2024

**Recent Changes:**
- Form simplification for exam presentation
- Database schema updated (removed state, zip, sqft, emergency contact fields)
- All documentation updated to reflect current state

