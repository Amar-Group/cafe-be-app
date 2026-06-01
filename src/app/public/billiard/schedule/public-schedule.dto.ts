import { z } from "@hono/zod-openapi";
import { ScheduleEntity } from "../../../billiard/schedule/contract/schedule.contract";
import { createSuccessEnvelopeSchema } from "../../../../docs/openapi-common";
import { scheduleSchema } from "../../../../docs/openapi-schemas";

export type PublicScheduleResponseDto = ScheduleEntity;

export const PublicScheduleListResponseSchema = createSuccessEnvelopeSchema(
  "PublicScheduleListResponse",
  z.array(scheduleSchema),
  "Public schedules fetched successfully",
);
