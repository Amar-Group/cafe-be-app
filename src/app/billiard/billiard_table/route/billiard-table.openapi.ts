import { createRoute } from "@hono/zod-openapi";
import {
  apiErrorResponseSchema,
  createNumericPathParamsSchema,
  jsonResponse,
  protectedSecurity,
  errorResponses,
} from "../../../../docs/openapi-common";
import {
  createBilliardTableRequestSchema,
  updateBilliardTableRequestSchema,
} from "../dto/billiard-table-request.dto";
import {
  billiardTableListResponseSchema,
  billiardTableDetailResponseSchema,
  billiardTableMutationResponseSchema,
} from "../dto/billiard-table-response.dto";

const tags = ["Billiard Tables"];
const billiardTableIdParamsSchema = createNumericPathParamsSchema("id");

export const getAllBilliardTablesRoute = createRoute({
  method: "get",
  path: "/",
  tags,
  summary: "Get all billiard tables",
  security: protectedSecurity,
  responses: {
    200: jsonResponse(billiardTableListResponseSchema, "Billiard tables fetched successfully"),
    401: errorResponses[401],
    403: errorResponses[403],
    500: errorResponses[500],
  },
});

export const getBilliardTableByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags,
  summary: "Get billiard table by id",
  security: protectedSecurity,
  request: {
    params: billiardTableIdParamsSchema,
  },
  responses: {
    200: jsonResponse(billiardTableDetailResponseSchema, "Billiard table fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid billiard table id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Billiard table not found"),
    500: errorResponses[500],
  },
});

export const createBilliardTableRoute = createRoute({
  method: "post",
  path: "/",
  tags,
  summary: "Create billiard table",
  security: protectedSecurity,
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createBilliardTableRequestSchema,
        },
      },
    },
  },
  responses: {
    201: jsonResponse(billiardTableMutationResponseSchema, "Billiard table created successfully"),
    ...errorResponses,
  },
});

export const updateBilliardTableRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags,
  summary: "Update billiard table",
  security: protectedSecurity,
  request: {
    params: billiardTableIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateBilliardTableRequestSchema,
        },
      },
    },
  },
  responses: {
    200: jsonResponse(billiardTableMutationResponseSchema, "Billiard table updated successfully"),
    ...errorResponses,
    404: jsonResponse(apiErrorResponseSchema, "Billiard table not found"),
  },
});

export const deleteBilliardTableRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags,
  summary: "Delete billiard table",
  security: protectedSecurity,
  request: {
    params: billiardTableIdParamsSchema,
  },
  responses: {
    200: jsonResponse(billiardTableMutationResponseSchema, "Billiard table deleted successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid billiard table id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Billiard table not found"),
    500: errorResponses[500],
  },
});
