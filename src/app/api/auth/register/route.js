import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import databaseService from '../../../../services/databaseService';

/**
 * POST /api/auth/register
 * 
 * User Registration API Route
 * 
 * This route handles new user registration by:
 * 1. Validating input data (name, email, password, confirmPassword)
 * 2. Checking if user already exists
 * 3. Hashing the password securely
 * 4. Creating the user in the database
 * 5. Returning user data (without password) on success
 */
export async function POST(request) {
  try {
    // Extract registration data from request body
    const { name, email, password, confirmPassword } = await request.json();

    // Validation Step 1: Check all required fields are provided
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validation Step 2: Ensure password and confirmation match
    // This prevents typos during registration
    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Validation Step 3: Enforce minimum password length
    // Minimum 6 characters for basic security
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists in database
    // Prevents duplicate email registrations
    const existingUser = await databaseService.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash the password before storing in database
    // bcrypt.hash() creates a secure one-way hash that cannot be reversed
    // Salt rounds: 12 (higher = more secure but slower)
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user in database with hashed password
    const newUser = await databaseService.createUser({
      email,
      password: hashedPassword, // Store hashed version, never plain text
      name
    });

    // Remove password from response before sending to client
    // Never send password (even hashed) back to client for security
    const { password: _, ...userWithoutPassword } = newUser;

    // Return success response with user data (without password)
    return NextResponse.json({
      success: true,
      user: {
        id: userWithoutPassword.id,
        email: userWithoutPassword.email,
        name: userWithoutPassword.name
      }
    });

  } catch (error) {
    console.error('[ERROR] Registration API error', error);
    
    // Handle PostgreSQL unique constraint violation
    // Error code 23505 = duplicate key value violates unique constraint
    // This catches race conditions where two requests try to register same email simultaneously
    if (error.code === '23505' || error.message?.includes('duplicate')) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 400 }
      );
    }
    
    // Generic error handler for unexpected errors
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
