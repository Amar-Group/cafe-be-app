import { z } from "@hono/zod-openapi";
import { DishEntity } from "../../../cafe/dish/contract/dish.contract";
import { createSuccessEnvelopeSchema } from "../../../../docs/openapi-common";
import { dishSchema } from "../../../../docs/openapi-schemas";

export type PublicDishResponseDto = DishEntity;

export const publicDishListResponseSchema = createSuccessEnvelopeSchema(
  "PublicDishListResponse",
  z.array(dishSchema),
  "Public dishes fetched successfully",
);