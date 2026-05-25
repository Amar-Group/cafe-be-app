import { createRoute } from "@hono/zod-openapi";
import {
  apiErrorResponseSchema,
  createNumericPathParamsSchema,
  errorResponses,
  jsonResponse,
  protectedSecurity,
} from "../../../../docs/openapi-common";
import {
  createScheduleRequestSchema,
  updateScheduleRequestSchema,
} from "../dto/schedule-request.dto";
import {
  scheduleDetailResponseSchema,
  scheduleListResponseSchema,
  scheduleMutationResponseSchema,
} from "../dto/schedule-response.dto";

const tags = ["Schedules"];
const scheduleIdParamsSchema = createNumericPathParamsSchema("id");

export const getAllSchedulesRoute = createRoute({
  method: "get",
  path: "/",
  tags,
  summary: "Get all schedules",
  security: protectedSecurity,
  responses: {
    200: jsonResponse(scheduleListResponseSchema, "Schedules fetched successfully"),
    401: errorResponses[401],
    403: errorResponses[403],
    500: errorResponses[500],
  },
});

export const getScheduleByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags,
  summary: "Get schedule by ID",
  security: protectedSecurity,
  request: {
    params: scheduleIdParamsSchema,
  },
  responses: {
    200: jsonResponse(scheduleDetailResponseSchema, "Schedule fetched successfully"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: errorResponses[404],
    500: errorResponses[500],
  },
});

export const createScheduleRoute = createRoute({
  method: "post",
  path: "/",
  tags,
  summary: "Create schedule",
  security: protectedSecurity,
  request: {
    body: {
      content: {
        "application/json": {
          schema: createScheduleRequestSchema,
        },
      },
    },
  },
  responses: {
    201: jsonResponse(scheduleMutationResponseSchema, "Schedule created successfully"),
    400: {
      description: "Validation error",
      content: {
        "application/json": {
          schema: apiErrorResponseSchema,
        },
      },
    },
    401: errorResponses[401],
    403: errorResponses[403],
    500: errorResponses[500],
  },
});

export const updateScheduleRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags,
  summary: "Update schedule",
  security: protectedSecurity,
  request: {
    params: scheduleIdParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: updateScheduleRequestSchema,
        },
      },
    },
  },
  responses: {
    200: jsonResponse(scheduleMutationResponseSchema, "Schedule updated successfully"),
    400: {
      description: "Validation error",
      content: {
        "application/json": {
          schema: apiErrorResponseSchema,
        },
      },
    },
    401: errorResponses[401],
    403: errorResponses[403],
    404: errorResponses[404],
    500: errorResponses[500],
  },
});

export const deleteScheduleRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags,
  summary: "Delete schedule",
  security: protectedSecurity,
  request: {
    params: scheduleIdParamsSchema,
  },
  responses: {
    200: jsonResponse(scheduleMutationResponseSchema, "Schedule deleted successfully"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: errorResponses[404],
    500: errorResponses[500],
  },
});
