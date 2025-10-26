// Environment configuration utility
// Centralized environment variable management
// Note: This file is kept for future server-side usage

// Helper function to get environment variable with fallback
const getEnv = (key, defaultValue = null) => {
  return process.env[key] || defaultValue;
};

export const env = {
  // Application Settings - Safe fallbacks for public values
  app: {
    name: getEnv('NEXT_PUBLIC_APP_NAME', 'Home Admin'),
    description: getEnv('NEXT_PUBLIC_APP_DESCRIPTION', 'Property Management System'),
    nodeEnv: getEnv('NODE_ENV', 'development')
  },

  // Database Settings
  database: {
    url: getEnv('DATABASE_URL', 'postgresql://user:password@localhost:5432/homeadmin'),
    useDatabase: process.env.USE_DATABASE === 'true'
  },

  // Security Settings
  security: {
    jwtSecret: getEnv('JWT_SECRET', 'your-super-secret-jwt-key-here'),
    sessionSecret: getEnv('SESSION_SECRET', 'your-super-secret-session-key-here')
  }
};

// Helper function to get demo user (server-side only)
// SECURITY: No hardcoded fallbacks - environment variables are required
export const getDemoUsers = () => {
  // Validate that all required environment variables are set
  const requiredVars = [
    'DEMO_USER_EMAIL', 'DEMO_USER_PASSWORD', 'DEMO_USER_NAME', 'DEMO_USER_ROLE'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  return [
    {
      id: 1,
      email: process.env.DEMO_USER_EMAIL,
      password: process.env.DEMO_USER_PASSWORD,
      name: process.env.DEMO_USER_NAME,
      role: process.env.DEMO_USER_ROLE,
      createdAt: "2024-02-01T00:00:00Z",
      lastLogin: "2024-12-15T09:15:00Z"
    }
  ];
};

export default env;
