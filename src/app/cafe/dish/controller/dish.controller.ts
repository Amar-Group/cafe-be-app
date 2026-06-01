import { Context } from "hono";
import {
  CreateDishRequestDto,
  UpdateDishRequestDto,
} from "../dto/dish-request.dto";
import { DishService } from "../service/dish.service";
import { deleteImageFromCloudinarySafely } from "../../../../utils/cloudinary";

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
    
    // Check if thumbnail changed
    let oldPublicId: string | null = null;
    if (body.thumbnail_public_id !== undefined) {
      const existing = await DishService.getById(id);
      if (existing && existing.thumbnail_public_id !== body.thumbnail_public_id) {
        oldPublicId = existing.thumbnail_public_id;
      }
    }

    const updateResult = await DishService.update(id, body);

    if (!updateResult) {
      return c.json({ success: false, message: "Dish not found" }, 404);
    }

    if (oldPublicId) {
      await deleteImageFromCloudinarySafely(oldPublicId);
    }

    return c.json({
      success: true,
      data: updateResult.result,
      message: "Dish updated successfully",
    });
  }

  static async delete(c: Context) {
    const id = Number(c.req.param("id"));
    
    const existing = await DishService.getById(id);
    if (!existing) {
      return c.json({ success: false, message: "Dish not found" }, 404);
    }

    const deleteResult = await DishService.delete(id);

    if (!deleteResult) {
      return c.json({ success: false, message: "Dish not found" }, 404);
    }

    if (existing.thumbnail_public_id) {
      await deleteImageFromCloudinarySafely(existing.thumbnail_public_id);
    }

    return c.json({
      success: true,
      data: deleteResult.result,
      message: "Dish deleted successfully",
    });
  }
}
