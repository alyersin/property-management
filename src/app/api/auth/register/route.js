import { NextResponse } from 'next/server';
import logger from '../../../../utils/logger';

export async function POST(request) {
  try {
    const { name, email, password, confirmPassword } = await request.json();

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // For demo purposes, create a new user
    // In production, you would save to database
    const newUser = {
      id: Date.now(),
      email,
      name,
      role: 'user',
      loginTime: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      user: newUser
    });

  } catch (error) {
    logger.error('Registration API error', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
