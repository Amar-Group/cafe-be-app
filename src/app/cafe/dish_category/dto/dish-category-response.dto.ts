import { z } from "@hono/zod-openapi";
import { DishCategoryEntity } from "../contract/dish-category.contract";
import { createSuccessEnvelopeSchema, writeResultSchema } from "../../../../docs/openapi-common";
import { dishCategorySchema } from "../../../../docs/openapi-schemas";

export type DishCategoryResponseDto = DishCategoryEntity;

export const dishCategoryListResponseSchema = createSuccessEnvelopeSchema(
  "DishCategoryListResponse",
  z.array(dishCategorySchema),
  "Dish categories fetched successfully",
);

export const dishCategoryDetailResponseSchema = createSuccessEnvelopeSchema(
  "DishCategoryDetailResponse",
  dishCategorySchema,
  "Dish category fetched successfully",
);

export const dishCategoryMutationResponseSchema = createSuccessEnvelopeSchema(
  "DishCategoryMutationResponse",
  writeResultSchema,
  "Dish category created successfully",
);
