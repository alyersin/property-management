# Home Admin - Property Management System

Modern property management dashboard built with Next.js, React, Chakra UI, and PostgreSQL.

## Features

- **Property Management** - Track properties with simplified forms (city, bedrooms, bathrooms, status, notes)
- **Expense Tracking** - Manage utility expenses with description, amount, date, and notes
- **User Profiles** - One-to-one user profile management with phone information
- **Multi-User Support** - Complete data isolation per user with PostgreSQL
- **Modern UI** - Dark themed interface optimized for desktop and mobile using Chakra UI
- **Database-First** - PostgreSQL as single source of truth (no mock data)

## Tech Stack

- **Frontend**: Next.js 15, React 18, Chakra UI
- **Backend**: Next.js API Routes with generic CRUD factory pattern
- **Database**: PostgreSQL 15 (Docker)
- **Architecture**: Configuration-driven with universal components

## Quick Start

### Prerequisites
- Node.js 18+
- Docker Desktop

### Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd home-admin
   npm install
   ```

2. **Start PostgreSQL database:**
   ```bash
   docker compose up -d postgres
   ```

3. **Configure environment variables:**
   Create `.env.local`:
   ```env
   DATABASE_URL=postgresql://postgres:password@localhost:5540/home_admin
   USE_DATABASE=true
   DEMO_USER_EMAIL=demo@homeadmin.ro
   DEMO_USER_PASSWORD=demo123
   DEMO_USER_NAME=Demo User
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - Open http://localhost:3000
   - Login with demo credentials from `.env.local`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## Project Structure

```
src/
├── app/              # Next.js pages and API routes
├── components/       # React components (shared, auth)
├── services/         # Database service and CRUD helpers
├── hooks/            # Custom React hooks
├── config/           # Form and table configurations
├── utils/             # Utilities (API helpers, constants)
└── database/         # PostgreSQL schema
```

## Architecture Highlights

- **Generic CRUD Factory**: API routes reduced from ~50 lines to ~8 lines
- **Database CRUD Helpers**: Reusable helpers for common database operations
- **Extracted Form Fields**: Reusable field components (TextField, NumberField, SelectField, etc.)
- **Zero Code Duplication**: Universal components handle all CRUD pages
- **Configuration-Driven**: Add features through configuration, not code

## Documentation

See [docs/README.md](docs/README.md) for complete documentation including:
- Architecture overview
- Setup guide
- API documentation
- Database schema

---

Built with [Next.js](https://nextjs.org), [Chakra UI](https://chakra-ui.com), and [PostgreSQL](https://www.postgresql.org)
