import { z } from "@hono/zod-openapi";

export const createScheduleRequestSchema = z
  .object({
    start_time: z.string().min(1).openapi({ example: "10:00:00" }),
    end_time: z.string().min(1).openapi({ example: "11:00:00" }),
  })
  .openapi("CreateScheduleRequest");

export const updateScheduleRequestSchema = z
  .object({
    start_time: z.string().min(1).optional().openapi({ example: "10:30:00" }),
    end_time: z.string().min(1).optional().openapi({ example: "11:30:00" }),
  })
  .openapi("UpdateScheduleRequest");

export type CreateScheduleRequestDto = z.infer<
  typeof createScheduleRequestSchema
>;
export type UpdateScheduleRequestDto = z.infer<
  typeof updateScheduleRequestSchema
>;
