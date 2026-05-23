import { BilliardTableTypeController } from "../controller/billiard-table-type.controller";
import {
  createModuleOpenApiDocument,
  createOpenApiRouter,
  registerOpenApiRoute,
  registerDefaultSecuritySchemes,
} from "../../../../docs/openapi-common";
import {
  createBilliardTableTypeRoute,
  deleteBilliardTableTypeRoute,
  getAllBilliardTableTypesRoute,
  getBilliardTableTypeByIdRoute,
  updateBilliardTableTypeRoute,
} from "./billiard-table-type.openapi";
import { appTokenMiddleware } from "../../../../middleware/appToken";
import { jwtMiddleware } from "../../../../middleware/auth";
import { requirePermission } from "../../../../middleware/permission";

const router = createOpenApiRouter();

registerDefaultSecuritySchemes(router);

// Apply middleware globally for all routes in this module
router.use("*", jwtMiddleware, appTokenMiddleware, requirePermission());

registerOpenApiRoute(router, getAllBilliardTableTypesRoute, BilliardTableTypeController.getAll);
registerOpenApiRoute(router, getBilliardTableTypeByIdRoute, BilliardTableTypeController.getById);
registerOpenApiRoute(router, createBilliardTableTypeRoute, BilliardTableTypeController.create);
registerOpenApiRoute(router, updateBilliardTableTypeRoute, BilliardTableTypeController.update);
registerOpenApiRoute(router, deleteBilliardTableTypeRoute, BilliardTableTypeController.delete);

export function getBilliardTableTypeOpenApiDocument(baseUrl: string) {
  return createModuleOpenApiDocument(router, baseUrl, "Billiard Table Type API");
}

export default router;
