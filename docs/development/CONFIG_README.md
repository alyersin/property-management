# Demo Credentials Configuration

This directory contains configuration files for the Home Admin application.

## Demo Credentials

The `demo-credentials.json` file contains demo user accounts for testing the application. These credentials are used for development and demonstration purposes.

### Available Demo User

**Note:** The application now uses only one demo user configured via environment variables for simplified exam presentation.

1. **Demo User**
   - Email: `demo@homeadmin.ro` (configured in `.env` as `DEMO_USER_EMAIL`)
   - Password: Configured in `.env` as `DEMO_USER_PASSWORD`
   - Name: Configured in `.env` as `DEMO_USER_NAME`
   - Role: Configured in `.env` as `DEMO_USER_ROLE`

### Usage

These credentials are automatically loaded by the authentication system and can be used to test different user roles and permissions.

### Security Note

⚠️ **Important**: These are demo credentials only. In a production environment, user authentication should be handled by a secure backend service with proper password hashing and database storage.

### Configuration

Demo user credentials are configured via environment variables in `.env` file:

```env
DEMO_USER_EMAIL=demo@homeadmin.ro
DEMO_USER_PASSWORD=demo123
DEMO_USER_NAME=Demo User
DEMO_USER_ROLE=user
```

**Note:** Other users should be created via the registration page and will be stored in the database.
