import { PublicBilliardTableRepository } from "./public-billiard-table.repository";

export class PublicBilliardTableService {
  static async getAll() {
    return PublicBilliardTableRepository.getAll();
  }
}
