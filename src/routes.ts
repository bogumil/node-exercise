import { Router } from 'express';
import { orderRoutes } from './modules/orders/order.routes';
import { organizationRoutes } from './modules/organizations/organization.routes';
import { userRoutes } from './modules/users/user.routes';

export const routes = Router();

routes.use('/organizations', organizationRoutes);
routes.use('/users', userRoutes);
routes.use('/orders', orderRoutes);
