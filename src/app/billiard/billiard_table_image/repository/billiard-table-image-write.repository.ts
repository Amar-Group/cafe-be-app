import { eq } from "drizzle-orm";
import { db } from "../../../../db";
import { billiard_table_images } from "../../../../db/schema";
import {
  CreateBilliardTableImageRequestDto,
  UpdateBilliardTableImageRequestDto,
} from "../dto/billiard-table-image-request.dto";

export class BilliardTableImageWriteRepository {
  static async create(data: CreateBilliardTableImageRequestDto) {
    try {
      return await db.insert(billiard_table_images).values(data);
    } catch (error) {
      throw new Error(`Failed to create billiard table image: ${error}`);
    }
  }

  static async update(id: number, data: UpdateBilliardTableImageRequestDto) {
    try {
      return await db
        .update(billiard_table_images)
        .set({
          ...data,
          updated_at: new Date(),
        })
        .where(eq(billiard_table_images.id, id));
    } catch (error) {
      throw new Error(`Failed to update billiard table image: ${error}`);
    }
  }

  static async delete(id: number) {
    try {
      return await db.delete(billiard_table_images).where(eq(billiard_table_images.id, id));
    } catch (error) {
      throw new Error(`Failed to delete billiard table image: ${error}`);
    }
  }
}
