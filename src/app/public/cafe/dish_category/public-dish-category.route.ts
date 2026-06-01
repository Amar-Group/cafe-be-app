import { OpenAPIHono } from "@hono/zod-openapi";
import { getPublicDishCategoriesRoute } from "./public-dish-category.openapi";
import { PublicDishCategoryController } from "./public-dish-category.controller";
import { registerDefaultSecuritySchemes, registerOpenApiRoute } from "../../../../docs/openapi-common";

const router = new OpenAPIHono();

registerDefaultSecuritySchemes(router);

registerOpenApiRoute(router, getPublicDishCategoriesRoute, PublicDishCategoryController.getPublic);

export default router;

export function getPublicDishCategoryOpenApiDocument(baseUrl: string) {
  return router.getOpenAPIDocument({
    openapi: "3.0.3",
    info: {
      title: "Public Dish Categories API",
      version: "1.0.0",
    },
    servers: [{ url: baseUrl }],
  });
}
