import { createRoute } from "@hono/zod-openapi";
import { PublicScheduleListResponseSchema } from "./public-schedule.dto";

export const getPublicSchedulesRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Public Billiard Schedules"],
  summary: "Get all public billiard schedules",
  description: "Retrieve a list of all available billiard schedules (publicly accessible).",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: PublicScheduleListResponseSchema,
        },
      },
      description: "Successfully retrieved public schedules",
    },
  },
});
