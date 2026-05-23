import {
  CreateDishImageRequestDto,
  UpdateDishImageRequestDto,
} from "../dto/dish-image-request.dto";
import { DishImageResponseDto } from "../dto/dish-image-response.dto";
import { DishImageReadRepository } from "../repository/dish-image-read.repository";
import { DishImageWriteRepository } from "../repository/dish-image-write.repository";

export class DishImageService {
  static async getAll(): Promise<DishImageResponseDto[]> {
    return DishImageReadRepository.getAll();
  }

  static async getById(id: number): Promise<DishImageResponseDto | null> {
    return DishImageReadRepository.getById(id);
  }

  static async create(payload: CreateDishImageRequestDto) {
    return DishImageWriteRepository.create(payload);
  }

  static async update(id: number, payload: UpdateDishImageRequestDto) {
    const image = await DishImageReadRepository.getById(id);

    if (!image) {
      return null;
    }

    const result = await DishImageWriteRepository.update(id, payload);
    return { image, result };
  }

  static async delete(id: number) {
    const image = await DishImageReadRepository.getById(id);

    if (!image) {
      return null;
    }

    const result = await DishImageWriteRepository.delete(id);
    return { image, result };
  }
}
