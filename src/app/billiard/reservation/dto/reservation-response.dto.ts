import { z } from "@hono/zod-openapi";
import { ReservationEntity } from "../contract/reservation.contract";
import { createSuccessEnvelopeSchema, writeResultSchema } from "../../../../docs/openapi-common";
import { reservationSchema } from "../../../../docs/openapi-schemas";

export type ReservationResponseDto = ReservationEntity;

export const reservationListResponseSchema = createSuccessEnvelopeSchema(
  "ReservationListResponse",
  z.array(reservationSchema),
  "Reservations fetched successfully",
);

export const reservationDetailResponseSchema = createSuccessEnvelopeSchema(
  "ReservationDetailResponse",
  reservationSchema,
  "Reservation fetched successfully",
);

export const reservationMutationResponseSchema = createSuccessEnvelopeSchema(
  "ReservationMutationResponse",
  writeResultSchema,
  "Reservation created successfully",
);
