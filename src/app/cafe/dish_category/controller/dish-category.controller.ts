import { Context } from "hono";
import {
  CreateDishCategoryRequestDto,
  UpdateDishCategoryRequestDto,
} from "../dto/dish-category-request.dto";
import { DishCategoryService } from "../service/dish-category.service";

export class DishCategoryController {
  static async getAll(c: Context) {
    const categories = await DishCategoryService.getAll();

    return c.json({
      success: true,
      data: categories,
      message: "Dish categories fetched successfully",
    });
  }

  static async getById(c: Context) {
    const id = Number(c.req.param("id"));
    const category = await DishCategoryService.getById(id);

    if (!category) {
      return c.json({ success: false, message: "Dish category not found" }, 404);
    }

    return c.json({
      success: true,
      data: category,
      message: "Dish category fetched successfully",
    });
  }

  static async create(c: Context) {
    const body: CreateDishCategoryRequestDto = await c.req.json();
    const result = await DishCategoryService.create(body);

    return c.json(
      {
        success: true,
        data: result,
        message: "Dish category created successfully",
      },
      201,
    );
  }

  static async update(c: Context) {
    const id = Number(c.req.param("id"));
    const body: UpdateDishCategoryRequestDto = await c.req.json();
    const updateResult = await DishCategoryService.update(id, body);

    if (!updateResult) {
      return c.json({ success: false, message: "Dish category not found" }, 404);
    }

    return c.json({
      success: true,
      data: updateResult.result,
      message: "Dish category updated successfully",
    });
  }

  static async delete(c: Context) {
    const id = Number(c.req.param("id"));
    const deleteResult = await DishCategoryService.delete(id);

    if (!deleteResult) {
      return c.json({ success: false, message: "Dish category not found" }, 404);
    }

    return c.json({
      success: true,
      data: deleteResult.result,
      message: "Dish category deleted successfully",
    });
  }
}
