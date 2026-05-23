import { PaymentController } from "../controller/payment.controller";
import {
  createModuleOpenApiDocument,
  createOpenApiRouter,
  registerOpenApiRoute,
  registerDefaultSecuritySchemes,
} from "../../../../docs/openapi-common";
import {
  createPaymentRoute,
  deletePaymentRoute,
  getAllPaymentsRoute,
  getPaymentByIdRoute,
  updatePaymentRoute,
} from "./payment.openapi";
import { appTokenMiddleware } from "../../../../middleware/appToken";
import { jwtMiddleware } from "../../../../middleware/auth";
import { requirePermission } from "../../../../middleware/permission";

const router = createOpenApiRouter();

registerDefaultSecuritySchemes(router);

// Apply middleware globally for all routes in this module
router.use("*", jwtMiddleware, appTokenMiddleware, requirePermission());

registerOpenApiRoute(router, getAllPaymentsRoute, PaymentController.getAll);
registerOpenApiRoute(router, getPaymentByIdRoute, PaymentController.getById);
registerOpenApiRoute(router, createPaymentRoute, PaymentController.create);
registerOpenApiRoute(router, updatePaymentRoute, PaymentController.update);
registerOpenApiRoute(router, deletePaymentRoute, PaymentController.delete);

export function getPaymentOpenApiDocument(baseUrl: string) {
  return createModuleOpenApiDocument(router, baseUrl, "Payment API");
}

export default router;
