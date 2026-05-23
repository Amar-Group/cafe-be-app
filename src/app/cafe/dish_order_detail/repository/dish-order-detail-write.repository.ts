import { eq } from "drizzle-orm";
import { db } from "../../../../db";
import { dish_order_details } from "../../../../db/schema";
import {
  CreateDishOrderDetailRequestDto,
  UpdateDishOrderDetailRequestDto,
} from "../dto/dish-order-detail-request.dto";

export class DishOrderDetailWriteRepository {
  static async create(data: CreateDishOrderDetailRequestDto) {
    try {
      return await db.insert(dish_order_details).values(data);
    } catch (error) {
      throw new Error(`Failed to create dish order detail: ${error}`);
    }
  }

  static async update(id: number, data: UpdateDishOrderDetailRequestDto) {
    try {
      return await db
        .update(dish_order_details)
        .set({
          ...data,
          updated_at: new Date(),
        })
        .where(eq(dish_order_details.id, id));
    } catch (error) {
      throw new Error(`Failed to update dish order detail: ${error}`);
    }
  }

  static async delete(id: number) {
    try {
      return await db.delete(dish_order_details).where(eq(dish_order_details.id, id));
    } catch (error) {
      throw new Error(`Failed to delete dish order detail: ${error}`);
    }
  }
}
