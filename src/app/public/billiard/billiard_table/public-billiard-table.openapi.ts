import { createRoute } from "@hono/zod-openapi";
import { PublicBilliardTableListResponseSchema } from "./public-billiard-table.dto";
import { errorResponses, jsonResponse } from "../../../../docs/openapi-common";

const tags = ["Public Billiard Tables"];

export const getPublicBilliardTablesRoute = createRoute({
  method: "get",
  path: "/",
  tags,
  summary: "Get all dishes (public)",
  security: [],
  responses: {
    200: jsonResponse(PublicBilliardTableListResponseSchema, "Public billiard tables fetched successfully"),
    500: errorResponses[500],
  },
});
