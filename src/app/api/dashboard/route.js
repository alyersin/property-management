import { NextResponse } from 'next/server';
import databaseService from '../../../services/databaseService';

/**
 * GET /api/dashboard
 * 
 * Dashboard Data API Route
 * 
 * Fetches dashboard statistics and recent activities for a specific user.
 * Used to populate the main dashboard page with summary data.
 * 
 * Query Parameters:
 * - userId (required): The ID of the user whose dashboard data to fetch
 * 
 * Returns:
 * - stats: Dashboard statistics (e.g., total properties, occupancy rate, etc.)
 * - activities: Recent activity log for the user
 */
export async function GET(request) {
  try {
    // Extract userId from query parameters
    // Example: /api/dashboard?userId=123
    const userId = request.nextUrl.searchParams.get('userId');

    // Validation: Ensure userId is provided
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Convert userId string to integer for database query
    const parsedUserId = parseInt(userId, 10);
    
    // Fetch dashboard statistics (e.g., total properties, occupancy rate, available properties)
    const stats = await databaseService.getDashboardStats(parsedUserId);
    
    // Fetch recent activities (e.g., recent property and tenant additions)
    const activities = await databaseService.getRecentActivities(parsedUserId);

    // Return both stats and activities in response
    return NextResponse.json({ stats, activities });
  } catch (error) {
    // Log error for debugging (server-side only)
    console.error('Error fetching dashboard data:', error);
    
    // Return generic error message to client
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}

