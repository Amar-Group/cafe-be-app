import { createRoute } from "@hono/zod-openapi";
import {
  apiErrorResponseSchema,
  createNumericPathParamsSchema,
  jsonResponse,
  protectedSecurity,
  errorResponses,
} from "../../../../docs/openapi-common";
import {
  createBilliardTableTypeRequestSchema,
  updateBilliardTableTypeRequestSchema,
} from "../dto/billiard-table-type-request.dto";
import {
  billiardTableTypeListResponseSchema,
  billiardTableTypeDetailResponseSchema,
  billiardTableTypeMutationResponseSchema,
} from "../dto/billiard-table-type-response.dto";

const tags = ["Billiard Table Types"];
const billiardTableTypeIdParamsSchema = createNumericPathParamsSchema("id");

export const getAllBilliardTableTypesRoute = createRoute({
  method: "get",
  path: "/",
  tags,
  summary: "Get all billiard table types",
  security: protectedSecurity,
  responses: {
    200: jsonResponse(billiardTableTypeListResponseSchema, "Billiard table types fetched successfully"),
    401: errorResponses[401],
    403: errorResponses[403],
    500: errorResponses[500],
  },
});

export const getBilliardTableTypeByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags,
  summary: "Get billiard table type by id",
  security: protectedSecurity,
  request: {
    params: billiardTableTypeIdParamsSchema,
  },
  responses: {
    200: jsonResponse(billiardTableTypeDetailResponseSchema, "Billiard table type fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid billiard table type id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Billiard table type not found"),
    500: errorResponses[500],
  },
});

export const createBilliardTableTypeRoute = createRoute({
  method: "post",
  path: "/",
  tags,
  summary: "Create billiard table type",
  security: protectedSecurity,
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createBilliardTableTypeRequestSchema,
        },
      },
    },
  },
  responses: {
    201: jsonResponse(billiardTableTypeMutationResponseSchema, "Billiard table type created successfully"),
    ...errorResponses,
  },
});

export const updateBilliardTableTypeRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags,
  summary: "Update billiard table type",
  security: protectedSecurity,
  request: {
    params: billiardTableTypeIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateBilliardTableTypeRequestSchema,
        },
      },
    },
  },
  responses: {
    200: jsonResponse(billiardTableTypeMutationResponseSchema, "Billiard table type updated successfully"),
    ...errorResponses,
    404: jsonResponse(apiErrorResponseSchema, "Billiard table type not found"),
  },
});

export const deleteBilliardTableTypeRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags,
  summary: "Delete billiard table type",
  security: protectedSecurity,
  request: {
    params: billiardTableTypeIdParamsSchema,
  },
  responses: {
    200: jsonResponse(billiardTableTypeMutationResponseSchema, "Billiard table type deleted successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid billiard table type id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Billiard table type not found"),
    500: errorResponses[500],
  },
});
