import { NextResponse } from 'next/server';
import databaseService from '../../../../../services/databaseService';

// GET /api/properties/[propertyId]/amenities - Get property amenities
export async function GET(request, { params }) {
  try {
    const { propertyId } = params;
    
    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    const amenities = await databaseService.getPropertyAmenities(propertyId);
    return NextResponse.json(amenities);
  } catch (error) {
    console.error('Error fetching property amenities:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/properties/[propertyId]/amenities - Add amenity to property
export async function POST(request, { params }) {
  try {
    const { propertyId } = params;
    const { amenityId } = await request.json();
    
    if (!propertyId || !amenityId) {
      return NextResponse.json(
        { error: 'Property ID and Amenity ID are required' },
        { status: 400 }
      );
    }

    const result = await databaseService.addAmenityToProperty(propertyId, amenityId);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error adding amenity to property:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/properties/[propertyId]/amenities - Remove amenity from property
export async function DELETE(request, { params }) {
  try {
    const { propertyId } = params;
    const { amenityId } = await request.json();
    
    if (!propertyId || !amenityId) {
      return NextResponse.json(
        { error: 'Property ID and Amenity ID are required' },
        { status: 400 }
      );
    }

    const result = await databaseService.removeAmenityFromProperty(propertyId, amenityId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error removing amenity from property:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
