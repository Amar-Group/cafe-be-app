import { db, dish_categories } from "../../../../db";


export class PublicDishCategoryRepository {
  static async getAll() {
    try {
      // In a real scenario, you might only return active categories here.
      // Assuming dish_categories doesn't have is_active, we return all.
      return await db.select().from(dish_categories);
    } catch (error) {
      throw new Error(`Failed to fetch public dish categories: ${error}`);
    }
  }
}
