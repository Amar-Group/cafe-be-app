import { eq } from "drizzle-orm";
import { db } from "../../../../db";
import { dishes } from "../../../../db/schema";
import {
  CreateDishRequestDto,
  UpdateDishRequestDto,
} from "../dto/dish-request.dto";

export class DishWriteRepository {
  static async create(data: CreateDishRequestDto) {
    try {
      return await db.insert(dishes).values(data);
    } catch (error) {
      throw new Error(`Failed to create dish: ${error}`);
    }
  }

  static async update(id: number, data: UpdateDishRequestDto) {
    try {
      return await db
        .update(dishes)
        .set({
          ...data,
          updated_at: new Date(),
        })
        .where(eq(dishes.id, id));
    } catch (error) {
      throw new Error(`Failed to update dish: ${error}`);
    }
  }

  static async delete(id: number) {
    try {
      return await db.delete(dishes).where(eq(dishes.id, id));
    } catch (error) {
      throw new Error(`Failed to delete dish: ${error}`);
    }
  }
}
