import { Context } from "hono";
import {
  CreateDishRequestDto,
  UpdateDishRequestDto,
} from "../dto/dish-request.dto";
import { DishService } from "../service/dish.service";

export class DishController {
  static async getAll(c: Context) {
    const dishes = await DishService.getAll();

    return c.json({
      success: true,
      data: dishes,
      message: "Dishes fetched successfully",
    });
  }

  static async getById(c: Context) {
    const id = Number(c.req.param("id"));
    const dish = await DishService.getById(id);

    if (!dish) {
      return c.json({ success: false, message: "Dish not found" }, 404);
    }

    return c.json({
      success: true,
      data: dish,
      message: "Dish fetched successfully",
    });
  }

  static async create(c: Context) {
    const body: CreateDishRequestDto = await c.req.json();
    const result = await DishService.create(body);

    return c.json(
      {
        success: true,
        data: result,
        message: "Dish created successfully",
      },
      201,
    );
  }

  static async update(c: Context) {
    const id = Number(c.req.param("id"));
    const body: UpdateDishRequestDto = await c.req.json();
    const updateResult = await DishService.update(id, body);

    if (!updateResult) {
      return c.json({ success: false, message: "Dish not found" }, 404);
    }

    return c.json({
      success: true,
      data: updateResult.result,
      message: "Dish updated successfully",
    });
  }

  static async delete(c: Context) {
    const id = Number(c.req.param("id"));
    const deleteResult = await DishService.delete(id);

    if (!deleteResult) {
      return c.json({ success: false, message: "Dish not found" }, 404);
    }

    return c.json({
      success: true,
      data: deleteResult.result,
      message: "Dish deleted successfully",
    });
  }
}
