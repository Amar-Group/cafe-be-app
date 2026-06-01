import { db, schedules } from "../../../../db";

export class PublicScheduleRepository {
  static async getAll() {
    try {
      return await db.select().from(schedules);
    } catch (error) {
      throw new Error(`Failed to fetch public schedules: ${error}`);
    }
  }
}
