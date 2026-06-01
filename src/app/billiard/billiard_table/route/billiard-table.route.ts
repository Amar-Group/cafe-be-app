import { BilliardTableController } from "../controller/billiard-table.controller";
import {
  createModuleOpenApiDocument,
  createOpenApiRouter,
  registerOpenApiRoute,
  registerDefaultSecuritySchemes,
} from "../../../../docs/openapi-common";
import {
  createBilliardTableRoute,
  deleteBilliardTableRoute,
  getAllBilliardTablesRoute,
  getBilliardTableByIdRoute,
  updateBilliardTableRoute,
} from "./billiard-table.openapi";
import { appTokenMiddleware } from "../../../../middleware/appToken";
import { jwtMiddleware } from "../../../../middleware/auth";
import { requirePermission } from "../../../../middleware/permission";

const router = createOpenApiRouter();

registerDefaultSecuritySchemes(router);

// Apply middleware globally for all routes in this module
router.use("*", jwtMiddleware, appTokenMiddleware, requirePermission());

registerOpenApiRoute(router, getAllBilliardTablesRoute, BilliardTableController.getAll);
registerOpenApiRoute(router, getBilliardTableByIdRoute, BilliardTableController.getById);
registerOpenApiRoute(router, createBilliardTableRoute, BilliardTableController.create);
registerOpenApiRoute(router, updateBilliardTableRoute, BilliardTableController.update);
registerOpenApiRoute(router, deleteBilliardTableRoute, BilliardTableController.delete);

export function getBilliardTableOpenApiDocument(baseUrl: string) {
  return createModuleOpenApiDocument(router, baseUrl, "Billiard Table API");
}

export default router;
