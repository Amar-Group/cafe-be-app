import { eq } from "drizzle-orm";
import { db, billiard_tables, billiard_table_types } from "../../../../db";

export class PublicBilliardTableRepository {
  static async getAll() {
    try {
      return await db
        .select({
          id: billiard_tables.id,
          table_type_id: billiard_tables.table_type_id,
          name: billiard_tables.name,
          slug: billiard_tables.slug,
          price: billiard_tables.price,
          thumbnail: billiard_tables.thumbnail,
          thumbnail_public_id: billiard_tables.thumbnail_public_id,
          is_available: billiard_tables.is_available,
          is_active: billiard_tables.is_active,
          created_at: billiard_tables.created_at,
          updated_at: billiard_tables.updated_at,
          type: {
            id: billiard_table_types.id,
            name: billiard_table_types.name,
            icon: billiard_table_types.icon,
          },
        })
        .from(billiard_tables)
        .leftJoin(billiard_table_types, eq(billiard_tables.table_type_id, billiard_table_types.id))
        .where(eq(billiard_tables.is_active, true)); // Only active tables for public
    } catch (error) {
      throw new Error(`Failed to fetch public billiard tables: ${error}`);
    }
  }
}
