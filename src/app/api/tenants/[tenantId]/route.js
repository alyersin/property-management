import databaseService from '../../../../services/databaseService';
import { createCrudRoutes } from '../../_helpers/apiHelpers';

/**
 * Tenant by ID API Routes
 * 
 * This file handles operations on a specific tenant identified by tenantId.
 * Uses a generic CRUD route factory to create standard REST endpoints.
 * 
 * Available Routes:
 * - PUT /api/tenants/[tenantId] - Update a specific tenant
 * - DELETE /api/tenants/[tenantId] - Delete a specific tenant
 * 
 * Note: GET and POST are handled in /api/tenants/route.js
 * 
 * Request/Response Format:
 * - PUT: Requires { userId, ...tenantUpdates } in body, returns updated tenant
 * - DELETE: Requires { userId } in body, returns { success: true }
 * 
 * URL Parameter:
 * - tenantId: The ID of the tenant to update or delete
 */
const routes = createCrudRoutes(databaseService, 'tenants');

// Export PUT and DELETE handlers from the generated routes
export const PUT = routes.PUT;
export const DELETE = routes.DELETE;

