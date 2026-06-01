import { PublicDishCategoryResponseDto } from "./public-dish-category.dto";
import { PublicDishCategoryRepository } from "./public-dish-category.repository";

export class PublicDishCategoryService {
  static async getAll(): Promise<PublicDishCategoryResponseDto[]> {
    return PublicDishCategoryRepository.getAll();
  }
}
