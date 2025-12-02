import { NextResponse } from 'next/server';

/**
 * Validates userId from request
 */
export const validateUserId = (userId) => {
  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    );
  }
  return null;
};

/**
 * Generic error handler for API routes
 */
export const handleApiError = (error, operation, resourceName) => {
  console.error(`Error ${operation} ${resourceName}:`, error);
  return NextResponse.json(
    { error: `Failed to ${operation} ${resourceName}` },
    { status: 500 }
  );
};

/**
 * Creates a generic CRUD route handler
 */
export const createCrudRoutes = (service, resourceName) => {
  // Handle naming: properties and tenants use singular for add/update/delete methods
  // Special case: properties -> property (not propertie)
  let resourceSingular;
  if (resourceName === 'properties') {
    resourceSingular = 'property';
  } else {
    resourceSingular = resourceName.slice(0, -1);
  }
  
  const resourceCapitalized = resourceName.charAt(0).toUpperCase() + resourceName.slice(1);
  const resourceSingularCapitalized = resourceSingular.charAt(0).toUpperCase() + resourceSingular.slice(1);
  
  const getMethod = `get${resourceCapitalized}`;
  // Properties and Tenants: addProperty/addTenant (singular form)
  const addMethod = `add${resourceSingularCapitalized}`;
  const updateMethod = `update${resourceSingularCapitalized}`;
  const deleteMethod = `delete${resourceSingularCapitalized}`;

  return {
    async GET(request) {
      try {
        const userId = request.nextUrl.searchParams.get('userId');
        const validationError = validateUserId(userId);
        if (validationError) return validationError;

        const items = await service[getMethod](parseInt(userId, 10));
        return NextResponse.json(items);
      } catch (error) {
        return handleApiError(error, 'fetching', resourceName);
      }
    },

    async POST(request) {
      try {
        const body = await request.json();
        const { userId, ...data } = body;
        
        const validationError = validateUserId(userId);
        if (validationError) return validationError;

        const created = await service[addMethod](data, parseInt(userId, 10));
        return NextResponse.json(created, { status: 201 });
      } catch (error) {
        return handleApiError(error, 'creating', resourceName.slice(0, -1));
      }
    },

    async PUT(request, { params }) {
      try {
        // Handle propertyId and tenantId
        const resolvedParams = await params;
        const idParam = resolvedParams.propertyId || resolvedParams.tenantId;
        const id = parseInt(idParam, 10);
        const body = await request.json();
        const { userId, ...updates } = body;

        const validationError = validateUserId(userId);
        if (validationError) return validationError;

        if (Object.keys(updates).length === 0) {
          return NextResponse.json(
            { error: 'No updates provided' },
            { status: 400 }
          );
        }

        const updated = await service[updateMethod](id, updates, parseInt(userId, 10));

        if (!updated) {
          const resourceSingular = resourceName.slice(0, -1);
          const resourceNameCapitalized = resourceSingular.charAt(0).toUpperCase() + resourceSingular.slice(1);
          return NextResponse.json(
            { error: `${resourceNameCapitalized} not found` },
            { status: 404 }
          );
        }

        return NextResponse.json(updated);
      } catch (error) {
        return handleApiError(error, 'updating', resourceName.slice(0, -1));
      }
    },

    async DELETE(request, { params }) {
      try {
        // Handle propertyId and tenantId
        const resolvedParams = await params;
        const idParam = resolvedParams.propertyId || resolvedParams.tenantId;
        const id = parseInt(idParam, 10);
        const body = await request.json();
        const { userId } = body;

        const validationError = validateUserId(userId);
        if (validationError) return validationError;

        const deleted = await service[deleteMethod](id, parseInt(userId, 10));

        if (!deleted) {
          const resourceSingular = resourceName.slice(0, -1);
          const resourceNameCapitalized = resourceSingular.charAt(0).toUpperCase() + resourceSingular.slice(1);
          return NextResponse.json(
            { error: `${resourceNameCapitalized} not found` },
            { status: 404 }
          );
        }

        return NextResponse.json({ success: true });
      } catch (error) {
        return handleApiError(error, 'deleting', resourceName.slice(0, -1));
      }
    }
  };
};

