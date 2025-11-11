import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import databaseService from '../../../../services/databaseService';

// Helper function to get demo user from environment variables (server-side only)
const getDemoUsers = () => {
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

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    let user = null;

    // First, check demo users from environment variables (.env)
    // This handles mock authentication for demo accounts
    try {
      const demoUsers = getDemoUsers();
      user = demoUsers.find(u => u.email === email && u.password === password);
    } catch (error) {
      // Demo users not configured in .env - continue to database check
      if (process.env.NODE_ENV === 'development') {
        console.log('[INFO] Demo users not configured, checking database');
      }
    }

    // If not found in demo users, check database for registered users
    if (!user) {
      const dbUser = await databaseService.getUserByEmail(email);

      if (dbUser && dbUser.password) {
        const passwordMatches = await bcrypt.compare(password, dbUser.password);
        if (passwordMatches) {
          user = dbUser;
        }
      }
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      success: true,
      user: {
        id: userWithoutPassword.id,
        email: userWithoutPassword.email,
        name: userWithoutPassword.name,
        role: userWithoutPassword.role,
        loginTime: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('[ERROR] Login API error', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
