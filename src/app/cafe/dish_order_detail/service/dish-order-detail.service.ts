import {
  CreateDishOrderDetailRequestDto,
  UpdateDishOrderDetailRequestDto,
} from "../dto/dish-order-detail-request.dto";
import { DishOrderDetailReadRepository } from "../repository/dish-order-detail-read.repository";
import { DishOrderDetailWriteRepository } from "../repository/dish-order-detail-write.repository";
import { DishOrderWriteRepository } from "../../dish_order/repository/dish-order-write.repository";
import { db } from "../../../../db";
import { dish_order_details, dishes } from "../../../../db/schema";
import { eq } from "drizzle-orm";

export class DishOrderDetailService {
  static async getAll() {
    return DishOrderDetailReadRepository.getAll();
  }

  static async getById(id: number) {
    return DishOrderDetailReadRepository.getById(id);
  }

  static async recalculateOrderTotals(dishOrderId: number) {
    try {
      // Fetch all details for the order
      const details = await db
        .select({
          quantity: dish_order_details.quantity,
          price: dishes.price,
        })
        .from(dish_order_details)
        .leftJoin(dishes, eq(dish_order_details.dish_id, dishes.id))
        .where(eq(dish_order_details.dish_order_id, dishOrderId));

      let total = 0;
      for (const item of details) {
        if (item.price && item.quantity) {
          total += Number(item.price) * item.quantity;
        }
      }

      const tax = total * 0.11;
      const serviceFee = total * 0.05;
      const nettPrice = total + tax + serviceFee;

      await DishOrderWriteRepository.update(dishOrderId, {
        total: total.toFixed(2),
        tax: tax.toFixed(2),
        service_fee: serviceFee.toFixed(2),
        nett_price: nettPrice.toFixed(2),
      });
    } catch (error) {
      console.error("Failed to recalculate order totals:", error);
    }
  }

  static async create(payload: CreateDishOrderDetailRequestDto) {
    const result = await DishOrderDetailWriteRepository.create(payload);
    await this.recalculateOrderTotals(payload.dish_order_id);
    return result;
  }

  static async update(id: number, payload: UpdateDishOrderDetailRequestDto) {
    const detail = await DishOrderDetailReadRepository.getById(id);

    if (!detail) {
      return null;
    }

    const result = await DishOrderDetailWriteRepository.update(id, payload);
    await this.recalculateOrderTotals(detail.dish_order_id);
    return { detail, result };
  }

  static async delete(id: number) {
    const detail = await DishOrderDetailReadRepository.getById(id);

    if (!detail) {
      return null;
    }

    const result = await DishOrderDetailWriteRepository.delete(id);
    await this.recalculateOrderTotals(detail.dish_order_id);
    return { detail, result };
  }
}
