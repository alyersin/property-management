import { NextResponse } from 'next/server';
import { getDemoUsers } from '../../../../config/env';
import databaseService from '../../../../services/databaseService';
import logger from '../../../../utils/logger';

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
      logger.info('Demo users not configured, checking database');
    }

    // If not found in demo users, check database for registered users
    if (!user) {
      user = await databaseService.validateCredentials(email, password);
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
    logger.error('Login API error', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
