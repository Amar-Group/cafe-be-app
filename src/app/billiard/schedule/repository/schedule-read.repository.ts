import { eq } from "drizzle-orm";
import { db, schedules } from "../../../../db";

export class ScheduleReadRepository {
  static async getAll() {
    try {
      const results = await db.select().from(schedules);
      return results;
    } catch (error) {
      throw new Error(`Failed to fetch schedules: ${error}`);
    }
  }

  static async getById(id: number) {
    try {
      const result = await db
        .select()
        .from(schedules)
        .where(eq(schedules.id, id))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch schedule by id: ${error}`);
    }
  }
}
