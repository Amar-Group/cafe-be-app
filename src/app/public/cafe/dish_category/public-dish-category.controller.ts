import type { Context } from "hono";
import { PublicDishCategoryService } from "./public-dish-category.service";

export class PublicDishCategoryController {
  static async getPublic(c: Context) {
    const categories = await PublicDishCategoryService.getAll();

    return c.json({
      success: true,
      data: categories,
      message: "Public dish categories fetched successfully",
    });
  }
}
