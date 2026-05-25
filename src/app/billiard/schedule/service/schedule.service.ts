import {
  CreateScheduleRequestDto,
  UpdateScheduleRequestDto,
} from "../dto/schedule-request.dto";
import { ScheduleReadRepository } from "../repository/schedule-read.repository";
import { ScheduleWriteRepository } from "../repository/schedule-write.repository";

export class ScheduleService {
  static async getAll() {
    return ScheduleReadRepository.getAll();
  }

  static async getById(id: number) {
    return ScheduleReadRepository.getById(id);
  }

  static async create(payload: CreateScheduleRequestDto) {
    return ScheduleWriteRepository.create(payload);
  }

  static async update(id: number, payload: UpdateScheduleRequestDto) {
    const schedule = await ScheduleReadRepository.getById(id);
    if (!schedule) return null;

    const result = await ScheduleWriteRepository.update(id, payload);
    return { schedule, result };
  }

  static async delete(id: number) {
    const schedule = await ScheduleReadRepository.getById(id);
    if (!schedule) return null;

    const result = await ScheduleWriteRepository.delete(id);
    return { schedule, result };
  }
}
