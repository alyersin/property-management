import databaseService from '../../../services/databaseService';
import { createCrudRoutes } from '../_helpers/apiHelpers';

/**
 * Tenants API Routes
 * 
 * This file uses a generic CRUD route factory to create standard REST endpoints.
 * The createCrudRoutes helper generates GET and POST handlers automatically.
 * 
 * Available Routes:
 * - GET /api/tenants?userId=123 - Get all tenants for a user
 * - POST /api/tenants - Create a new tenant
 * 
 * Note: PUT and DELETE are handled in /api/tenants/[tenantId]/route.js
 * 
 * Request/Response Format:
 * - GET: Returns array of tenant objects
 * - POST: Requires { userId, ...tenantData } in body, returns created tenant
 */
const routes = createCrudRoutes(databaseService, 'tenants');

// Export GET and POST handlers from the generated routes
export const GET = routes.GET;
export const POST = routes.POST;

