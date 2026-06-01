import { z } from "@hono/zod-openapi";
import { BilliardTableTypeEntity } from "../../../billiard/billiard_table_type/contract/billiard-table-type.contract";
import { createSuccessEnvelopeSchema } from "../../../../docs/openapi-common";
import { billiardTableTypeSchema } from "../../../../docs/openapi-schemas";

export type PublicBilliardTableTypeResponseDto = BilliardTableTypeEntity;

export const PublicBilliardTableTypeListResponseSchema = createSuccessEnvelopeSchema(
  "PublicBilliardTableTypeListResponse",
  z.array(billiardTableTypeSchema),
  "Public billiard table types fetched successfully",
);
