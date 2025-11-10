# 🏠 Home Admin - Property Management System

A modern, full-stack property management application built with Next.js, React, and PostgreSQL.

## 📋 Features

- **Property Management**: Manage properties with simplified forms (address, city, bedrooms, bathrooms, rent, status)
- **Finances & Expenses**: Single consolidated page for income and expense tracking
- **User Authentication**: Secure login/registration with database integration
- **Multi-User Support**: Data isolation per user
- **Responsive Design**: Modern UI built with Chakra UI

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL (or Docker for containerized setup)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd home-admin
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file with:
```env
DEMO_USER_EMAIL=demo@homeadmin.ro
DEMO_USER_PASSWORD=demo123
DEMO_USER_NAME=Demo User
DEMO_USER_ROLE=user
DATABASE_URL=postgresql://user:password@localhost:5432/homeadmin
USE_DATABASE=true
```

4. **Set up database**
```bash
# Using Docker (recommended)
docker-compose up -d postgres

# Or run migration manually
psql -d your_database -f src/database/schema.sql
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[Architecture Documentation](./docs/architecture/ARCHITECTURE_DOCUMENTATION.md)** - Complete system architecture
- **[Setup Guide](./docs/SETUP_GUIDE.md)** - Detailed setup instructions
- **[Migration Guide](./docs/MIGRATION_GUIDE.md)** - Database migration instructions
- **[Removed Elements](./docs/removed-elements/REMOVED_ELEMENTS_DOCUMENTATION.md)** - Documentation of simplified features

## 🗄️ Database Schema

The application uses PostgreSQL with a simplified schema:
- **Properties**: address, city, bedrooms, bathrooms, rent, status, notes
- **Financial Records**: type, description, amount, date, category, status, vendor, receipt, notes
- **User Profiles**: bio, phone, address, date_of_birth

See `src/database/schema.sql` for the complete schema.

## 📝 Recent Updates (November 2025)

- Removed Tenants tab, APIs, and database tables for easier demos
- Merged Finances and Expenses into a single `financial_records` table and `/finances` page
- Simplified database setup – fresh installs only require `src/database/schema.sql`
- Documentation refreshed to reflect the simplified navigation and schema

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- Apply schema manually: `psql -d your_database -f src/database/schema.sql`

## 📖 Learn More

- See `/docs` directory for comprehensive documentation
- Architecture details in `/docs/architecture`
- Migration guides in `/docs`

---

Built with [Next.js](https://nextjs.org) and [Chakra UI](https://chakra-ui.com)
