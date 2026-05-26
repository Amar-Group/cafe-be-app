import { eq } from "drizzle-orm";
import { db } from "../../../../db";
import { dish_order_details, dishes } from "../../../../db/schema";

export class DishOrderDetailReadRepository {
  static async getAll() {
    try {
      return await db
        .select({
          id: dish_order_details.id,
          dish_order_id: dish_order_details.dish_order_id,
          dish_id: dish_order_details.dish_id,
          quantity: dish_order_details.quantity,
          notes: dish_order_details.notes,
          created_at: dish_order_details.created_at,
          updated_at: dish_order_details.updated_at,
          dish: {
            id: dishes.id,
            name: dishes.name,
            slug: dishes.slug,
            price: dishes.price,
            thumbnail: dishes.thumbnail,
          },
        })
        .from(dish_order_details)
        .leftJoin(dishes, eq(dish_order_details.dish_id, dishes.id));
    } catch (error) {
      throw new Error(`Failed to fetch dish order details: ${error}`);
    }
  }

  static async getById(id: number) {
    try {
      const result = await db
        .select({
          id: dish_order_details.id,
          dish_order_id: dish_order_details.dish_order_id,
          dish_id: dish_order_details.dish_id,
          quantity: dish_order_details.quantity,
          notes: dish_order_details.notes,
          created_at: dish_order_details.created_at,
          updated_at: dish_order_details.updated_at,
          dish: {
            id: dishes.id,
            name: dishes.name,
            slug: dishes.slug,
            price: dishes.price,
            thumbnail: dishes.thumbnail,
          },
        })
        .from(dish_order_details)
        .leftJoin(dishes, eq(dish_order_details.dish_id, dishes.id))
        .where(eq(dish_order_details.id, id))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch dish order detail: ${error}`);
    }
  }

  static async getByOrderId(orderId: number) {
    try {
      return await db
        .select({
          id: dish_order_details.id,
          dish_order_id: dish_order_details.dish_order_id,
          dish_id: dish_order_details.dish_id,
          quantity: dish_order_details.quantity,
          notes: dish_order_details.notes,
          created_at: dish_order_details.created_at,
          updated_at: dish_order_details.updated_at,
          dish: {
            id: dishes.id,
            name: dishes.name,
            slug: dishes.slug,
            price: dishes.price,
            thumbnail: dishes.thumbnail,
          },
        })
        .from(dish_order_details)
        .leftJoin(dishes, eq(dish_order_details.dish_id, dishes.id))
        .where(eq(dish_order_details.dish_order_id, orderId));
    } catch (error) {
      throw new Error(`Failed to fetch dish order details: ${error}`);
    }
  }
}
