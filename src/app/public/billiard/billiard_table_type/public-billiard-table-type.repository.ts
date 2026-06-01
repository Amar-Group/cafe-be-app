import { db, billiard_table_types } from "../../../../db";

export class PublicBilliardTableTypeRepository {
  static async getAll() {
    try {
      return await db.select().from(billiard_table_types);
    } catch (error) {
      throw new Error(`Failed to fetch public billiard table types: ${error}`);
    }
  }
}
