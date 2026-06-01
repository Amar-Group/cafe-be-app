import { PublicBilliardTableTypeResponseDto } from "./public-billiard-table-type.dto";
import { PublicBilliardTableTypeRepository } from "./public-billiard-table-type.repository";

export class PublicBilliardTableTypeService {
  static async getAll(): Promise<PublicBilliardTableTypeResponseDto[]> {
    return PublicBilliardTableTypeRepository.getAll();
  }
}
