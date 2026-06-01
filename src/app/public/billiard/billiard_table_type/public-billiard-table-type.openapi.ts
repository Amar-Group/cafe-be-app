import { createRoute } from "@hono/zod-openapi";
import { PublicBilliardTableTypeListResponseSchema } from "./public-billiard-table-type.dto";

export const getPublicBilliardTableTypesRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Public Billiard Table Types"],
  summary: "Get all public billiard table types",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: PublicBilliardTableTypeListResponseSchema,
        },
      },
      description: "List of all public billiard table types",
    },
  },
});
