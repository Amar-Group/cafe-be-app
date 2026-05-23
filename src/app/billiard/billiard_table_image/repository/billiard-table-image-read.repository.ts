import { eq } from "drizzle-orm";
import { db } from "../../../../db";
import { billiard_table_images } from "../../../../db/schema";

export class BilliardTableImageReadRepository {
  static async getAll() {
    try {
      return await db.select().from(billiard_table_images);
    } catch (error) {
      throw new Error(`Failed to fetch billiard table images: ${error}`);
    }
  }

  static async getById(id: number) {
    try {
      const result = await db
        .select()
        .from(billiard_table_images)
        .where(eq(billiard_table_images.id, id))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch billiard table image: ${error}`);
    }
  }

  static async getByTableId(tableId: number) {
    try {
      return await db
        .select()
        .from(billiard_table_images)
        .where(eq(billiard_table_images.billiard_table_id, tableId));
    } catch (error) {
      throw new Error(`Failed to fetch billiard table images: ${error}`);
    }
  }
}
