import { z } from "@hono/zod-openapi";
import { DishCategoryEntity } from "../../../cafe/dish_category/contract/dish-category.contract";
import { createSuccessEnvelopeSchema } from "../../../../docs/openapi-common";
import { dishCategorySchema } from "../../../../docs/openapi-schemas";

export type PublicDishCategoryResponseDto = DishCategoryEntity;

export const publicDishCategoryListResponseSchema = createSuccessEnvelopeSchema(
  "PublicDishCategoryListResponse",
  z.array(dishCategorySchema),
  "Public dish categories fetched successfully",
);
