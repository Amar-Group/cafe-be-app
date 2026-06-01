import { eq } from "drizzle-orm";
import { db } from "../../../../db";
import { dish_images } from "../../../../db/schema";

export class DishImageReadRepository {
  static async getAll() {
    try {
      return await db.select().from(dish_images);
    } catch (error) {
      throw new Error(`Failed to fetch dish images: ${error}`);
    }
  }

  static async getById(id: number) {
    try {
      const result = await db
        .select()
        .from(dish_images)
        .where(eq(dish_images.id, id))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch dish image: ${error}`);
    }
  }

  static async getByDishId(dishId: number) {
    try {
      return await db
        .select()
        .from(dish_images)
        .where(eq(dish_images.dish_id, dishId));
    } catch (error) {
      throw new Error(`Failed to fetch dish images: ${error}`);
    }
  }
}
