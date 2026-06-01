import { PublicScheduleResponseDto } from "./public-schedule.dto";
import { PublicScheduleRepository } from "./public-schedule.repository";

export class PublicScheduleService {
  static async getAll(): Promise<PublicScheduleResponseDto[]> {
    return PublicScheduleRepository.getAll();
  }
}
