# Home Admin Project - Complete Setup Guide

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
docker exec -i home-admin-postgres psql -U postgres -d home_admin -c "SELECT COUNT(*) FROM tenants;"
```

Expected output should show:
- 9 tables created
- 3 users
- 4 properties  
- 4 tenants
- Sample data in all tables

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

1. **Login**: Use any of these test accounts:
   - Email: `admin@homeadmin.com`, Password: `password`
   - Email: `manager@homeadmin.com`, Password: `manager123`
   - Email: `demo@homeadmin.com`, Password: `demo123`

2. **Explore Features**:
   - Dashboard with statistics
   - Properties management
   - Tenant management
   - Financial tracking
   - Settings with user profiles

## Database Schema Overview

The project includes all three types of SQL relationships:

### One-to-One (1:1)
- `users` ↔ `user_profiles`

### One-to-Many (1:N)
- `properties` → `transactions`
- `properties` → `expenses`
- `tenants` → `transactions`

### Many-to-Many (M:N)
- `properties` ↔ `tenants` (via `property_tenants`)
- `properties` ↔ `amenities` (via `property_amenities`)

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

Create a `.env.local` file for custom configuration:

```bash
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/home_admin
USE_DATABASE=true

# Application
NODE_ENV=development
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

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
