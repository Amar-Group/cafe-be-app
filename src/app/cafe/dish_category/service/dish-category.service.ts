import {
  CreateDishCategoryRequestDto,
  UpdateDishCategoryRequestDto,
} from "../dto/dish-category-request.dto";
import { DishCategoryResponseDto } from "../dto/dish-category-response.dto";
import { DishCategoryReadRepository } from "../repository/dish-category-read.repository";
import { DishCategoryWriteRepository } from "../repository/dish-category-write.repository";

export class DishCategoryService {
  static async getAll(): Promise<DishCategoryResponseDto[]> {
    return DishCategoryReadRepository.getAll();
  }

  static async getById(id: number): Promise<DishCategoryResponseDto | null> {
    return DishCategoryReadRepository.getById(id);
  }

  static async create(payload: CreateDishCategoryRequestDto) {
    return DishCategoryWriteRepository.create(payload);
  }

  static async update(id: number, payload: UpdateDishCategoryRequestDto) {
    const category = await DishCategoryReadRepository.getById(id);

    if (!category) {
      return null;
    }

    const result = await DishCategoryWriteRepository.update(id, payload);
    return { category, result };
  }

  static async delete(id: number) {
    const category = await DishCategoryReadRepository.getById(id);

    if (!category) {
      return null;
    }

    const result = await DishCategoryWriteRepository.delete(id);
    return { category, result };
  }
}
