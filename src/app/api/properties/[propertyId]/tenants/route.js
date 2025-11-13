import { NextResponse } from 'next/server';
import databaseService from '../../../../../services/databaseService';

/**
 * Property Tenants API Routes
 * 
 * Manages the many-to-many relationship between properties and tenants.
 * 
 * Available Routes:
 * - GET /api/properties/[propertyId]/tenants?userId=123 - Get all tenants for a property
 * - POST /api/properties/[propertyId]/tenants - Add a tenant to a property
 * - DELETE /api/properties/[propertyId]/tenants - Remove a tenant from a property
 * 
 * Request/Response Format:
 * - GET: Returns array of tenant objects with lease information
 * - POST: Requires { userId, tenantId, start_date?, end_date? } in body
 * - DELETE: Requires { userId, tenantId } in body
 */
export async function GET(request, { params }) {
  try {
    const { propertyId } = await params;
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const tenants = await databaseService.getPropertyTenants(
      parseInt(propertyId, 10),
      parseInt(userId, 10)
    );
    return NextResponse.json(tenants);
  } catch (error) {
    console.error('Error fetching property tenants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property tenants' },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { propertyId } = await params;
    const body = await request.json();
    const { userId, tenantId, start_date, end_date } = body;

    if (!userId || !tenantId) {
      return NextResponse.json(
        { error: 'User ID and Tenant ID are required' },
        { status: 400 }
      );
    }

    const result = await databaseService.addPropertyTenant(
      parseInt(propertyId, 10),
      parseInt(tenantId, 10),
      { start_date, end_date },
      parseInt(userId, 10)
    );
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error adding property tenant:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add property tenant' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { propertyId } = await params;
    const body = await request.json();
    const { userId, tenantId } = body;

    if (!userId || !tenantId) {
      return NextResponse.json(
        { error: 'User ID and Tenant ID are required' },
        { status: 400 }
      );
    }

    const result = await databaseService.removePropertyTenant(
      parseInt(propertyId, 10),
      parseInt(tenantId, 10),
      parseInt(userId, 10)
    );
    
    if (!result) {
      return NextResponse.json(
        { error: 'Property-tenant relationship not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing property tenant:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to remove property tenant' },
      { status: 500 }
    );
  }
}

