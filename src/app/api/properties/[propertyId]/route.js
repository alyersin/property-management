import databaseService from '../../../../services/databaseService';
import { createCrudRoutes } from '../../../../utils/apiHelpers';

const routes = createCrudRoutes(databaseService, 'properties');

export const PUT = routes.PUT;
export const DELETE = routes.DELETE;

