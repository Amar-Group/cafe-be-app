import { eq } from "drizzle-orm";
import { db } from "../../../../db";
import { billiard_table_types } from "../../../../db/schema";
import {
  CreateBilliardTableTypeRequestDto,
  UpdateBilliardTableTypeRequestDto,
} from "../dto/billiard-table-type-request.dto";

export class BilliardTableTypeWriteRepository {
  static async create(data: CreateBilliardTableTypeRequestDto) {
    try {
      return await db.insert(billiard_table_types).values(data);
    } catch (error) {
      throw new Error(`Failed to create billiard table type: ${error}`);
    }
  }

  static async update(id: number, data: UpdateBilliardTableTypeRequestDto) {
    try {
      return await db
        .update(billiard_table_types)
        .set({
          ...data,
          updated_at: new Date(),
        })
        .where(eq(billiard_table_types.id, id));
    } catch (error) {
      throw new Error(`Failed to update billiard table type: ${error}`);
    }
  }

  static async delete(id: number) {
    try {
      return await db.delete(billiard_table_types).where(eq(billiard_table_types.id, id));
    } catch (error) {
      throw new Error(`Failed to delete billiard table type: ${error}`);
    }
  }
}
