import { eq, desc } from "drizzle-orm";
import { db } from "../../../../db";
import { dish_orders, payments, dish_order_details, dishes } from "../../../../db/schema";

export class DishOrderReadRepository {
  static async getAll() {
    try {
      const results = await db
        .select({
          id: dish_orders.id,
          guest_name: dish_orders.guest_name,
          guest_phone: dish_orders.guest_phone,
          total: dish_orders.total,
          tax: dish_orders.tax,
          service_fee: dish_orders.service_fee,
          nett_price: dish_orders.nett_price,
          status: dish_orders.status,
          created_at: dish_orders.created_at,
          updated_at: dish_orders.updated_at,
          payment_status: payments.status,
          payment_method: payments.method,
        })
        .from(dish_orders)
        .leftJoin(payments, eq(dish_orders.id, payments.dish_order_id))
        .orderBy(desc(dish_orders.created_at));
        
      return results;
    } catch (error) {
      throw new Error(`Failed to fetch dish orders: ${error}`);
    }
  }

  static async getById(id: number) {
    try {
      const result = await db
        .select({
          id: dish_orders.id,
          guest_name: dish_orders.guest_name,
          guest_phone: dish_orders.guest_phone,
          total: dish_orders.total,
          tax: dish_orders.tax,
          service_fee: dish_orders.service_fee,
          nett_price: dish_orders.nett_price,
          status: dish_orders.status,
          created_at: dish_orders.created_at,
          updated_at: dish_orders.updated_at,
          payment_status: payments.status,
          payment_method: payments.method,
        })
        .from(dish_orders)
        .leftJoin(payments, eq(dish_orders.id, payments.dish_order_id))
        .where(eq(dish_orders.id, id))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch dish order: ${error}`);
    }
  }

  static async getOrderDetailsWithDish(dishOrderId: number) {
    try {
      const results = await db
        .select({
          id: dish_order_details.id,
          quantity: dish_order_details.quantity,
          dish_name: dishes.name,
        })
        .from(dish_order_details)
        .leftJoin(dishes, eq(dish_order_details.dish_id, dishes.id))
        .where(eq(dish_order_details.dish_order_id, dishOrderId));
        
      return results;
    } catch (error) {
      throw new Error(`Failed to fetch dish order details: ${error}`);
    }
  }
}
