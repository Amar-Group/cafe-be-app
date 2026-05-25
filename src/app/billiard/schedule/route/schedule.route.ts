import { ScheduleController } from "../controller/schedule.controller";
import {
  createModuleOpenApiDocument,
  createOpenApiRouter,
  registerOpenApiRoute,
  registerDefaultSecuritySchemes,
} from "../../../../docs/openapi-common";
import {
  createScheduleRoute,
  deleteScheduleRoute,
  getAllSchedulesRoute,
  getScheduleByIdRoute,
  updateScheduleRoute,
} from "./schedule.openapi";
import { appTokenMiddleware } from "../../../../middleware/appToken";
import { jwtMiddleware } from "../../../../middleware/auth";
import { requirePermission } from "../../../../middleware/permission";

const router = createOpenApiRouter();

registerDefaultSecuritySchemes(router);

// Apply middleware globally for all routes in this module
router.use("*", jwtMiddleware, appTokenMiddleware, requirePermission());

registerOpenApiRoute(router, getAllSchedulesRoute, ScheduleController.getAll);
registerOpenApiRoute(router, getScheduleByIdRoute, ScheduleController.getById);
registerOpenApiRoute(router, createScheduleRoute, ScheduleController.create);
registerOpenApiRoute(router, updateScheduleRoute, ScheduleController.update);
registerOpenApiRoute(router, deleteScheduleRoute, ScheduleController.delete);

export function getScheduleOpenApiDocument(baseUrl: string) {
  return createModuleOpenApiDocument(router, baseUrl, "Schedule API");
}

export default router;
