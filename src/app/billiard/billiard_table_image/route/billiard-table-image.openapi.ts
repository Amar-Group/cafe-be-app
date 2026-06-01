import { createRoute } from "@hono/zod-openapi";
import {
  apiErrorResponseSchema,
  createNumericPathParamsSchema,
  jsonResponse,
  protectedSecurity,
  errorResponses,
} from "../../../../docs/openapi-common";
import {
  createBilliardTableImageRequestSchema,
  updateBilliardTableImageRequestSchema,
} from "../dto/billiard-table-image-request.dto";
import {
  billiardTableImageListResponseSchema,
  billiardTableImageDetailResponseSchema,
  billiardTableImageMutationResponseSchema,
} from "../dto/billiard-table-image-response.dto";

const tags = ["Billiard Table Images"];
const billiardTableImageIdParamsSchema = createNumericPathParamsSchema("id");

export const getAllBilliardTableImagesRoute = createRoute({
  method: "get",
  path: "/",
  tags,
  summary: "Get all billiard table images",
  security: protectedSecurity,
  responses: {
    200: jsonResponse(billiardTableImageListResponseSchema, "Billiard table images fetched successfully"),
    401: errorResponses[401],
    403: errorResponses[403],
    500: errorResponses[500],
  },
});

export const getBilliardTableImageByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags,
  summary: "Get billiard table image by id",
  security: protectedSecurity,
  request: {
    params: billiardTableImageIdParamsSchema,
  },
  responses: {
    200: jsonResponse(billiardTableImageDetailResponseSchema, "Billiard table image fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid billiard table image id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Billiard table image not found"),
    500: errorResponses[500],
  },
});

export const createBilliardTableImageRoute = createRoute({
  method: "post",
  path: "/",
  tags,
  summary: "Create billiard table image",
  security: protectedSecurity,
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createBilliardTableImageRequestSchema,
        },
      },
    },
  },
  responses: {
    201: jsonResponse(billiardTableImageMutationResponseSchema, "Billiard table image created successfully"),
    ...errorResponses,
  },
});

export const updateBilliardTableImageRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags,
  summary: "Update billiard table image",
  security: protectedSecurity,
  request: {
    params: billiardTableImageIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateBilliardTableImageRequestSchema,
        },
      },
    },
  },
  responses: {
    200: jsonResponse(billiardTableImageMutationResponseSchema, "Billiard table image updated successfully"),
    ...errorResponses,
    404: jsonResponse(apiErrorResponseSchema, "Billiard table image not found"),
  },
});

export const deleteBilliardTableImageRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags,
  summary: "Delete billiard table image",
  security: protectedSecurity,
  request: {
    params: billiardTableImageIdParamsSchema,
  },
  responses: {
    200: jsonResponse(billiardTableImageMutationResponseSchema, "Billiard table image deleted successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid billiard table image id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Billiard table image not found"),
    500: errorResponses[500],
  },
});
