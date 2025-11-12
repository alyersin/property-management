import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import databaseService from '../../../../services/databaseService';

/**
 * Helper function to get demo user from environment variables
 * 
 * Demo users are configured in .env file and allow quick testing
 * without needing to register a real account. Useful for demos and development.
 * 
 * @returns {Array} Array of demo user objects
 * @throws {Error} If required environment variables are missing
 */
const getDemoUsers = () => {
  // Required environment variables for demo user configuration
  const requiredVars = [
    'DEMO_USER_EMAIL', 'DEMO_USER_PASSWORD', 'DEMO_USER_NAME', 'DEMO_USER_ROLE'
  ];

  // Check if all required variables are present
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  // Return demo user object from environment variables
  // Note: Demo passwords are stored in plain text in .env (not hashed)
  return [
    {
      id: 1,
      email: process.env.DEMO_USER_EMAIL,
      password: process.env.DEMO_USER_PASSWORD, // Plain text for demo
      name: process.env.DEMO_USER_NAME,
      role: process.env.DEMO_USER_ROLE,
      createdAt: "2024-02-01T00:00:00Z",
      lastLogin: "2024-12-15T09:15:00Z"
    }
  ];
};

/**
 * POST /api/auth/login
 * 
 * User Login API Route
 * 
 * This route handles user authentication by:
 * 1. Validating email and password are provided
 * 2. Checking demo users first (if configured in .env)
 * 3. If not demo user, checking database for registered users
 * 4. Comparing provided password with stored hash (for DB users)
 * 5. Returning user data (without password) on successful authentication
 * 
 * Authentication Flow:
 * - Demo users: Plain text comparison (for quick testing)
 * - Database users: bcrypt hash comparison (secure)
 */
export async function POST(request) {
  try {
    // Extract login credentials from request body
    const { email, password } = await request.json();

    // Validation: Ensure both email and password are provided
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    let user = null;

    // Step 1: Check demo users first (if configured in .env)
    // Demo users allow quick testing without database registration
    // This is useful for demos, testing, or when database is not set up
    try {
      const demoUsers = getDemoUsers();
      // Find demo user with matching email and password (plain text comparison)
      user = demoUsers.find(u => u.email === email && u.password === password);
    } catch (error) {
      // Demo users not configured in .env - this is OK, continue to database check
      // Only log in development mode to avoid cluttering production logs
      if (process.env.NODE_ENV === 'development') {
        console.log('[INFO] Demo users not configured, checking database');
      }
    }

    // Step 2: If not found in demo users, check database for registered users
    // This handles real user accounts that were registered through /api/auth/register
    if (!user) {
      // Look up user by email in database
      const dbUser = await databaseService.getUserByEmail(email);

      // If user exists and has a password stored
      if (dbUser && dbUser.password) {
        // Compare provided password with stored hash using bcrypt
        // bcrypt.compare() securely compares plain text password with hashed version
        const passwordMatches = await bcrypt.compare(password, dbUser.password);
        
        if (passwordMatches) {
          // Password is correct, use this user
          user = dbUser;
        }
        // If password doesn't match, user remains null (will trigger error below)
      }
    }

    // Step 3: If no user found in either demo or database, authentication failed
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 } // 401 = Unauthorized
      );
    }

    // Step 4: Remove password from response before sending to client
    // Never send password (even hashed) back to client for security
    const { password: _, ...userWithoutPassword } = user;
    
    // Step 5: Return success response with user data (without password)
    return NextResponse.json({
      success: true,
      user: {
        id: userWithoutPassword.id,
        email: userWithoutPassword.email,
        name: userWithoutPassword.name,
        role: userWithoutPassword.role,
        loginTime: new Date().toISOString() // Current timestamp for tracking
      }
    });

  } catch (error) {
    // Log error for debugging (server-side only)
    console.error('[ERROR] Login API error', error);
    
    // Return generic error message to client
    // Don't expose internal error details for security
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
