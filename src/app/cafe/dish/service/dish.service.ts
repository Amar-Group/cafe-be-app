import {
  CreateDishRequestDto,
  UpdateDishRequestDto,
} from "../dto/dish-request.dto";
import { DishResponseDto } from "../dto/dish-response.dto";
import { DishReadRepository } from "../repository/dish-read.repository";
import { DishWriteRepository } from "../repository/dish-write.repository";

export class DishService {
  static async getAll(): Promise<DishResponseDto[]> {
    return DishReadRepository.getAll();
  }

  static async getById(id: number): Promise<DishResponseDto | null> {
    return DishReadRepository.getById(id);
  }

  static async create(payload: CreateDishRequestDto) {
    return DishWriteRepository.create(payload);
  }

  static async update(id: number, payload: UpdateDishRequestDto) {
    const dish = await DishReadRepository.getById(id);

    if (!dish) {
      return null;
    }

    const result = await DishWriteRepository.update(id, payload);
    return { dish, result };
  }

  static async delete(id: number) {
    const dish = await DishReadRepository.getById(id);

    if (!dish) {
      return null;
    }

    const result = await DishWriteRepository.delete(id);
    return { dish, result };
  }
}
