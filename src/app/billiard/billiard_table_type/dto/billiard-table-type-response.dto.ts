import { z } from "@hono/zod-openapi";
import { BilliardTableTypeEntity } from "../contract/billiard-table-type.contract";
import { createSuccessEnvelopeSchema, writeResultSchema } from "../../../../docs/openapi-common";
import { billiardTableTypeSchema } from "../../../../docs/openapi-schemas";

export type BilliardTableTypeResponseDto = BilliardTableTypeEntity;

export const billiardTableTypeListResponseSchema = createSuccessEnvelopeSchema(
  "BilliardTableTypeListResponse",
  z.array(billiardTableTypeSchema),
  "Billiard table types fetched successfully",
);

export const billiardTableTypeDetailResponseSchema = createSuccessEnvelopeSchema(
  "BilliardTableTypeDetailResponse",
  billiardTableTypeSchema,
  "Billiard table type fetched successfully",
);

export const billiardTableTypeMutationResponseSchema = createSuccessEnvelopeSchema(
  "BilliardTableTypeMutationResponse",
  writeResultSchema,
  "Billiard table type created successfully",
);
