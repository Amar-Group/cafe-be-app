import {
  CreateDishOrderRequestDto,
  UpdateDishOrderRequestDto,
} from "../dto/dish-order-request.dto";
import { DishOrderResponseDto } from "../dto/dish-order-response.dto";
import { DishOrderReadRepository } from "../repository/dish-order-read.repository";
import { DishOrderWriteRepository } from "../repository/dish-order-write.repository";

export class DishOrderService {
  static async getAll(): Promise<DishOrderResponseDto[]> {
    return DishOrderReadRepository.getAll();
  }

  static async getById(id: number): Promise<DishOrderResponseDto | null> {
    return DishOrderReadRepository.getById(id);
  }

  static async create(payload: CreateDishOrderRequestDto) {
    return DishOrderWriteRepository.create(payload);
  }

  static async update(id: number, payload: UpdateDishOrderRequestDto) {
    const order = await DishOrderReadRepository.getById(id);

    if (!order) {
      return null;
    }

    const result = await DishOrderWriteRepository.update(id, payload);
    return { order, result };
  }

  static async delete(id: number) {
    const order = await DishOrderReadRepository.getById(id);

    if (!order) {
      return null;
    }

    const result = await DishOrderWriteRepository.delete(id);
    return { order, result };
  }
}
