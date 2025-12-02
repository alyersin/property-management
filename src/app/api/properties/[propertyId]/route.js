import databaseService from '../../../../services/databaseService';
import { createCrudRoutes } from '../../_helpers/apiHelpers';

/**
 * Property by ID API Routes
 * 
 * This file handles operations on a specific property identified by propertyId.
 * Uses a generic CRUD route factory to create standard REST endpoints.
 * 
 * Available Routes:
 * - PUT /api/properties/[propertyId] - Update a specific property
 * - DELETE /api/properties/[propertyId] - Delete a specific property
 * 
 * Note: GET and POST are handled in /api/properties/route.js
 * 
 * Request/Response Format:
 * - PUT: Requires { userId, ...propertyUpdates } in body, returns updated property
 * - DELETE: Requires { userId } in body, returns { success: true }
 * 
 * URL Parameter:
 * - propertyId: The ID of the property to update or delete
 */
const routes = createCrudRoutes(databaseService, 'properties');

// Export PUT and DELETE handlers from the generated routes
export const PUT = routes.PUT;
export const DELETE = routes.DELETE;

