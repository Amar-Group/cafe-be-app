import { DishOrderController } from "../controller/dish-order.controller";
import {
  createModuleOpenApiDocument,
  createOpenApiRouter,
  registerOpenApiRoute,
  registerDefaultSecuritySchemes,
} from "../../../../docs/openapi-common";
import {
  createDishOrderRoute,
  deleteDishOrderRoute,
  getAllDishOrdersRoute,
  getDishOrderByIdRoute,
  updateDishOrderRoute,
} from "./dish-order.openapi";
import { appTokenMiddleware } from "../../../../middleware/appToken";
import { jwtMiddleware } from "../../../../middleware/auth";
import { requirePermission } from "../../../../middleware/permission";

const router = createOpenApiRouter();

registerDefaultSecuritySchemes(router);

// Public routes (NO AUTH)
registerOpenApiRoute(router, createDishOrderRoute, DishOrderController.create);
registerOpenApiRoute(router, getDishOrderByIdRoute, DishOrderController.getById);

// Apply middleware globally for all protected routes in this module
router.use("*", jwtMiddleware, appTokenMiddleware, requirePermission());

registerOpenApiRoute(router, getAllDishOrdersRoute, DishOrderController.getAll);
registerOpenApiRoute(router, updateDishOrderRoute, DishOrderController.update);
registerOpenApiRoute(router, deleteDishOrderRoute, DishOrderController.delete);

export function getDishOrderOpenApiDocument(baseUrl: string) {
  return createModuleOpenApiDocument(router, baseUrl, "Dish Order API");
}

export default router;
