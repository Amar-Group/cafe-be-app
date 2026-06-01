import { DishController } from "../controller/dish.controller";
import {
  createModuleOpenApiDocument,
  createOpenApiRouter,
  registerOpenApiRoute,
  registerDefaultSecuritySchemes,
} from "../../../../docs/openapi-common";
import {
  createDishRoute,
  deleteDishRoute,
  getAllDishesRoute,
  getDishByIdRoute,
  updateDishRoute,
} from "./dish.openapi";
import { appTokenMiddleware } from "../../../../middleware/appToken";
import { jwtMiddleware } from "../../../../middleware/auth";
import { requirePermission } from "../../../../middleware/permission";

const router = createOpenApiRouter();

registerDefaultSecuritySchemes(router);

// Apply middleware globally for all routes in this module
router.use("*", jwtMiddleware, appTokenMiddleware, requirePermission());

registerOpenApiRoute(router, getAllDishesRoute, DishController.getAll);
registerOpenApiRoute(router, getDishByIdRoute, DishController.getById);
registerOpenApiRoute(router, createDishRoute, DishController.create);
registerOpenApiRoute(router, updateDishRoute, DishController.update);
registerOpenApiRoute(router, deleteDishRoute, DishController.delete);

export function getDishOpenApiDocument(baseUrl: string) {
  return createModuleOpenApiDocument(router, baseUrl, "Dish API");
}

export default router;
