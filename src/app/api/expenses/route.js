import databaseService from '../../../services/databaseService';
import { createCrudRoutes } from '../../../utils/apiHelpers';

/**
 * Expenses API Routes
 * 
 * This file uses a generic CRUD route factory to create standard REST endpoints.
 * The createCrudRoutes helper generates GET and POST handlers automatically.
 * 
 * Available Routes:
 * - GET /api/expenses?userId=123 - Get all expenses for a user
 * - POST /api/expenses - Create a new expense
 * 
 * Note: PUT and DELETE are handled in /api/expenses/[expenseId]/route.js
 * 
 * Request/Response Format:
 * - GET: Returns array of expense objects
 * - POST: Requires { userId, ...expenseData } in body, returns created expense
 */
const routes = createCrudRoutes(databaseService, 'expenses');

// Export GET and POST handlers from the generated routes
export const GET = routes.GET;
export const POST = routes.POST;

