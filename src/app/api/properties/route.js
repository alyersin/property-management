import databaseService from '../../../services/databaseService';
import { createCrudRoutes } from '../_helpers/apiHelpers';

/**
 * Properties API Routes
 * 
 * This file uses a generic CRUD route factory to create standard REST endpoints.
 * The createCrudRoutes helper generates GET and POST handlers automatically.
 * 
 * Available Routes:
 * - GET /api/properties?userId=123 - Get all properties for a user
 * - POST /api/properties - Create a new property
 * 
 * Note: PUT and DELETE are handled in /api/properties/[propertyId]/route.js
 * 
 * Request/Response Format:
 * - GET: Returns array of property objects
 * - POST: Requires { userId, ...propertyData } in body, returns created property
 */
const routes = createCrudRoutes(databaseService, 'properties');

// Export GET and POST handlers from the generated routes
export const GET = routes.GET;
export const POST = routes.POST;

