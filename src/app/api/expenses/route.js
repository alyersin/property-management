import databaseService from '../../../services/databaseService';
import { createCrudRoutes } from '../../../utils/apiHelpers';

const routes = createCrudRoutes(databaseService, 'expenses');

export const GET = routes.GET;
export const POST = routes.POST;

