import { NextResponse } from 'next/server';
import databaseService from '../../../services/databaseService';

// GET /api/properties/[propertyId]/tenants - Get property tenants
export async function GET(request, { params }) {
  try {
    const { propertyId } = params;
    
    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    const tenants = await databaseService.getPropertyTenants(propertyId);
    return NextResponse.json(tenants);
  } catch (error) {
    console.error('Error fetching property tenants:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/properties/[propertyId]/tenants - Assign tenant to property
export async function POST(request, { params }) {
  try {
    const { propertyId } = params;
    const leaseData = await request.json();
    
    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    if (!leaseData.tenant_id || !leaseData.lease_start || !leaseData.rent_amount) {
      return NextResponse.json(
        { error: 'Tenant ID, lease start date, and rent amount are required' },
        { status: 400 }
      );
    }

    const result = await databaseService.assignTenantToProperty(
      propertyId, 
      leaseData.tenant_id, 
      leaseData
    );
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error assigning tenant to property:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/properties/[propertyId]/tenants/[tenantId] - Update property-tenant relationship
export async function PUT(request, { params }) {
  try {
    const { propertyId, tenantId } = params;
    const updates = await request.json();
    
    if (!propertyId || !tenantId) {
      return NextResponse.json(
        { error: 'Property ID and Tenant ID are required' },
        { status: 400 }
      );
    }

    const result = await databaseService.updatePropertyTenant(propertyId, tenantId, updates);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating property-tenant relationship:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/properties/[propertyId]/tenants/[tenantId] - Remove tenant from property
export async function DELETE(request, { params }) {
  try {
    const { propertyId, tenantId } = params;
    
    if (!propertyId || !tenantId) {
      return NextResponse.json(
        { error: 'Property ID and Tenant ID are required' },
        { status: 400 }
      );
    }

    const result = await databaseService.removeTenantFromProperty(propertyId, tenantId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error removing tenant from property:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
