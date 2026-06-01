import { createRoute } from "@hono/zod-openapi";

import { publicDishListResponseSchema } from "./public-dish.dto";
import {
  jsonResponse,
  errorResponses,
} from "../../../../docs/openapi-common";

const tags = ["Dishes"];

export const getPublicDishesRoute = createRoute({
  method: "get",
  path: "/",
  tags,
  summary: "Get all dishes (public)",
  security: [],
  responses: {
    200: jsonResponse(publicDishListResponseSchema, "Dishes fetched successfully"),
    500: errorResponses[500],
  },
});
