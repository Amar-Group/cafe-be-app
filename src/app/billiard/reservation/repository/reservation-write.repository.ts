import { eq } from "drizzle-orm";
import { db } from "../../../../db";
import { reservations } from "../../../../db/schema";
import {
  CreateReservationRequestDto,
  UpdateReservationRequestDto,
} from "../dto/reservation-request.dto";

export class ReservationWriteRepository {
  static async create(data: CreateReservationRequestDto) {
    try {
      const payload: any = { ...data };
      if (payload.date) payload.date = new Date(payload.date);
      return await db.insert(reservations).values(payload);
    } catch (error) {
      throw new Error(`Failed to create reservation: ${error}`);
    }
  }

  static async update(id: number, data: UpdateReservationRequestDto) {
    try {
      const payload: any = { ...data };
      if (payload.date) payload.date = new Date(payload.date);
      
      return await db
        .update(reservations)
        .set({
          ...payload,
          updated_at: new Date(),
        })
        .where(eq(reservations.id, id));
    } catch (error) {
      throw new Error(`Failed to update reservation: ${error}`);
    }
  }

  static async delete(id: number) {
    try {
      return await db.delete(reservations).where(eq(reservations.id, id));
    } catch (error) {
      throw new Error(`Failed to delete reservation: ${error}`);
    }
  }
}
