import { eq } from "drizzle-orm";
import { db } from "../../../../db";
import { billiard_tables } from "../../../../db/schema";
import {
  CreateBilliardTableRequestDto,
  UpdateBilliardTableRequestDto,
} from "../dto/billiard-table-request.dto";

export class BilliardTableWriteRepository {
  static async create(data: CreateBilliardTableRequestDto) {
    try {
      return await db.insert(billiard_tables).values(data);
    } catch (error) {
      throw new Error(`Failed to create billiard table: ${error}`);
    }
  }

  static async update(id: number, data: UpdateBilliardTableRequestDto) {
    try {
      return await db
        .update(billiard_tables)
        .set({
          ...data,
          updated_at: new Date(),
        })
        .where(eq(billiard_tables.id, id));
    } catch (error) {
      throw new Error(`Failed to update billiard table: ${error}`);
    }
  }

  static async delete(id: number) {
    try {
      return await db.delete(billiard_tables).where(eq(billiard_tables.id, id));
    } catch (error) {
      throw new Error(`Failed to delete billiard table: ${error}`);
    }
  }
}
