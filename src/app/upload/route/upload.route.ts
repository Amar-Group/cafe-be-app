import { UploadController } from "../controller/upload.controller";
import {
  createModuleOpenApiDocument,
  createOpenApiRouter,
  registerOpenApiRoute,
  registerDefaultSecuritySchemes,
} from "../../../docs/openapi-common";
import { createUploadSignatureRoute } from "./upload.openapi";
import { appTokenMiddleware } from "../../../middleware/appToken";
import { jwtMiddleware } from "../../../middleware/auth";

const router = createOpenApiRouter();

registerDefaultSecuritySchemes(router);

// Apply middleware globally for all routes in this module
router.use("*", jwtMiddleware, appTokenMiddleware);

registerOpenApiRoute(
  router,
  createUploadSignatureRoute,
  UploadController.createSignature,
);

export function getUploadOpenApiDocument(baseUrl: string) {
  return createModuleOpenApiDocument(router, baseUrl, "Upload API");
}

export default router;
