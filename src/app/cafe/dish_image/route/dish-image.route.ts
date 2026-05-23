import { DishImageController } from "../controller/dish-image.controller";
import {
  createModuleOpenApiDocument,
  createOpenApiRouter,
  registerOpenApiRoute,
  registerDefaultSecuritySchemes,
} from "../../../../docs/openapi-common";
import {
  createDishImageRoute,
  deleteDishImageRoute,
  getAllDishImagesRoute,
  getDishImageByIdRoute,
  updateDishImageRoute,
} from "./dish-image.openapi";
import { appTokenMiddleware } from "../../../../middleware/appToken";
import { jwtMiddleware } from "../../../../middleware/auth";
import { requirePermission } from "../../../../middleware/permission";

const router = createOpenApiRouter();

registerDefaultSecuritySchemes(router);

// Apply middleware globally for all routes in this module
router.use("*", jwtMiddleware, appTokenMiddleware, requirePermission());

registerOpenApiRoute(router, getAllDishImagesRoute, DishImageController.getAll);
registerOpenApiRoute(router, getDishImageByIdRoute, DishImageController.getById);
registerOpenApiRoute(router, createDishImageRoute, DishImageController.create);
registerOpenApiRoute(router, updateDishImageRoute, DishImageController.update);
registerOpenApiRoute(router, deleteDishImageRoute, DishImageController.delete);

export function getDishImageOpenApiDocument(baseUrl: string) {
  return createModuleOpenApiDocument(router, baseUrl, "Dish Image API");
}

export default router;
