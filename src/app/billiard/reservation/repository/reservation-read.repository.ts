import { eq } from "drizzle-orm";
import { db } from "../../../../db";
import { reservations, billiard_tables } from "../../../../db/schema";

export class ReservationReadRepository {
  static async getAll() {
    try {
      return await db
        .select({
          id: reservations.id,
          billiard_table_id: reservations.billiard_table_id,
          guest_name: reservations.guest_name,
          guest_phone: reservations.guest_phone,
          date: reservations.date,
          start_time: reservations.start_time,
          end_time: reservations.end_time,
          guest_count: reservations.guest_count,
          notes: reservations.notes,
          status: reservations.status,
          created_at: reservations.created_at,
          updated_at: reservations.updated_at,
          billiard_table: {
            id: billiard_tables.id,
            name: billiard_tables.name,
            slug: billiard_tables.slug,
            price: billiard_tables.price,
            thumbnail: billiard_tables.thumbnail,
          },
        })
        .from(reservations)
        .leftJoin(billiard_tables, eq(reservations.billiard_table_id, billiard_tables.id));
    } catch (error) {
      throw new Error(`Failed to fetch reservations: ${error}`);
    }
  }

  static async getById(id: number) {
    try {
      const result = await db
        .select({
          id: reservations.id,
          billiard_table_id: reservations.billiard_table_id,
          guest_name: reservations.guest_name,
          guest_phone: reservations.guest_phone,
          date: reservations.date,
          start_time: reservations.start_time,
          end_time: reservations.end_time,
          guest_count: reservations.guest_count,
          notes: reservations.notes,
          status: reservations.status,
          created_at: reservations.created_at,
          updated_at: reservations.updated_at,
          billiard_table: {
            id: billiard_tables.id,
            name: billiard_tables.name,
            slug: billiard_tables.slug,
            price: billiard_tables.price,
            thumbnail: billiard_tables.thumbnail,
          },
        })
        .from(reservations)
        .leftJoin(billiard_tables, eq(reservations.billiard_table_id, billiard_tables.id))
        .where(eq(reservations.id, id))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch reservation: ${error}`);
    }
  }
}
