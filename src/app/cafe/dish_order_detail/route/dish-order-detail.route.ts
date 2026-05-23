import { DishOrderDetailController } from "../controller/dish-order-detail.controller";
import {
  createModuleOpenApiDocument,
  createOpenApiRouter,
  registerOpenApiRoute,
  registerDefaultSecuritySchemes,
} from "../../../../docs/openapi-common";
import {
  createDishOrderDetailRoute,
  deleteDishOrderDetailRoute,
  getAllDishOrderDetailsRoute,
  getDishOrderDetailByIdRoute,
  updateDishOrderDetailRoute,
} from "./dish-order-detail.openapi";
import { appTokenMiddleware } from "../../../../middleware/appToken";
import { jwtMiddleware } from "../../../../middleware/auth";
import { requirePermission } from "../../../../middleware/permission";

const router = createOpenApiRouter();

registerDefaultSecuritySchemes(router);

// Apply middleware globally for all routes in this module
router.use("*", jwtMiddleware, appTokenMiddleware, requirePermission());

registerOpenApiRoute(router, getAllDishOrderDetailsRoute, DishOrderDetailController.getAll);
registerOpenApiRoute(router, getDishOrderDetailByIdRoute, DishOrderDetailController.getById);
registerOpenApiRoute(router, createDishOrderDetailRoute, DishOrderDetailController.create);
registerOpenApiRoute(router, updateDishOrderDetailRoute, DishOrderDetailController.update);
registerOpenApiRoute(router, deleteDishOrderDetailRoute, DishOrderDetailController.delete);

export function getDishOrderDetailOpenApiDocument(baseUrl: string) {
  return createModuleOpenApiDocument(router, baseUrl, "Dish Order Detail API");
}

export default router;
