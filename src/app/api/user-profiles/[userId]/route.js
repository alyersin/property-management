import { NextResponse } from 'next/server';
import databaseService from '../../../../services/databaseService';

/**
 * GET /api/user-profiles/[userId]
 * 
 * Get User Profile API Route
 * 
 * Retrieves a user's profile information.
 * User profiles are separate from user accounts and can store additional
 * user-specific data (e.g., preferences, settings, extended information).
 * 
 * URL Parameter:
 * - userId: The ID of the user whose profile to retrieve
 * 
 * Returns:
 * - User profile object (or 404 if profile doesn't exist)
 */
export async function GET(request, { params }) {
  try {
    // Extract userId from URL parameters
    // Example: /api/user-profiles/123
    const { userId } = params;
    
    // Validation: Ensure userId is provided
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Fetch user profile from database
    const profile = await databaseService.getUserProfile(userId);
    
    // If profile doesn't exist, return 404
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Return profile data
    return NextResponse.json(profile);
  } catch (error) {
    // Log error for debugging (server-side only)
    console.error('Error fetching user profile:', error);
    
    // Return generic error message to client
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user-profiles/[userId]
 * 
 * Create User Profile API Route
 * 
 * Creates a new user profile for a user.
 * This is typically called when a user first sets up their profile.
 * 
 * URL Parameter:
 * - userId: The ID of the user to create a profile for
 * 
 * Returns:
 * - Created profile object (status 201)
 */
export async function POST(request, { params }) {
  try {
    // Extract userId from URL parameters
    const { userId } = params;
    
    // Validation: Ensure userId is provided
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Create new user profile with empty data object
    // Profile fields can be added later via PUT request
    const profile = await databaseService.createUserProfile(userId, {});
    
    // Return created profile with 201 status (Created)
    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    // Log error for debugging (server-side only)
    console.error('Error creating user profile:', error);
    
    // Return generic error message to client
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/user-profiles/[userId]
 * 
 * Update User Profile API Route
 * 
 * Updates a user's profile information.
 * Currently, this route is a placeholder for future profile fields.
 * 
 * URL Parameter:
 * - userId: The ID of the user whose profile to update
 * 
 * Note:
 * - Currently no profile fields are implemented
 * - This structure is kept for future expansion (e.g., preferences, settings)
 * - Returns existing profile if it exists, otherwise empty object
 * 
 * Returns:
 * - Updated profile object (or empty object if profile doesn't exist)
 */
export async function PUT(request, { params }) {
  try {
    // Extract userId from URL parameters
    const { userId } = params;
    
    // Validation: Ensure userId is provided
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Currently no profile fields to update, but keeping structure for future fields
    // This allows the API to be extended later without breaking changes
    // Return existing profile if it exists, otherwise return empty object
    const existing = await databaseService.getUserProfile(userId);
    return NextResponse.json(existing || {});
  } catch (error) {
    // Log error for debugging (server-side only)
    console.error('Error updating user profile:', error);
    
    // Return generic error message to client
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
