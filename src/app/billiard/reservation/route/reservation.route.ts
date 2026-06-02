import { ReservationController } from "../controller/reservation.controller";
import {
  createModuleOpenApiDocument,
  createOpenApiRouter,
  registerOpenApiRoute,
  registerDefaultSecuritySchemes,
} from "../../../../docs/openapi-common";
import {
  createReservationRoute,
  deleteReservationRoute,
  getAllReservationsRoute,
  getReservationByIdRoute,
  updateReservationRoute,
} from "./reservation.openapi";
import { appTokenMiddleware } from "../../../../middleware/appToken";
import { jwtMiddleware } from "../../../../middleware/auth";
import { requirePermission } from "../../../../middleware/permission";

const router = createOpenApiRouter();

registerDefaultSecuritySchemes(router);

// Public routes (NO AUTH)
registerOpenApiRoute(router, createReservationRoute, ReservationController.create);

// Apply middleware globally for all protected routes in this module
router.use("*", jwtMiddleware, appTokenMiddleware, requirePermission());

registerOpenApiRoute(router, getAllReservationsRoute, ReservationController.getAll);
registerOpenApiRoute(router, getReservationByIdRoute, ReservationController.getById);
registerOpenApiRoute(router, updateReservationRoute, ReservationController.update);
registerOpenApiRoute(router, deleteReservationRoute, ReservationController.delete);

export function getReservationOpenApiDocument(baseUrl: string) {
  return createModuleOpenApiDocument(router, baseUrl, "Reservation API");
}

export default router;
