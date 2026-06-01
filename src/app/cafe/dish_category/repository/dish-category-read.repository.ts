import { eq } from "drizzle-orm";
import { db } from "../../../../db";
import { dish_categories } from "../../../../db/schema";

export class DishCategoryReadRepository {
  static async getAll() {
    try {
      return await db.select().from(dish_categories);
    } catch (error) {
      throw new Error(`Failed to fetch dish categories: ${error}`);
    }
  }

  static async getById(id: number) {
    try {
      const result = await db
        .select()
        .from(dish_categories)
        .where(eq(dish_categories.id, id))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch dish category: ${error}`);
    }
  }
}
