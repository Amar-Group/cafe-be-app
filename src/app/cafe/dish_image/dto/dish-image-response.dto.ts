import { z } from "@hono/zod-openapi";
import { DishImageEntity } from "../contract/dish-image.contract";
import { createSuccessEnvelopeSchema, writeResultSchema } from "../../../../docs/openapi-common";
import { dishImageSchema } from "../../../../docs/openapi-schemas";

export type DishImageResponseDto = DishImageEntity;

export const dishImageListResponseSchema = createSuccessEnvelopeSchema(
  "DishImageListResponse",
  z.array(dishImageSchema),
  "Dish images fetched successfully",
);

export const dishImageDetailResponseSchema = createSuccessEnvelopeSchema(
  "DishImageDetailResponse",
  dishImageSchema,
  "Dish image fetched successfully",
);

export const dishImageMutationResponseSchema = createSuccessEnvelopeSchema(
  "DishImageMutationResponse",
  writeResultSchema,
  "Dish image created successfully",
);
