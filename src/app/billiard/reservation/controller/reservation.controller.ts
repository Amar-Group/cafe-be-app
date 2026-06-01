import { Context } from "hono";
import {
  CreateReservationRequestDto,
  UpdateReservationRequestDto,
} from "../dto/reservation-request.dto";
import { ReservationService } from "../service/reservation.service";

export class ReservationController {
  static async getAll(c: Context) {
    const reservations = await ReservationService.getAll();

    return c.json({
      success: true,
      data: reservations,
      message: "Reservations fetched successfully",
    });
  }

  static async getById(c: Context) {
    const id = Number(c.req.param("id"));
    const reservation = await ReservationService.getById(id);

    if (!reservation) {
      return c.json({ success: false, message: "Reservation not found" }, 404);
    }

    return c.json({
      success: true,
      data: reservation,
      message: "Reservation fetched successfully",
    });
  }

  static async create(c: Context) {
    const body: CreateReservationRequestDto = await c.req.json();
    const result = await ReservationService.create(body);

    return c.json(
      {
        success: true,
        data: result,
        message: "Reservation created successfully",
      },
      201,
    );
  }

  static async update(c: Context) {
    const id = Number(c.req.param("id"));
    const body: UpdateReservationRequestDto = await c.req.json();
    const updateResult = await ReservationService.update(id, body);

    if (!updateResult) {
      return c.json({ success: false, message: "Reservation not found" }, 404);
    }

    return c.json({
      success: true,
      data: updateResult.result,
      message: "Reservation updated successfully",
    });
  }

  static async delete(c: Context) {
    const id = Number(c.req.param("id"));
    const deleteResult = await ReservationService.delete(id);

    if (!deleteResult) {
      return c.json({ success: false, message: "Reservation not found" }, 404);
    }

    return c.json({
      success: true,
      data: deleteResult.result,
      message: "Reservation deleted successfully",
    });
  }
}
