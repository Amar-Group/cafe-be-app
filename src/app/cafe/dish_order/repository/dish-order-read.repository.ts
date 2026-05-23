import { eq } from "drizzle-orm";
import { db } from "../../../../db";
import { dish_orders } from "../../../../db/schema";

export class DishOrderReadRepository {
  static async getAll() {
    try {
      return await db.select().from(dish_orders);
    } catch (error) {
      throw new Error(`Failed to fetch dish orders: ${error}`);
    }
  }

  static async getById(id: number) {
    try {
      const result = await db
        .select()
        .from(dish_orders)
        .where(eq(dish_orders.id, id))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch dish order: ${error}`);
    }
  }
}
