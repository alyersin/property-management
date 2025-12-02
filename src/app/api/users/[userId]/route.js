import { NextResponse } from "next/server";
import databaseService from "../../../../services/databaseService";

/**
 * GET /api/users/[userId]
 * 
 * Get User by ID API Route
 * 
 * Retrieves a specific user's information by their user ID.
 * Used for fetching user details for profile pages or admin views.
 * 
 * URL Parameter:
 * - userId: The ID of the user to retrieve
 * 
 * Returns:
 * - User object with id, email, name (password is excluded)
 */
export async function GET(request, { params }) {
  try {
    // Extract userId from URL parameters
    // Example: /api/users/123
    const { userId } = await params;
    
    
    // Validation: Ensure userId is provided
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Fetch user from database by ID
    const user = await databaseService.getUserById(userId);
    
    // If user doesn't exist, return 404
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return user data (password is automatically excluded by databaseService)
    return NextResponse.json(user);
  } catch (error) {
    // Log error for debugging (server-side only)
    console.error("Error fetching user:", error);
    
    // Return generic error message to client
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PUT /api/users/[userId]
 * 
 * Update User API Route
 * 
 * Updates a specific user's information.
 * Used for editing user profiles or updating user settings.
 * 
 * URL Parameter:
 * - userId: The ID of the user to update
 * 
 * Request Body:
 * - Object containing fields to update (e.g., { name: "New Name" })
 * - Note: Password updates should be handled separately with proper hashing
 * 
 * Returns:
 * - Updated user object
 */
export async function PUT(request, { params }) {
  try {
    // Extract userId from URL parameters
    const { userId } = await params;
    
    // Validation: Ensure userId is provided
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Extract update data from request body
    const updates = await request.json();
    
    // Validation: Ensure at least one field is being updated
    if (!updates || Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 });
    }

    // Update user in database
    // Note: If updating password, it should be hashed before calling this
    const user = await databaseService.updateUser(userId, updates);
    
    // Return updated user data
    return NextResponse.json(user);
  } catch (error) {
    // Log error for debugging (server-side only)
    console.error("Error updating user:", error);
    
    // Return generic error message to client
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

