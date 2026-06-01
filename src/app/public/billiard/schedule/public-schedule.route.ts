import { OpenAPIHono } from "@hono/zod-openapi";
import { getPublicSchedulesRoute } from "./public-schedule.openapi";
import { PublicScheduleController } from "./public-schedule.controller";
import { createModuleOpenApiDocument, registerDefaultSecuritySchemes, registerOpenApiRoute } from "../../../../docs/openapi-common";

const router = new OpenAPIHono();

registerDefaultSecuritySchemes(router);

registerOpenApiRoute(router, getPublicSchedulesRoute, PublicScheduleController.getPublic);

export function getPublicScheduleOpenApiDocument(baseUrl: string) {
  return createModuleOpenApiDocument(router, baseUrl, "Public Billiard Schedule API");
}

export default router;
