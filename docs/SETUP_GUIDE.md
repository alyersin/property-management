# Home Admin Project - Complete Setup Guide

> **Update – December 2024**  
> The application now uses **PostgreSQL exclusively** (removed mock data service). All data operations go through the database. The application has been refactored with generic CRUD helpers and extracted form components for better maintainability.

This guide will walk you through setting up the Home Admin project from scratch on any machine (Windows, Mac, or Linux).

## Prerequisites

- **Node.js** (v18 or higher)
- **Docker Desktop** installed and running
- **VS Code** (recommended)
- **Git** (for cloning the repository)

## Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd home-admin
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Set Up PostgreSQL Database with Docker

### Option A: Using Docker Compose (Recommended)

```bash
# Start PostgreSQL database
docker-compose up -d postgres

# Verify the container is running
docker ps
```

### Option B: Using Docker Run (Alternative)

```bash
# Start PostgreSQL container
docker run --name home-admin-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=home_admin \
  -p 5432:5432 \
  -d postgres:15

# Verify container is running
docker ps
```

## Step 4: Create Database Schema and Sample Data

### If using Docker Compose:
The schema will be automatically loaded when the container starts.

### If using Docker Run:
```bash
# Copy schema file to container
docker cp src/database/schema.sql home-admin-postgres:/tmp/schema.sql

# Execute schema to create tables and sample data
docker exec -i home-admin-postgres psql -U postgres -d home_admin -f /tmp/schema.sql

# Verify tables were created
docker exec -i home-admin-postgres psql -U postgres -d home_admin -c "\dt"
```

## Step 5: Verify Database Setup

```bash
# Connect to database and verify tables
docker exec -i home-admin-postgres psql -U postgres -d home_admin -c "\dt"

# Check sample data
docker exec -i home-admin-postgres psql -U postgres -d home_admin -c "SELECT COUNT(*) FROM users;"
docker exec -i home-admin-postgres psql -U postgres -d home_admin -c "SELECT COUNT(*) FROM properties;"
docker exec -i home-admin-postgres psql -U postgres -d home_admin -c "SELECT COUNT(*) FROM expenses;"
```

Expected output should show:
- 4 tables created (`users`, `user_profiles`, `properties`, `expenses`)
- 0 users (create accounts through the app)
- 0 properties  
- 0 expenses (ready for user input)

## Step 6: Set Up VS Code Database Extension

### Install Extension
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "MySQL" by cweijan
4. Install the extension (supports PostgreSQL)

### Connect to Database
1. Open Database Explorer panel in VS Code
2. Click "Add Connection" (+ button)
3. Select "PostgreSQL" as server type
4. Enter connection details:
   - **Name**: `home-admin`
   - **Host**: `localhost`
   - **Port**: `5432`
   - **Username**: `postgres`
   - **Password**: `password`
   - **Database**: `home_admin`
5. Click "Connect"

## Step 7: Start the Application

```bash
# Start the Next.js development server
npm run dev
```

The application will be available at: http://localhost:3000

## Step 8: Test the Application

1. **Login**: Use the demo account configured in your `.env` file:
   - Email: `demo@homeadmin.ro` (or value from `DEMO_USER_EMAIL`)
   - Password: Value from `DEMO_USER_PASSWORD` in `.env`
   
   **Note:** Additional users can be created via the registration page and will be stored in the database.

2. **Explore Features**:
   - Dashboard with statistics
   - Properties management
   - Expenses management
   - Settings with user profiles

## Database Schema Overview

The project uses a simplified schema focused on core features:

### One-to-One (1:1)
- `users` ↔ `user_profiles` (phone information)

### One-to-Many (1:N)
- `users` → `properties` (city, bedrooms, bathrooms, status, notes)
- `users` → `expenses` (description, amount, date, notes)

### Schema Simplification
- **User Profiles**: Only `phone` field retained (removed: bio, avatar_url, date_of_birth)
- **Properties**: Removed `address` and `rent` fields for simplified demo
- **Multi-User**: All data is isolated per user using `user_id` foreign keys

## Useful Commands

### Docker Commands
```bash
# View running containers
docker ps

# View container logs
docker logs home-admin-postgres

# Stop the database
docker-compose down
# OR
docker stop home-admin-postgres

# Start the database
docker-compose up -d postgres
# OR
docker start home-admin-postgres

# Remove everything (clean slate)
docker-compose down -v
# OR
docker rm -f home-admin-postgres
```

### Database Commands
```bash
# Connect to database
docker exec -it home-admin-postgres psql -U postgres -d home_admin

# List all tables
docker exec -i home-admin-postgres psql -U postgres -d home_admin -c "\dt"

# View table structure
docker exec -i home-admin-postgres psql -U postgres -d home_admin -c "\d users"

# Run custom SQL query
docker exec -i home-admin-postgres psql -U postgres -d home_admin -c "SELECT * FROM users LIMIT 5;"
```

### Application Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL container is running
docker ps | grep postgres

# Check container logs
docker logs home-admin-postgres

# Restart container
docker restart home-admin-postgres
```

### Port Conflicts
If port 5432 is already in use:
```bash
# Find what's using port 5432
netstat -tulpn | grep 5432
# OR on Windows
netstat -ano | findstr 5432

# Use different port in docker-compose.yml
ports:
  - "5433:5432"  # Use 5433 instead
```

### Permission Issues
```bash
# Fix file permissions (Linux/Mac)
sudo chown -R $USER:$USER .

# Fix Docker permissions
sudo usermod -aG docker $USER
```

## Environment Variables

Create a `.env.local` file in the project root:

```bash
# Database Configuration (REQUIRED)
DATABASE_URL=postgresql://postgres:password@localhost:5540/home_admin
USE_DATABASE=true

# Demo User Credentials (for login)
DEMO_USER_EMAIL=demo@homeadmin.ro
DEMO_USER_PASSWORD=demo123
DEMO_USER_NAME=Demo User
DEMO_USER_ROLE=user

# Application
NODE_ENV=development
```

**Note**: The database port is `5540` (mapped from container port `5432`) as configured in `docker_compose.yml`.

## Project Structure

```
home-admin/
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # React components
│   ├── database/           # Database schema and migrations
│   ├── services/           # Database and API services
│   └── utils/              # Utility functions
├── docs/                   # Documentation
├── docker-compose.yml      # Docker services configuration
├── Dockerfile             # Application container
└── package.json           # Dependencies and scripts
```

## Next Steps

1. **Explore the Database**: Use VS Code extension to browse tables and relationships
2. **Test Features**: Try adding properties, tenants, and managing amenities
3. **Customize**: Modify the schema or add new features
4. **Deploy**: Use the Docker setup for production deployment

## Support

If you encounter issues:
1. Check Docker Desktop is running
2. Verify all containers are up: `docker ps`
3. Check application logs: `npm run dev`
4. Verify database connection in VS Code extension

---

**Happy coding!** 🚀
