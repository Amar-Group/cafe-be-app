import { z } from "@hono/zod-openapi";
import { BilliardTableImageEntity } from "../contract/billiard-table-image.contract";
import { createSuccessEnvelopeSchema, writeResultSchema } from "../../../../docs/openapi-common";
import { billiardTableImageSchema } from "../../../../docs/openapi-schemas";

export type BilliardTableImageResponseDto = BilliardTableImageEntity;

export const billiardTableImageListResponseSchema = createSuccessEnvelopeSchema(
  "BilliardTableImageListResponse",
  z.array(billiardTableImageSchema),
  "Billiard table images fetched successfully",
);

export const billiardTableImageDetailResponseSchema = createSuccessEnvelopeSchema(
  "BilliardTableImageDetailResponse",
  billiardTableImageSchema,
  "Billiard table image fetched successfully",
);

export const billiardTableImageMutationResponseSchema = createSuccessEnvelopeSchema(
  "BilliardTableImageMutationResponse",
  writeResultSchema,
  "Billiard table image created successfully",
);
