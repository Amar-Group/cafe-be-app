import { createRoute } from "@hono/zod-openapi";
import {
  apiErrorResponseSchema,
  createNumericPathParamsSchema,
  jsonResponse,
  protectedSecurity,
  errorResponses,
} from "../../../../docs/openapi-common";
import {
  createDishRequestSchema,
  updateDishRequestSchema,
} from "../dto/dish-request.dto";
import {
  dishListResponseSchema,
  dishDetailResponseSchema,
  dishMutationResponseSchema,
} from "../dto/dish-response.dto";

const tags = ["Dishes"];
const dishIdParamsSchema = createNumericPathParamsSchema("id");

export const getAllDishesRoute = createRoute({
  method: "get",
  path: "/",
  tags,
  summary: "Get all dishes",
  security: protectedSecurity,
  responses: {
    200: jsonResponse(dishListResponseSchema, "Dishes fetched successfully"),
    401: errorResponses[401],
    403: errorResponses[403],
    500: errorResponses[500],
  },
});

export const getDishByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags,
  summary: "Get dish by id",
  security: protectedSecurity,
  request: {
    params: dishIdParamsSchema,
  },
  responses: {
    200: jsonResponse(dishDetailResponseSchema, "Dish fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid dish id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Dish not found"),
    500: errorResponses[500],
  },
});

export const createDishRoute = createRoute({
  method: "post",
  path: "/",
  tags,
  summary: "Create dish",
  security: protectedSecurity,
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createDishRequestSchema,
        },
      },
    },
  },
  responses: {
    201: jsonResponse(dishMutationResponseSchema, "Dish created successfully"),
    ...errorResponses,
  },
});

export const updateDishRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags,
  summary: "Update dish",
  security: protectedSecurity,
  request: {
    params: dishIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateDishRequestSchema,
        },
      },
    },
  },
  responses: {
    200: jsonResponse(dishMutationResponseSchema, "Dish updated successfully"),
    ...errorResponses,
    404: jsonResponse(apiErrorResponseSchema, "Dish not found"),
  },
});

export const deleteDishRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags,
  summary: "Delete dish",
  security: protectedSecurity,
  request: {
    params: dishIdParamsSchema,
  },
  responses: {
    200: jsonResponse(dishMutationResponseSchema, "Dish deleted successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid dish id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Dish not found"),
    500: errorResponses[500],
  },
});
