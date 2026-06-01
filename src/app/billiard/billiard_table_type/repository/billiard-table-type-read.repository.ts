import { eq } from "drizzle-orm";
import { db } from "../../../../db";
import { billiard_table_types } from "../../../../db/schema";

export class BilliardTableTypeReadRepository {
  static async getAll() {
    try {
      return await db.select().from(billiard_table_types);
    } catch (error) {
      throw new Error(`Failed to fetch billiard table types: ${error}`);
    }
  }

  static async getById(id: number) {
    try {
      const result = await db
        .select()
        .from(billiard_table_types)
        .where(eq(billiard_table_types.id, id))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch billiard table type: ${error}`);
    }
  }
}
