import { createRoute } from "@hono/zod-openapi";

import { publicDishCategoryListResponseSchema } from "./public-dish-category.dto";
import { errorResponses, jsonResponse } from "../../../../docs/openapi-common";

const tags = ["Dish Categories"];

export const getPublicDishCategoriesRoute = createRoute({
  method: "get",
  path: "/",
  tags,
  summary: "Get all dish categories (public)",
  security: [],
  responses: {
    200: jsonResponse(publicDishCategoryListResponseSchema, "Dish categories fetched successfully"),
    500: errorResponses[500],
  },
});
