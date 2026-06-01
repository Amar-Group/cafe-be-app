import { Context } from "hono";
import {
  CreateBilliardTableImageRequestDto,
  UpdateBilliardTableImageRequestDto,
} from "../dto/billiard-table-image-request.dto";
import { BilliardTableImageService } from "../service/billiard-table-image.service";

export class BilliardTableImageController {
  static async getAll(c: Context) {
    const images = await BilliardTableImageService.getAll();

    return c.json({
      success: true,
      data: images,
      message: "Billiard table images fetched successfully",
    });
  }

  static async getById(c: Context) {
    const id = Number(c.req.param("id"));
    const image = await BilliardTableImageService.getById(id);

    if (!image) {
      return c.json({ success: false, message: "Billiard table image not found" }, 404);
    }

    return c.json({
      success: true,
      data: image,
      message: "Billiard table image fetched successfully",
    });
  }

  static async create(c: Context) {
    const body: CreateBilliardTableImageRequestDto = await c.req.json();
    const result = await BilliardTableImageService.create(body);

    return c.json(
      {
        success: true,
        data: result,
        message: "Billiard table image created successfully",
      },
      201,
    );
  }

  static async update(c: Context) {
    const id = Number(c.req.param("id"));
    const body: UpdateBilliardTableImageRequestDto = await c.req.json();
    const updateResult = await BilliardTableImageService.update(id, body);

    if (!updateResult) {
      return c.json({ success: false, message: "Billiard table image not found" }, 404);
    }

    return c.json({
      success: true,
      data: updateResult.result,
      message: "Billiard table image updated successfully",
    });
  }

  static async delete(c: Context) {
    const id = Number(c.req.param("id"));
    const deleteResult = await BilliardTableImageService.delete(id);

    if (!deleteResult) {
      return c.json({ success: false, message: "Billiard table image not found" }, 404);
    }

    return c.json({
      success: true,
      data: deleteResult.result,
      message: "Billiard table image deleted successfully",
    });
  }
}
