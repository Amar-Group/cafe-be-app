import { Context } from "hono";
import {
  CreateDishImageRequestDto,
  UpdateDishImageRequestDto,
} from "../dto/dish-image-request.dto";
import { DishImageService } from "../service/dish-image.service";

export class DishImageController {
  static async getAll(c: Context) {
    const images = await DishImageService.getAll();

    return c.json({
      success: true,
      data: images,
      message: "Dish images fetched successfully",
    });
  }

  static async getById(c: Context) {
    const id = Number(c.req.param("id"));
    const image = await DishImageService.getById(id);

    if (!image) {
      return c.json({ success: false, message: "Dish image not found" }, 404);
    }

    return c.json({
      success: true,
      data: image,
      message: "Dish image fetched successfully",
    });
  }

  static async create(c: Context) {
    const body: CreateDishImageRequestDto = await c.req.json();
    const result = await DishImageService.create(body);

    return c.json(
      {
        success: true,
        data: result,
        message: "Dish image created successfully",
      },
      201,
    );
  }

  static async update(c: Context) {
    const id = Number(c.req.param("id"));
    const body: UpdateDishImageRequestDto = await c.req.json();
    const updateResult = await DishImageService.update(id, body);

    if (!updateResult) {
      return c.json({ success: false, message: "Dish image not found" }, 404);
    }

    return c.json({
      success: true,
      data: updateResult.result,
      message: "Dish image updated successfully",
    });
  }

  static async delete(c: Context) {
    const id = Number(c.req.param("id"));
    const deleteResult = await DishImageService.delete(id);

    if (!deleteResult) {
      return c.json({ success: false, message: "Dish image not found" }, 404);
    }

    return c.json({
      success: true,
      data: deleteResult.result,
      message: "Dish image deleted successfully",
    });
  }
}
