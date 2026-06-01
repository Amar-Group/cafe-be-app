import type { Context } from "hono";
import { PublicScheduleService } from "./public-schedule.service";

export class PublicScheduleController {
  static async getPublic(c: Context) {
    const tableSchedules = await PublicScheduleService.getAll();

    return c.json({
      success: true,
      data: tableSchedules,
      message: "Public billiard schedules fetched successfully",
    });
  }
}
