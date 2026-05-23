import { eq } from "drizzle-orm";
import { db } from "../../../../db";
import { dish_orders } from "../../../../db/schema";
import {
  CreateDishOrderRequestDto,
  UpdateDishOrderRequestDto,
} from "../dto/dish-order-request.dto";

export class DishOrderWriteRepository {
  static async create(data: CreateDishOrderRequestDto) {
    try {
      return await db.insert(dish_orders).values(data);
    } catch (error) {
      throw new Error(`Failed to create dish order: ${error}`);
    }
  }

  static async update(id: number, data: UpdateDishOrderRequestDto) {
    try {
      return await db
        .update(dish_orders)
        .set({
          ...data,
          updated_at: new Date(),
        })
        .where(eq(dish_orders.id, id));
    } catch (error) {
      throw new Error(`Failed to update dish order: ${error}`);
    }
  }

  static async delete(id: number) {
    try {
      return await db.delete(dish_orders).where(eq(dish_orders.id, id));
    } catch (error) {
      throw new Error(`Failed to delete dish order: ${error}`);
    }
  }
}
