import { NextResponse } from 'next/server';
import databaseService from '../../../services/databaseService';

export async function GET(request) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const parsedUserId = parseInt(userId, 10);
    const stats = await databaseService.getDashboardStats(parsedUserId);
    const activities = await databaseService.getRecentActivities(parsedUserId);

    return NextResponse.json({ stats, activities });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}

