import { NextResponse } from 'next/server';
import databaseService from '../../../../services/databaseService';

// GET /api/user-profiles/[userId] - Get user profile
export async function GET(request, { params }) {
  try {
    const { userId } = params;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const profile = await databaseService.getUserProfile(userId);
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/user-profiles/[userId] - Create user profile
export async function POST(request, { params }) {
  try {
    const { userId } = params;
    const profileData = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const profile = await databaseService.createUserProfile(userId, profileData);
    
    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error('Error creating user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/user-profiles/[userId] - Update user profile
export async function PUT(request, { params }) {
  try {
    const { userId } = params;
    const updates = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const profile = await databaseService.updateUserProfile(userId, updates);
    
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
