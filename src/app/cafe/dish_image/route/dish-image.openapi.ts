import { createRoute } from "@hono/zod-openapi";
import {
  apiErrorResponseSchema,
  createNumericPathParamsSchema,
  jsonResponse,
  protectedSecurity,
  errorResponses,
} from "../../../../docs/openapi-common";
import {
  createDishImageRequestSchema,
  updateDishImageRequestSchema,
} from "../dto/dish-image-request.dto";
import {
  dishImageListResponseSchema,
  dishImageDetailResponseSchema,
  dishImageMutationResponseSchema,
} from "../dto/dish-image-response.dto";

const tags = ["Dish Images"];
const dishImageIdParamsSchema = createNumericPathParamsSchema("id");

export const getAllDishImagesRoute = createRoute({
  method: "get",
  path: "/",
  tags,
  summary: "Get all dish images",
  security: protectedSecurity,
  responses: {
    200: jsonResponse(dishImageListResponseSchema, "Dish images fetched successfully"),
    401: errorResponses[401],
    403: errorResponses[403],
    500: errorResponses[500],
  },
});

export const getDishImageByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags,
  summary: "Get dish image by id",
  security: protectedSecurity,
  request: {
    params: dishImageIdParamsSchema,
  },
  responses: {
    200: jsonResponse(dishImageDetailResponseSchema, "Dish image fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid dish image id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Dish image not found"),
    500: errorResponses[500],
  },
});

export const createDishImageRoute = createRoute({
  method: "post",
  path: "/",
  tags,
  summary: "Create dish image",
  security: protectedSecurity,
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createDishImageRequestSchema,
        },
      },
    },
  },
  responses: {
    201: jsonResponse(dishImageMutationResponseSchema, "Dish image created successfully"),
    ...errorResponses,
  },
});

export const updateDishImageRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags,
  summary: "Update dish image",
  security: protectedSecurity,
  request: {
    params: dishImageIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateDishImageRequestSchema,
        },
      },
    },
  },
  responses: {
    200: jsonResponse(dishImageMutationResponseSchema, "Dish image updated successfully"),
    ...errorResponses,
    404: jsonResponse(apiErrorResponseSchema, "Dish image not found"),
  },
});

export const deleteDishImageRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags,
  summary: "Delete dish image",
  security: protectedSecurity,
  request: {
    params: dishImageIdParamsSchema,
  },
  responses: {
    200: jsonResponse(dishImageMutationResponseSchema, "Dish image deleted successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid dish image id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Dish image not found"),
    500: errorResponses[500],
  },
});
