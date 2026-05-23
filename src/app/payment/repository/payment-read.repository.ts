import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { payments, dish_orders, reservations } from "../../../db/schema";

export class PaymentReadRepository {
  static async getAll() {
    try {
      return await db
        .select({
          id: payments.id,
          type: payments.type,
          dish_order_id: payments.dish_order_id,
          reservation_id: payments.reservation_id,
          method: payments.method,
          provider: payments.provider,
          transaction_id: payments.transaction_id,
          gross_amount: payments.gross_amount,
          status: payments.status,
          url: payments.url,
          snap_token: payments.snap_token,
          paid_at: payments.paid_at,
          expired_at: payments.expired_at,
          created_at: payments.created_at,
          updated_at: payments.updated_at,
          dish_order: {
            id: dish_orders.id,
            guest_name: dish_orders.guest_name,
            guest_phone: dish_orders.guest_phone,
            nett_price: dish_orders.nett_price,
          },
          reservation: {
            id: reservations.id,
            guest_name: reservations.guest_name,
            guest_phone: reservations.guest_phone,
            date: reservations.date,
            start_time: reservations.start_time,
            end_time: reservations.end_time,
          },
        })
        .from(payments)
        .leftJoin(dish_orders, eq(payments.dish_order_id, dish_orders.id))
        .leftJoin(reservations, eq(payments.reservation_id, reservations.id));
    } catch (error) {
      throw new Error(`Failed to fetch payments: ${error}`);
    }
  }

  static async getById(id: number) {
    try {
      const result = await db
        .select({
          id: payments.id,
          type: payments.type,
          dish_order_id: payments.dish_order_id,
          reservation_id: payments.reservation_id,
          method: payments.method,
          provider: payments.provider,
          transaction_id: payments.transaction_id,
          gross_amount: payments.gross_amount,
          status: payments.status,
          url: payments.url,
          snap_token: payments.snap_token,
          paid_at: payments.paid_at,
          expired_at: payments.expired_at,
          created_at: payments.created_at,
          updated_at: payments.updated_at,
          dish_order: {
            id: dish_orders.id,
            guest_name: dish_orders.guest_name,
            guest_phone: dish_orders.guest_phone,
            nett_price: dish_orders.nett_price,
          },
          reservation: {
            id: reservations.id,
            guest_name: reservations.guest_name,
            guest_phone: reservations.guest_phone,
            date: reservations.date,
            start_time: reservations.start_time,
            end_time: reservations.end_time,
          },
        })
        .from(payments)
        .leftJoin(dish_orders, eq(payments.dish_order_id, dish_orders.id))
        .leftJoin(reservations, eq(payments.reservation_id, reservations.id))
        .where(eq(payments.id, id))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch payment: ${error}`);
    }
  }
}
