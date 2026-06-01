import {
  CreateBilliardTableTypeRequestDto,
  UpdateBilliardTableTypeRequestDto,
} from "../dto/billiard-table-type-request.dto";
import { BilliardTableTypeResponseDto } from "../dto/billiard-table-type-response.dto";
import { BilliardTableTypeReadRepository } from "../repository/billiard-table-type-read.repository";
import { BilliardTableTypeWriteRepository } from "../repository/billiard-table-type-write.repository";

export class BilliardTableTypeService {
  static async getAll(): Promise<BilliardTableTypeResponseDto[]> {
    return BilliardTableTypeReadRepository.getAll();
  }

  static async getById(id: number): Promise<BilliardTableTypeResponseDto | null> {
    return BilliardTableTypeReadRepository.getById(id);
  }

  static async create(payload: CreateBilliardTableTypeRequestDto) {
    return BilliardTableTypeWriteRepository.create(payload);
  }

  static async update(id: number, payload: UpdateBilliardTableTypeRequestDto) {
    const type = await BilliardTableTypeReadRepository.getById(id);

    if (!type) {
      return null;
    }

    const result = await BilliardTableTypeWriteRepository.update(id, payload);
    return { type, result };
  }

  static async delete(id: number) {
    const type = await BilliardTableTypeReadRepository.getById(id);

    if (!type) {
      return null;
    }

    const result = await BilliardTableTypeWriteRepository.delete(id);
    return { type, result };
  }
}
