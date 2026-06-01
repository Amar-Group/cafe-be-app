import { eq } from "drizzle-orm";
import { db, schedules } from "../../../../db";
import {
  CreateScheduleRequestDto,
  UpdateScheduleRequestDto,
} from "../dto/schedule-request.dto";

export class ScheduleWriteRepository {
  static async create(data: CreateScheduleRequestDto) {
    try {
      const [result] = await db.insert(schedules).values(data);
      return { id: result.insertId };
    } catch (error) {
      throw new Error(`Failed to create schedule: ${error}`);
    }
  }

  static async update(id: number, data: UpdateScheduleRequestDto) {
    try {
      const [result] = await db
        .update(schedules)
        .set({ ...data, updated_at: new Date() })
        .where(eq(schedules.id, id));

      return { id, affectedRows: result.affectedRows };
    } catch (error) {
      throw new Error(`Failed to update schedule: ${error}`);
    }
  }

  static async delete(id: number) {
    try {
      const [result] = await db.delete(schedules).where(eq(schedules.id, id));

      return { id, affectedRows: result.affectedRows };
    } catch (error) {
      throw new Error(`Failed to delete schedule: ${error}`);
    }
  }
}
