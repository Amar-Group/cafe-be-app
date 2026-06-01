import { DishCategoryController } from "../controller/dish-category.controller";
import {
  createModuleOpenApiDocument,
  createOpenApiRouter,
  registerOpenApiRoute,
  registerDefaultSecuritySchemes,
} from "../../../../docs/openapi-common";
import {
  createDishCategoryRoute,
  deleteDishCategoryRoute,
  getAllDishCategoriesRoute,
  getDishCategoryByIdRoute,
  updateDishCategoryRoute,
} from "./dish-category.openapi";
import { appTokenMiddleware } from "../../../../middleware/appToken";
import { jwtMiddleware } from "../../../../middleware/auth";
import { requirePermission } from "../../../../middleware/permission";

const router = createOpenApiRouter();

registerDefaultSecuritySchemes(router);

// Apply middleware globally for all routes in this module
router.use("*", jwtMiddleware, appTokenMiddleware, requirePermission());

registerOpenApiRoute(router, getAllDishCategoriesRoute, DishCategoryController.getAll);
registerOpenApiRoute(router, getDishCategoryByIdRoute, DishCategoryController.getById);
registerOpenApiRoute(router, createDishCategoryRoute, DishCategoryController.create);
registerOpenApiRoute(router, updateDishCategoryRoute, DishCategoryController.update);
registerOpenApiRoute(router, deleteDishCategoryRoute, DishCategoryController.delete);

export function getDishCategoryOpenApiDocument(baseUrl: string) {
  return createModuleOpenApiDocument(router, baseUrl, "Dish Category API");
}

export default router;
