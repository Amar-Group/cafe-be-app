import {
  CreateBilliardTableImageRequestDto,
  UpdateBilliardTableImageRequestDto,
} from "../dto/billiard-table-image-request.dto";
import { BilliardTableImageResponseDto } from "../dto/billiard-table-image-response.dto";
import { BilliardTableImageReadRepository } from "../repository/billiard-table-image-read.repository";
import { BilliardTableImageWriteRepository } from "../repository/billiard-table-image-write.repository";

export class BilliardTableImageService {
  static async getAll(): Promise<BilliardTableImageResponseDto[]> {
    return BilliardTableImageReadRepository.getAll();
  }

  static async getById(id: number): Promise<BilliardTableImageResponseDto | null> {
    return BilliardTableImageReadRepository.getById(id);
  }

  static async create(payload: CreateBilliardTableImageRequestDto) {
    return BilliardTableImageWriteRepository.create(payload);
  }

  static async update(id: number, payload: UpdateBilliardTableImageRequestDto) {
    const image = await BilliardTableImageReadRepository.getById(id);

    if (!image) {
      return null;
    }

    const result = await BilliardTableImageWriteRepository.update(id, payload);
    return { image, result };
  }

  static async delete(id: number) {
    const image = await BilliardTableImageReadRepository.getById(id);

    if (!image) {
      return null;
    }

    const result = await BilliardTableImageWriteRepository.delete(id);
    return { image, result };
  }
}
