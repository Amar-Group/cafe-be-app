import {
  CreateReservationRequestDto,
  UpdateReservationRequestDto,
} from "../dto/reservation-request.dto";
import { ReservationResponseDto } from "../dto/reservation-response.dto";
import { ReservationReadRepository } from "../repository/reservation-read.repository";
import { ReservationWriteRepository } from "../repository/reservation-write.repository";

export class ReservationService {
  static async getAll() {
    return ReservationReadRepository.getAll();
  }

  static async getById(id: number) {
    return ReservationReadRepository.getById(id);
  }

  static async create(payload: CreateReservationRequestDto) {
    return ReservationWriteRepository.create(payload);
  }

  static async update(id: number, payload: UpdateReservationRequestDto) {
    const reservation = await ReservationReadRepository.getById(id);

    if (!reservation) {
      return null;
    }

    const result = await ReservationWriteRepository.update(id, payload);
    return { reservation, result };
  }

  static async delete(id: number) {
    const reservation = await ReservationReadRepository.getById(id);

    if (!reservation) {
      return null;
    }

    const result = await ReservationWriteRepository.delete(id);
    return { reservation, result };
  }
}
