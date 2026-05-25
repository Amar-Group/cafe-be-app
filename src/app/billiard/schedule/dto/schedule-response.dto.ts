import { z } from "@hono/zod-openapi";
import {
  createSuccessEnvelopeSchema,
  writeResultSchema,
} from "../../../../docs/openapi-common";
import { scheduleSchema } from "../../../../docs/openapi-schemas";
import { ScheduleEntity } from "../contract/schedule.contract";

export type ScheduleResponseDto = ScheduleEntity;

export const scheduleListResponseSchema = createSuccessEnvelopeSchema(
  "ScheduleListResponse",
  z.array(scheduleSchema),
  "Schedules fetched successfully",
);

export const scheduleDetailResponseSchema = createSuccessEnvelopeSchema(
  "ScheduleDetailResponse",
  scheduleSchema,
  "Schedule fetched successfully",
);

export const scheduleMutationResponseSchema = createSuccessEnvelopeSchema(
  "ScheduleMutationResponse",
  writeResultSchema,
  "Schedule mutation successful",
);
