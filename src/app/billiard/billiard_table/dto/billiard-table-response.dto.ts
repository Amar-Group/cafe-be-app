import { z } from "@hono/zod-openapi";
import { BilliardTableEntity } from "../contract/billiard-table.contract";
import { createSuccessEnvelopeSchema, writeResultSchema } from "../../../../docs/openapi-common";
import { billiardTableSchema } from "../../../../docs/openapi-schemas";

export type BilliardTableResponseDto = BilliardTableEntity;

export const billiardTableListResponseSchema = createSuccessEnvelopeSchema(
  "BilliardTableListResponse",
  z.array(billiardTableSchema),
  "Billiard tables fetched successfully",
);

export const billiardTableDetailResponseSchema = createSuccessEnvelopeSchema(
  "BilliardTableDetailResponse",
  billiardTableSchema,
  "Billiard table fetched successfully",
);

export const billiardTableMutationResponseSchema = createSuccessEnvelopeSchema(
  "BilliardTableMutationResponse",
  writeResultSchema,
  "Billiard table created successfully",
);
