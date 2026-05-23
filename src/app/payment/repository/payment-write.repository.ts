import { eq } from "drizzle-orm";
import { db } from "../../../../db";
import { payments } from "../../../../db/schema";

export class PaymentWriteRepository {
  static async create(data: any) {
    try {
      return await db.insert(payments).values(data);
    } catch (error) {
      throw new Error(`Failed to create payment: ${error}`);
    }
  }

  static async update(id: number, data: any) {
    try {
      return await db
        .update(payments)
        .set({
          ...data,
          updated_at: new Date(),
        })
        .where(eq(payments.id, id));
    } catch (error) {
      throw new Error(`Failed to update payment: ${error}`);
    }
  }

  static async delete(id: number) {
    try {
      return await db.delete(payments).where(eq(payments.id, id));
    } catch (error) {
      throw new Error(`Failed to delete payment: ${error}`);
    }
  }
}
