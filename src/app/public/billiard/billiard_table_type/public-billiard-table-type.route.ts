import { OpenAPIHono } from "@hono/zod-openapi";
import { getPublicBilliardTableTypesRoute } from "./public-billiard-table-type.openapi";
import { PublicBilliardTableTypeController } from "./public-billiard-table-type.controller";
import { createModuleOpenApiDocument, registerDefaultSecuritySchemes, registerOpenApiRoute } from "../../../../docs/openapi-common";

const router = new OpenAPIHono();

registerDefaultSecuritySchemes(router);

registerOpenApiRoute(router, getPublicBilliardTableTypesRoute, PublicBilliardTableTypeController.getPublic);

export function getPublicBilliardTableTypeOpenApiDocument(baseUrl: string) {
  return createModuleOpenApiDocument(router, baseUrl, "Public Billiard Table Type API");
}

export default router;
