import { createRoute } from "@hono/zod-openapi";
import {
  apiErrorResponseSchema,
  createNumericPathParamsSchema,
  jsonResponse,
  protectedSecurity,
  errorResponses,
} from "../../../../docs/openapi-common";
import {
  createDishCategoryRequestSchema,
  updateDishCategoryRequestSchema,
} from "../dto/dish-category-request.dto";
import {
  dishCategoryListResponseSchema,
  dishCategoryDetailResponseSchema,
  dishCategoryMutationResponseSchema,
} from "../dto/dish-category-response.dto";

const tags = ["Dish Categories"];
const dishCategoryIdParamsSchema = createNumericPathParamsSchema("id");

export const getAllDishCategoriesRoute = createRoute({
  method: "get",
  path: "/",
  tags,
  summary: "Get all dish categories",
  security: protectedSecurity,
  responses: {
    200: jsonResponse(dishCategoryListResponseSchema, "Dish categories fetched successfully"),
    401: errorResponses[401],
    403: errorResponses[403],
    500: errorResponses[500],
  },
});

export const getDishCategoryByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags,
  summary: "Get dish category by id",
  security: protectedSecurity,
  request: {
    params: dishCategoryIdParamsSchema,
  },
  responses: {
    200: jsonResponse(dishCategoryDetailResponseSchema, "Dish category fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid dish category id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Dish category not found"),
    500: errorResponses[500],
  },
});

export const createDishCategoryRoute = createRoute({
  method: "post",
  path: "/",
  tags,
  summary: "Create dish category",
  security: protectedSecurity,
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createDishCategoryRequestSchema,
        },
      },
    },
  },
  responses: {
    201: jsonResponse(dishCategoryMutationResponseSchema, "Dish category created successfully"),
    ...errorResponses,
  },
});

export const updateDishCategoryRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags,
  summary: "Update dish category",
  security: protectedSecurity,
  request: {
    params: dishCategoryIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateDishCategoryRequestSchema,
        },
      },
    },
  },
  responses: {
    200: jsonResponse(dishCategoryMutationResponseSchema, "Dish category updated successfully"),
    ...errorResponses,
    404: jsonResponse(apiErrorResponseSchema, "Dish category not found"),
  },
});

export const deleteDishCategoryRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags,
  summary: "Delete dish category",
  security: protectedSecurity,
  request: {
    params: dishCategoryIdParamsSchema,
  },
  responses: {
    200: jsonResponse(dishCategoryMutationResponseSchema, "Dish category deleted successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid dish category id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Dish category not found"),
    500: errorResponses[500],
  },
});
