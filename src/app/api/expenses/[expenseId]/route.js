import databaseService from '../../../../services/databaseService';
import { createCrudRoutes } from '../../../../utils/apiHelpers';

/**
 * Expense by ID API Routes
 * 
 * This file handles operations on a specific expense identified by expenseId.
 * Uses a generic CRUD route factory to create standard REST endpoints.
 * 
 * Available Routes:
 * - PUT /api/expenses/[expenseId] - Update a specific expense
 * - DELETE /api/expenses/[expenseId] - Delete a specific expense
 * 
 * Note: GET and POST are handled in /api/expenses/route.js
 * 
 * Request/Response Format:
 * - PUT: Requires { userId, ...expenseUpdates } in body, returns updated expense
 * - DELETE: Requires { userId } in body, returns { success: true }
 * 
 * URL Parameter:
 * - expenseId: The ID of the expense to update or delete
 */
const routes = createCrudRoutes(databaseService, 'expenses');

// Export PUT and DELETE handlers from the generated routes
export const PUT = routes.PUT;
export const DELETE = routes.DELETE;

