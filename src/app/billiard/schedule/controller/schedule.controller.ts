import { Context } from "hono";
import {
  CreateScheduleRequestDto,
  UpdateScheduleRequestDto,
} from "../dto/schedule-request.dto";
import { ScheduleService } from "../service/schedule.service";

export class ScheduleController {
  static async getAll(c: Context) {
    const schedules = await ScheduleService.getAll();

    return c.json({
      success: true,
      data: schedules,
      message: "Schedules fetched successfully",
    });
  }

  static async getById(c: Context) {
    const id = Number(c.req.param("id"));
    const schedule = await ScheduleService.getById(id);

    if (!schedule) {
      return c.json({ success: false, message: "Schedule not found" }, 404);
    }

    return c.json({
      success: true,
      data: schedule,
      message: "Schedule fetched successfully",
    });
  }

  static async create(c: Context) {
    const body: CreateScheduleRequestDto = await c.req.json();
    const result = await ScheduleService.create(body);

    return c.json(
      {
        success: true,
        data: result,
        message: "Schedule created successfully",
      },
      201,
    );
  }

  static async update(c: Context) {
    const id = Number(c.req.param("id"));
    const body: UpdateScheduleRequestDto = await c.req.json();
    const updateResult = await ScheduleService.update(id, body);

    if (!updateResult) {
      return c.json({ success: false, message: "Schedule not found" }, 404);
    }

    return c.json({
      success: true,
      data: updateResult.result,
      message: "Schedule updated successfully",
    });
  }

  static async delete(c: Context) {
    const id = Number(c.req.param("id"));
    const deleteResult = await ScheduleService.delete(id);

    if (!deleteResult) {
      return c.json({ success: false, message: "Schedule not found" }, 404);
    }

    return c.json({
      success: true,
      data: deleteResult.result,
      message: "Schedule deleted successfully",
    });
  }
}
