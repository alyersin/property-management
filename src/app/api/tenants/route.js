import { NextResponse } from 'next/server';
import databaseService from '../../../services/databaseService';

// GET /api/tenants - Get all tenants (filtered by user when DB is enabled)
export async function GET() {
  try {
    // TODO: Get userId from session/auth
    // const userId = getUserIdFromSession(request);
    // const tenants = await databaseService.getTenants(userId);
    
    // For now, return empty array since we need authentication
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching tenants:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

