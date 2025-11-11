import databaseService from '../../../../services/databaseService';
import { createCrudRoutes } from '../../../../utils/apiHelpers';

const routes = createCrudRoutes(databaseService, 'expenses');

export const PUT = routes.PUT;
export const DELETE = routes.DELETE;

