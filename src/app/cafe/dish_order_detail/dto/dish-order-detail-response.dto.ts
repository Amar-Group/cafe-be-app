import { z } from "@hono/zod-openapi";
import { DishOrderDetailEntity } from "../contract/dish-order-detail.contract";
import { createSuccessEnvelopeSchema, writeResultSchema } from "../../../../docs/openapi-common";
import { dishOrderDetailSchema } from "../../../../docs/openapi-schemas";

export type DishOrderDetailResponseDto = DishOrderDetailEntity;

export const dishOrderDetailListResponseSchema = createSuccessEnvelopeSchema(
  "DishOrderDetailListResponse",
  z.array(dishOrderDetailSchema),
  "Dish order details fetched successfully",
);

export const dishOrderDetailDetailResponseSchema = createSuccessEnvelopeSchema(
  "DishOrderDetailDetailResponse",
  dishOrderDetailSchema,
  "Dish order detail fetched successfully",
);

export const dishOrderDetailMutationResponseSchema = createSuccessEnvelopeSchema(
  "DishOrderDetailMutationResponse",
  writeResultSchema,
  "Dish order detail created successfully",
);
