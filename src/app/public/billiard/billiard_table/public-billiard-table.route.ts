import { OpenAPIHono } from "@hono/zod-openapi";
import { getPublicBilliardTablesRoute } from "./public-billiard-table.openapi";
import { PublicBilliardTableController } from "./public-billiard-table.controller";
import { createModuleOpenApiDocument, registerDefaultSecuritySchemes, registerOpenApiRoute } from "../../../../docs/openapi-common";

const router = new OpenAPIHono();

registerDefaultSecuritySchemes(router);

registerOpenApiRoute(router, getPublicBilliardTablesRoute, PublicBilliardTableController.getPublic);

export function getPublicBilliardTableOpenApiDocument(baseUrl: string) {
  return createModuleOpenApiDocument(router, baseUrl, "Public Billiard Table API");
}

export default router;
