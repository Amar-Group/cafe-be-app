import { createRoute } from "@hono/zod-openapi";
import {
  apiErrorResponseSchema,
  createNumericPathParamsSchema,
  jsonResponse,
  protectedSecurity,
  errorResponses,
} from "../../../../docs/openapi-common";
import {
  createDishOrderRequestSchema,
  updateDishOrderRequestSchema,
} from "../dto/dish-order-request.dto";
import {
  dishOrderListResponseSchema,
  dishOrderDetailResponseSchema,
  dishOrderMutationResponseSchema,
} from "../dto/dish-order-response.dto";

const tags = ["Dish Orders"];
const dishOrderIdParamsSchema = createNumericPathParamsSchema("id");

export const getAllDishOrdersRoute = createRoute({
  method: "get",
  path: "/",
  tags,
  summary: "Get all dish orders",
  security: protectedSecurity,
  responses: {
    200: jsonResponse(dishOrderListResponseSchema, "Dish orders fetched successfully"),
    401: errorResponses[401],
    403: errorResponses[403],
    500: errorResponses[500],
  },
});

export const getDishOrderByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags,
  summary: "Get dish order by id",
  security: protectedSecurity,
  request: {
    params: dishOrderIdParamsSchema,
  },
  responses: {
    200: jsonResponse(dishOrderDetailResponseSchema, "Dish order fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid dish order id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Dish order not found"),
    500: errorResponses[500],
  },
});

export const createDishOrderRoute = createRoute({
  method: "post",
  path: "/",
  tags,
  summary: "Create dish order",
  security: protectedSecurity,
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createDishOrderRequestSchema,
        },
      },
    },
  },
  responses: {
    201: jsonResponse(dishOrderMutationResponseSchema, "Dish order created successfully"),
    ...errorResponses,
  },
});

export const updateDishOrderRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags,
  summary: "Update dish order",
  security: protectedSecurity,
  request: {
    params: dishOrderIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateDishOrderRequestSchema,
        },
      },
    },
  },
  responses: {
    200: jsonResponse(dishOrderMutationResponseSchema, "Dish order updated successfully"),
    ...errorResponses,
    404: jsonResponse(apiErrorResponseSchema, "Dish order not found"),
  },
});

export const deleteDishOrderRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags,
  summary: "Delete dish order",
  security: protectedSecurity,
  request: {
    params: dishOrderIdParamsSchema,
  },
  responses: {
    200: jsonResponse(dishOrderMutationResponseSchema, "Dish order deleted successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid dish order id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Dish order not found"),
    500: errorResponses[500],
  },
});
