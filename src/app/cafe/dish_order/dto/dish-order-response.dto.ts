import { z } from "@hono/zod-openapi";
import { DishOrderEntity } from "../contract/dish-order.contract";
import { createSuccessEnvelopeSchema, writeResultSchema } from "../../../../docs/openapi-common";
import { dishOrderSchema } from "../../../../docs/openapi-schemas";

export type DishOrderResponseDto = DishOrderEntity;

export const dishOrderListResponseSchema = createSuccessEnvelopeSchema(
  "DishOrderListResponse",
  z.array(dishOrderSchema),
  "Dish orders fetched successfully",
);

export const dishOrderDetailResponseSchema = createSuccessEnvelopeSchema(
  "DishOrderDetailResponse",
  dishOrderSchema,
  "Dish order fetched successfully",
);

export const dishOrderMutationResponseSchema = createSuccessEnvelopeSchema(
  "DishOrderMutationResponse",
  writeResultSchema,
  "Dish order created successfully",
);
