import { Context } from "hono";
import {
  CreateDishImageRequestDto,
  UpdateDishImageRequestDto,
} from "../dto/dish-image-request.dto";
import { DishImageService } from "../service/dish-image.service";
import { deleteImageFromCloudinarySafely } from "../../../../utils/cloudinary";

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
    
    let oldPublicId: string | null = null;
    if (body.image_public_id !== undefined) {
      const existing = await DishImageService.getById(id);
      if (existing && existing.image_public_id !== body.image_public_id) {
        oldPublicId = existing.image_public_id;
      }
    }

    const updateResult = await DishImageService.update(id, body);

    if (!updateResult) {
      return c.json({ success: false, message: "Dish image not found" }, 404);
    }

    if (oldPublicId) {
      await deleteImageFromCloudinarySafely(oldPublicId);
    }

    return c.json({
      success: true,
      data: updateResult.result,
      message: "Dish image updated successfully",
    });
  }

  static async delete(c: Context) {
    const id = Number(c.req.param("id"));

    const existing = await DishImageService.getById(id);
    if (!existing) {
      return c.json({ success: false, message: "Dish image not found" }, 404);
    }

    const deleteResult = await DishImageService.delete(id);

    if (!deleteResult) {
      return c.json({ success: false, message: "Dish image not found" }, 404);
    }

    if (existing.image_public_id) {
      await deleteImageFromCloudinarySafely(existing.image_public_id);
    }

    return c.json({
      success: true,
      data: deleteResult.result,
      message: "Dish image deleted successfully",
    });
  }
}
