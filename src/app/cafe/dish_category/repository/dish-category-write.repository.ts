import { eq } from "drizzle-orm";
import { db } from "../../../../db";
import { dish_categories } from "../../../../db/schema";
import {
  CreateDishCategoryRequestDto,
  UpdateDishCategoryRequestDto,
} from "../dto/dish-category-request.dto";

export class DishCategoryWriteRepository {
  static async create(data: CreateDishCategoryRequestDto) {
    try {
      return await db.insert(dish_categories).values(data);
    } catch (error) {
      throw new Error(`Failed to create dish category: ${error}`);
    }
  }

  static async update(id: number, data: UpdateDishCategoryRequestDto) {
    try {
      return await db
        .update(dish_categories)
        .set({
          ...data,
          updated_at: new Date(),
        })
        .where(eq(dish_categories.id, id));
    } catch (error) {
      throw new Error(`Failed to update dish category: ${error}`);
    }
  }

  static async delete(id: number) {
    try {
      return await db.delete(dish_categories).where(eq(dish_categories.id, id));
    } catch (error) {
      throw new Error(`Failed to delete dish category: ${error}`);
    }
  }
}
