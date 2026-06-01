import { z } from "@hono/zod-openapi";
import { BilliardTableEntity } from "../../../billiard/billiard_table/contract/billiard-table.contract";
import { createSuccessEnvelopeSchema } from "../../../../docs/openapi-common";
import { billiardTableSchema } from "../../../../docs/openapi-schemas";

export type PublicBilliardTableResponseDto = BilliardTableEntity;

export const PublicBilliardTableListResponseSchema = createSuccessEnvelopeSchema(
  "PublicBilliardTableListResponse",
  z.array(billiardTableSchema),
  "Public billiard tables fetched successfully"
);
