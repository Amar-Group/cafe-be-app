import {
  CreateDishOrderDetailRequestDto,
  UpdateDishOrderDetailRequestDto,
} from "../dto/dish-order-detail-request.dto";
import { DishOrderDetailReadRepository } from "../repository/dish-order-detail-read.repository";
import { DishOrderDetailWriteRepository } from "../repository/dish-order-detail-write.repository";

export class DishOrderDetailService {
  static async getAll() {
    return DishOrderDetailReadRepository.getAll();
  }

  static async getById(id: number) {
    return DishOrderDetailReadRepository.getById(id);
  }

  static async create(payload: CreateDishOrderDetailRequestDto) {
    return DishOrderDetailWriteRepository.create(payload);
  }

  static async update(id: number, payload: UpdateDishOrderDetailRequestDto) {
    const detail = await DishOrderDetailReadRepository.getById(id);

    if (!detail) {
      return null;
    }

    const result = await DishOrderDetailWriteRepository.update(id, payload);
    return { detail, result };
  }

  static async delete(id: number) {
    const detail = await DishOrderDetailReadRepository.getById(id);

    if (!detail) {
      return null;
    }

    const result = await DishOrderDetailWriteRepository.delete(id);
    return { detail, result };
  }
}
