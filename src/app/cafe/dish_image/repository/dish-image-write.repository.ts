import { eq } from "drizzle-orm";
import { db } from "../../../../db";
import { dish_images } from "../../../../db/schema";
import {
  CreateDishImageRequestDto,
  UpdateDishImageRequestDto,
} from "../dto/dish-image-request.dto";

export class DishImageWriteRepository {
  static async create(data: CreateDishImageRequestDto) {
    try {
      return await db.insert(dish_images).values(data);
    } catch (error) {
      throw new Error(`Failed to create dish image: ${error}`);
    }
  }

  static async update(id: number, data: UpdateDishImageRequestDto) {
    try {
      return await db
        .update(dish_images)
        .set({
          ...data,
          updated_at: new Date(),
        })
        .where(eq(dish_images.id, id));
    } catch (error) {
      throw new Error(`Failed to update dish image: ${error}`);
    }
  }

  static async delete(id: number) {
    try {
      return await db.delete(dish_images).where(eq(dish_images.id, id));
    } catch (error) {
      throw new Error(`Failed to delete dish image: ${error}`);
    }
  }
}
