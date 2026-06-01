import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { loggerMiddleware } from './middleware/appToken';
import { originGuard, corsMiddleware } from './middleware/originGuard';
import { notFoundHandler, errorHandler } from './middleware/errorHandler';
import userRoutes from './app/user/route/user.route';
import roleRoutes from './app/role/route/role.route';
import menuRoutes from './app/menu/route/menu.route';
import rolePermissionRoutes from './app/role_permission/route/role-permission.route';
import uploadRoutes from './app/upload/route/upload.route';
import dishCategoryRoutes from './app/cafe/dish_category/route/dish-category.route';
import dishRoutes from './app/cafe/dish/route/dish.route';
import publicDishCategoryRoutes from './app/public/cafe/dish_category/public-dish-category.route';
import publicDishRoutes from './app/public/cafe/dish/public-dish.route';
import publicBilliardTableTypeRoutes from './app/public/billiard/billiard_table_type/public-billiard-table-type.route';
import publicBilliardTableRoutes from './app/public/billiard/billiard_table/public-billiard-table.route';
import publicScheduleRoutes from './app/public/billiard/schedule/public-schedule.route';
import dishImageRoutes from './app/cafe/dish_image/route/dish-image.route';
import dishOrderRoutes from './app/cafe/dish_order/route/dish-order.route';
import dishOrderDetailRoutes from './app/cafe/dish_order_detail/route/dish-order-detail.route';
import billiardTableTypeRoutes from './app/billiard/billiard_table_type/route/billiard-table-type.route';
import billiardTableRoutes from './app/billiard/billiard_table/route/billiard-table.route';
import billiardTableImageRoutes from './app/billiard/billiard_table_image/route/billiard-table-image.route';
import reservationRoutes from './app/billiard/reservation/route/reservation.route';
import scheduleRoutes from './app/billiard/schedule/route/schedule.route';
import paymentRoutes from './app/payment/route/payment.route';
import { apiReference } from '@scalar/hono-api-reference';
import {
  createOpenApiDocument,
  getServerUrl,
} from './docs/openapi';

const app = new Hono();

// Global Middleware
app.use('*', corsMiddleware);
app.use('*', originGuard);
app.use(logger());
app.use(loggerMiddleware);

// Welcome endpoint (Public)
app.get('/', (c) => {
  return c.json({
    success: true,
    message: 'Welcome to Hono Backend Starter API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint (Public)
app.get('/api/health', (c) => {
  return c.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// OpenAPI and Scalar reference (Public)
app.get('/openapi.json', (c) => {
  const baseUrl = getServerUrl(c.req.url);
  return c.json(createOpenApiDocument(baseUrl));
});

app.get('/docs', apiReference({
  spec: {
    url: '/openapi.json',
  },
} as any));

app.route("/api/uploads", uploadRoutes);

// API Routes - Feature based
// Note: User routes have public login endpoint, others require JWT
app.route('/api/users', userRoutes);
app.route('/api/roles', roleRoutes);
app.route('/api/menus', menuRoutes);
app.route('/api/role-permissions', rolePermissionRoutes);
app.route('/api/uploads', uploadRoutes);

// Public API Routes
app.route('/api/public/dish-categories', publicDishCategoryRoutes);
app.route('/api/public/dishes', publicDishRoutes);
app.route('/api/public/billiard-table-types', publicBilliardTableTypeRoutes);
app.route('/api/public/billiard-tables', publicBilliardTableRoutes);
app.route('/api/public/schedules', publicScheduleRoutes);

// Private API Routes
app.route('/api/dish-categories', dishCategoryRoutes);
app.route('/api/dishes', dishRoutes);
app.route('/api/dish-images', dishImageRoutes);
app.route('/api/dish-orders', dishOrderRoutes);
app.route('/api/dish-order-details', dishOrderDetailRoutes);
app.route('/api/billiard-table-types', billiardTableTypeRoutes);
app.route('/api/billiard-tables', billiardTableRoutes);
app.route('/api/billiard-table-images', billiardTableImageRoutes);
app.route('/api/reservations', reservationRoutes);
app.route('/api/schedules', scheduleRoutes);
app.route('/api/payments', paymentRoutes);

// Handlers
app.notFound(notFoundHandler);
app.onError(errorHandler);

import { handle } from 'hono/vercel';

export default handle(app);
