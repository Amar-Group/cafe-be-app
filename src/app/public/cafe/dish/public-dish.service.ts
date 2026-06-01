import { PublicDishResponseDto } from "./public-dish.dto";
import { PublicDishRepository } from "./public-dish.repository";

export class PublicDishService {
  static async getAll(): Promise<PublicDishResponseDto[]> {
    return PublicDishRepository.getAll();
  }
}
