import { createRoute } from "@hono/zod-openapi";
import {
  apiErrorResponseSchema,
  createNumericPathParamsSchema,
  jsonResponse,
  protectedSecurity,
  errorResponses,
} from "../../../../docs/openapi-common";
import {
  createDishOrderDetailRequestSchema,
  updateDishOrderDetailRequestSchema,
} from "../dto/dish-order-detail-request.dto";
import {
  dishOrderDetailListResponseSchema,
  dishOrderDetailDetailResponseSchema,
  dishOrderDetailMutationResponseSchema,
} from "../dto/dish-order-detail-response.dto";

const tags = ["Dish Order Details"];
const dishOrderDetailIdParamsSchema = createNumericPathParamsSchema("id");

export const getAllDishOrderDetailsRoute = createRoute({
  method: "get",
  path: "/",
  tags,
  summary: "Get all dish order details",
  security: protectedSecurity,
  responses: {
    200: jsonResponse(dishOrderDetailListResponseSchema, "Dish order details fetched successfully"),
    401: errorResponses[401],
    403: errorResponses[403],
    500: errorResponses[500],
  },
});

export const getDishOrderDetailByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags,
  summary: "Get dish order detail by id",
  security: protectedSecurity,
  request: {
    params: dishOrderDetailIdParamsSchema,
  },
  responses: {
    200: jsonResponse(dishOrderDetailDetailResponseSchema, "Dish order detail fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid dish order detail id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Dish order detail not found"),
    500: errorResponses[500],
  },
});

export const createDishOrderDetailRoute = createRoute({
  method: "post",
  path: "/",
  tags,
  summary: "Create dish order detail",
  security: protectedSecurity,
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createDishOrderDetailRequestSchema,
        },
      },
    },
  },
  responses: {
    201: jsonResponse(dishOrderDetailMutationResponseSchema, "Dish order detail created successfully"),
    ...errorResponses,
  },
});

export const updateDishOrderDetailRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags,
  summary: "Update dish order detail",
  security: protectedSecurity,
  request: {
    params: dishOrderDetailIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateDishOrderDetailRequestSchema,
        },
      },
    },
  },
  responses: {
    200: jsonResponse(dishOrderDetailMutationResponseSchema, "Dish order detail updated successfully"),
    ...errorResponses,
    404: jsonResponse(apiErrorResponseSchema, "Dish order detail not found"),
  },
});

export const deleteDishOrderDetailRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags,
  summary: "Delete dish order detail",
  security: protectedSecurity,
  request: {
    params: dishOrderDetailIdParamsSchema,
  },
  responses: {
    200: jsonResponse(dishOrderDetailMutationResponseSchema, "Dish order detail deleted successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid dish order detail id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Dish order detail not found"),
    500: errorResponses[500],
  },
});
