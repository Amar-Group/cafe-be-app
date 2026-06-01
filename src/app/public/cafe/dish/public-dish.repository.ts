import { eq } from "drizzle-orm";
import { db, dish_categories, dishes } from "../../../../db";

export class PublicDishRepository {
  static async getAll() {
    try {
      return await db
        .select({
          id: dishes.id,
          dish_category_id: dishes.dish_category_id,
          name: dishes.name,
          slug: dishes.slug,
          description: dishes.description,
          price: dishes.price,
          thumbnail: dishes.thumbnail,
          thumbnail_public_id: dishes.thumbnail_public_id,
          is_available: dishes.is_available,
          is_active: dishes.is_active,
          created_at: dishes.created_at,
          updated_at: dishes.updated_at,
          category: {
            id: dish_categories.id,
            name: dish_categories.name,
            icon: dish_categories.icon,
          },
        })
        .from(dishes)
        .leftJoin(dish_categories, eq(dishes.dish_category_id, dish_categories.id))
        .where(eq(dishes.is_active, true));
    } catch (error) {
      throw new Error(`Failed to fetch public dishes: ${error}`);
    }
  }
}
