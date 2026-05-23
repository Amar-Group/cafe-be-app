import { BilliardTableImageController } from "../controller/billiard-table-image.controller";
import {
  createModuleOpenApiDocument,
  createOpenApiRouter,
  registerOpenApiRoute,
  registerDefaultSecuritySchemes,
} from "../../../../docs/openapi-common";
import {
  createBilliardTableImageRoute,
  deleteBilliardTableImageRoute,
  getAllBilliardTableImagesRoute,
  getBilliardTableImageByIdRoute,
  updateBilliardTableImageRoute,
} from "./billiard-table-image.openapi";
import { appTokenMiddleware } from "../../../../middleware/appToken";
import { jwtMiddleware } from "../../../../middleware/auth";
import { requirePermission } from "../../../../middleware/permission";

const router = createOpenApiRouter();

registerDefaultSecuritySchemes(router);

// Apply middleware globally for all routes in this module
router.use("*", jwtMiddleware, appTokenMiddleware, requirePermission());

registerOpenApiRoute(router, getAllBilliardTableImagesRoute, BilliardTableImageController.getAll);
registerOpenApiRoute(router, getBilliardTableImageByIdRoute, BilliardTableImageController.getById);
registerOpenApiRoute(router, createBilliardTableImageRoute, BilliardTableImageController.create);
registerOpenApiRoute(router, updateBilliardTableImageRoute, BilliardTableImageController.update);
registerOpenApiRoute(router, deleteBilliardTableImageRoute, BilliardTableImageController.delete);

export function getBilliardTableImageOpenApiDocument(baseUrl: string) {
  return createModuleOpenApiDocument(router, baseUrl, "Billiard Table Image API");
}

export default router;
