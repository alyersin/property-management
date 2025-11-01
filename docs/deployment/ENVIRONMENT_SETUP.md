# 🔐 Environment Variables Setup

## 📋 Overview

All hardcoded user credentials and sensitive configuration have been moved to environment variables for better security and configuration management.

## 🚀 Quick Setup

### 1. Copy Environment File
```bash
cp .env.example .env
```

### 2. Edit Environment Variables
Open `.env` file and update the values:

```env
# Demo User Credentials
DEMO_USER_EMAIL=demo@homeadmin.ro
DEMO_USER_PASSWORD=your-secure-demo-password
DEMO_USER_NAME=Demo User
DEMO_USER_ROLE=user
```

## 🔧 Environment Variables Reference

### **Demo User Credentials**
**Note:** The application now uses a simplified single demo user configuration for exam presentation.

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `DEMO_USER_EMAIL` | Demo user email | `demo@homeadmin.ro` |
| `DEMO_USER_PASSWORD` | Demo user password | `demo123` |
| `DEMO_USER_NAME` | Demo user display name | `Demo User` |
| `DEMO_USER_ROLE` | Demo user role | `user` |

**Additional users** should be created via the registration page and will be stored in the database.

### **Application Settings**
| Variable | Description | Default Value |
|----------|-------------|---------------|
| `NODE_ENV` | Node environment | `development` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `Home Admin` |
| `NEXT_PUBLIC_APP_DESCRIPTION` | Application description | `Property Management System` |

### **Database Settings (Future Use)**
| Variable | Description | Default Value |
|----------|-------------|---------------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@localhost:5432/homeadmin` |
| `USE_DATABASE` | Enable database usage | `false` |

### **Security Settings**
| Variable | Description | Default Value |
|----------|-------------|---------------|
| `JWT_SECRET` | JWT signing secret | `your-super-secret-jwt-key-here` |
| `SESSION_SECRET` | Session secret | `your-super-secret-session-key-here` |

## 🏗️ Architecture Changes

### **Files Updated:**
- ✅ `src/services/dataService.js` - Now uses environment variables
- ✅ `src/utils/demo-credentials.js` - Updated to use environment config
- ✅ `src/config/env.js` - New centralized environment configuration
- ✅ `.env` - Created with all environment variables
- ✅ `.env.example` - Template for environment variables

### **New Configuration System:**
```javascript
// src/config/env.js
export const env = {
  demoUsers: {
    // Simplified to single demo user (December 2024)
    user: { 
      email: process.env.DEMO_USER_EMAIL, 
      password: process.env.DEMO_USER_PASSWORD,
      name: process.env.DEMO_USER_NAME,
      role: process.env.DEMO_USER_ROLE
    }
  },
  app: { name: process.env.NEXT_PUBLIC_APP_NAME, ... },
  database: { url: process.env.DATABASE_URL, ... },
  security: { jwtSecret: process.env.JWT_SECRET, ... }
};
```

## 🔒 Security Benefits

### **1. Credential Security**
- ✅ No hardcoded passwords in source code
- ✅ Environment-specific credentials
- ✅ Easy credential rotation
- ✅ Secure deployment

### **2. Configuration Management**
- ✅ Centralized configuration
- ✅ Environment-specific settings
- ✅ Easy deployment configuration
- ✅ Version control safety

### **3. Development Workflow**
- ✅ Local development credentials
- ✅ Staging environment credentials
- ✅ Production environment credentials
- ✅ Team member specific credentials

## 🚀 Deployment Considerations

### **Development Environment**
```bash
# Copy and edit environment file
cp .env.example .env
# Edit .env with your local credentials
```

### **Staging Environment**
```bash
# Set environment variables
export DEMO_USER_EMAIL=staging-demo@company.com
export DEMO_USER_PASSWORD=staging-secure-password
# ... other variables
```

### **Production Environment**
```bash
# Use secure production credentials
export DEMO_USER_EMAIL=demo@yourcompany.com
export DEMO_USER_PASSWORD=super-secure-production-password
# ... other variables
```

## 🔧 Usage Examples

### **Accessing Environment Variables**
```javascript
// In your application
import { env } from '../config/env';

// Get demo users
const users = env.demoUsers;

// Get app settings
const appName = env.app.name;

// Get database URL
const dbUrl = env.database.url;
```

### **Validating Credentials**
```javascript
// Using the environment configuration
import { validateCredentials } from '../config/env';

const user = validateCredentials(email, password);
if (user) {
  // User authenticated
}
```

## 📝 Best Practices

### **1. Security**
- ✅ Use strong passwords
- ✅ Rotate credentials regularly
- ✅ Use different credentials per environment
- ✅ Never commit .env files

### **2. Configuration**
- ✅ Use .env.example as template
- ✅ Document all environment variables
- ✅ Use meaningful variable names
- ✅ Provide default values

### **3. Deployment**
- ✅ Set environment variables in deployment
- ✅ Use secure credential management
- ✅ Validate environment on startup
- ✅ Log configuration issues

## 🎯 Next Steps

1. **Update your .env file** with your preferred credentials
2. **Test the application** to ensure environment variables work
3. **Deploy with environment variables** set in your deployment platform
4. **Rotate credentials regularly** for security

## 🔍 Troubleshooting

### **Common Issues:**
- **Environment variables not loading**: Restart the development server
- **Default values being used**: Check .env file exists and has correct format
- **Authentication failing**: Verify credentials in .env file
- **Build errors**: Ensure all required environment variables are set

### **Debug Environment Variables:**
```javascript
// Check if environment variables are loaded
console.log('Environment variables:', {
  demoUserEmail: process.env.DEMO_USER_EMAIL,
  nodeEnv: process.env.NODE_ENV
});
```

This setup provides **secure, configurable, and maintainable** credential management for your Home Admin application! 🚀
