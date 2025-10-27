import { NextResponse } from 'next/server';
import databaseService from '../../../../../services/databaseService';

// GET /api/tenants/[tenantId]/properties - Get tenant properties
export async function GET(request, { params }) {
  try {
    const { tenantId } = params;
    
    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    const properties = await databaseService.getTenantProperties(tenantId);
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching tenant properties:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
