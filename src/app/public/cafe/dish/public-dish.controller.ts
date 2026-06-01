import type { Context } from "hono";
import { PublicDishService } from "./public-dish.service";

export class PublicDishController {
  static async getPublic(c: Context) {
    const dishes = await PublicDishService.getAll();

    return c.json({
      success: true,
      data: dishes,
      message: "Public dishes fetched successfully",
    });
  }
}