import { NextResponse } from 'next/server';
import databaseService from '../../../../../services/databaseService';

/**
 * Tenant Properties API Routes
 * 
 * Manages the many-to-many relationship between tenants and properties.
 * 
 * Available Routes:
 * - GET /api/tenants/[tenantId]/properties?userId=123 - Get all properties for a tenant
 * 
 * Request/Response Format:
 * - GET: Returns array of property objects with lease information
 */
export async function GET(request, { params }) {
  try {
    const { tenantId } = await params;
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const properties = await databaseService.getTenantProperties(
      parseInt(tenantId, 10),
      parseInt(userId, 10)
    );
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching tenant properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tenant properties' },
      { status: 500 }
    );
  }
}

