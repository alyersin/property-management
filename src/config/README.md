# Demo Credentials Configuration

This directory contains configuration files for the Home Admin application.

## Demo Credentials

The `demo-credentials.json` file contains demo user accounts for testing the application. These credentials are used for development and demonstration purposes.

### Available Demo Users

1. **Admin User**
   - Email: `admin@homeadmin.com`
   - Password: `password`
   - Role: `admin`

2. **Property Manager**
   - Email: `manager@homeadmin.com`
   - Password: `manager123`
   - Role: `manager`

3. **Demo User**
   - Email: `demo@homeadmin.com`
   - Password: `demo123`
   - Role: `user`

### Usage

These credentials are automatically loaded by the authentication system and can be used to test different user roles and permissions.

### Security Note

⚠️ **Important**: These are demo credentials only. In a production environment, user authentication should be handled by a secure backend service with proper password hashing and database storage.

### Adding New Demo Users

To add new demo users, edit the `demo-credentials.json` file and add new entries to the `demoUsers` array:

```json
{
  "email": "newuser@example.com",
  "password": "newpassword",
  "name": "New User",
  "role": "user"
}
```
