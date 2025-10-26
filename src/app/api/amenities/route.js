import { NextResponse } from 'next/server';
import databaseService from '../../../services/databaseService';

// GET /api/amenities - Get all amenities
export async function GET() {
  try {
    const amenities = await databaseService.getAmenities();
    return NextResponse.json(amenities);
  } catch (error) {
    console.error('Error fetching amenities:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
