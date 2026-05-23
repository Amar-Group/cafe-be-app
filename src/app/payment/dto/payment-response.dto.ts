import { z } from "@hono/zod-openapi";
import { PaymentEntity } from "../contract/payment.contract";
import { createSuccessEnvelopeSchema, writeResultSchema } from "../../../docs/openapi-common";
import { paymentSchema } from "../../../docs/openapi-schemas";
export type PaymentResponseDto = PaymentEntity;

export const paymentListResponseSchema = createSuccessEnvelopeSchema(
  "PaymentListResponse",
  z.array(paymentSchema),
  "Payments fetched successfully",
);

export const paymentDetailResponseSchema = createSuccessEnvelopeSchema(
  "PaymentDetailResponse",
  paymentSchema,
  "Payment fetched successfully",
);

export const paymentMutationResponseSchema = createSuccessEnvelopeSchema(
  "PaymentMutationResponse",
  writeResultSchema,
  "Payment created successfully",
);
