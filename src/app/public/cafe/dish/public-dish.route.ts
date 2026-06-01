import { OpenAPIHono } from "@hono/zod-openapi";
import { getPublicDishesRoute } from "./public-dish.openapi";
import { PublicDishController } from "./public-dish.controller";
import { createModuleOpenApiDocument, registerDefaultSecuritySchemes, registerOpenApiRoute } from "../../../../docs/openapi-common";

const router = new OpenAPIHono();

registerDefaultSecuritySchemes(router);

registerOpenApiRoute(router, getPublicDishesRoute, PublicDishController.getPublic)

export function getPublicDishOpenApiDocument(baseUrl: string) {
  return createModuleOpenApiDocument(router, baseUrl, "Public Dish API")
}

export default router;