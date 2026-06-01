import {
  CreateBilliardTableRequestDto,
  UpdateBilliardTableRequestDto,
} from "../dto/billiard-table-request.dto";
import { BilliardTableReadRepository } from "../repository/billiard-table-read.repository";
import { BilliardTableWriteRepository } from "../repository/billiard-table-write.repository";

export class BilliardTableService {
  static async getAll() {
    return BilliardTableReadRepository.getAll();
  }

  static async getById(id: number) {
    return BilliardTableReadRepository.getById(id);
  }

  static async create(payload: CreateBilliardTableRequestDto) {
    return BilliardTableWriteRepository.create(payload);
  }

  static async update(id: number, payload: UpdateBilliardTableRequestDto) {
    const table = await BilliardTableReadRepository.getById(id);

    if (!table) {
      return null;
    }

    const result = await BilliardTableWriteRepository.update(id, payload);
    return { table, result };
  }

  static async delete(id: number) {
    const table = await BilliardTableReadRepository.getById(id);

    if (!table) {
      return null;
    }

    const result = await BilliardTableWriteRepository.delete(id);
    return { table, result };
  }
}
