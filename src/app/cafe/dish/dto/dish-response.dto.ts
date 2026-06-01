import { z } from "@hono/zod-openapi";
import { DishEntity } from "../contract/dish.contract";
import { createSuccessEnvelopeSchema, writeResultSchema } from "../../../../docs/openapi-common";
import { dishSchema } from "../../../../docs/openapi-schemas";

export type DishResponseDto = DishEntity;

export const dishListResponseSchema = createSuccessEnvelopeSchema(
  "DishListResponse",
  z.array(dishSchema),
  "Dishes fetched successfully",
);

export const dishDetailResponseSchema = createSuccessEnvelopeSchema(
  "DishDetailResponse",
  dishSchema,
  "Dish fetched successfully",
);

export const dishMutationResponseSchema = createSuccessEnvelopeSchema(
  "DishMutationResponse",
  writeResultSchema,
  "Dish created successfully",
);
