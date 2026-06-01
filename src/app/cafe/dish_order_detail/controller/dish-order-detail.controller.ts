import { Context } from "hono";
import {
  CreateDishOrderDetailRequestDto,
  UpdateDishOrderDetailRequestDto,
} from "../dto/dish-order-detail-request.dto";
import { DishOrderDetailService } from "../service/dish-order-detail.service";

export class DishOrderDetailController {
  static async getAll(c: Context) {
    const details = await DishOrderDetailService.getAll();

    return c.json({
      success: true,
      data: details,
      message: "Dish order details fetched successfully",
    });
  }

  static async getById(c: Context) {
    const id = Number(c.req.param("id"));
    const detail = await DishOrderDetailService.getById(id);

    if (!detail) {
      return c.json({ success: false, message: "Dish order detail not found" }, 404);
    }

    return c.json({
      success: true,
      data: detail,
      message: "Dish order detail fetched successfully",
    });
  }

  static async create(c: Context) {
    const body: CreateDishOrderDetailRequestDto = await c.req.json();
    const result = await DishOrderDetailService.create(body);

    return c.json(
      {
        success: true,
        data: result,
        message: "Dish order detail created successfully",
      },
      201,
    );
  }

  static async update(c: Context) {
    const id = Number(c.req.param("id"));
    const body: UpdateDishOrderDetailRequestDto = await c.req.json();
    const updateResult = await DishOrderDetailService.update(id, body);

    if (!updateResult) {
      return c.json({ success: false, message: "Dish order detail not found" }, 404);
    }

    return c.json({
      success: true,
      data: updateResult.result,
      message: "Dish order detail updated successfully",
    });
  }

  static async delete(c: Context) {
    const id = Number(c.req.param("id"));
    const deleteResult = await DishOrderDetailService.delete(id);

    if (!deleteResult) {
      return c.json({ success: false, message: "Dish order detail not found" }, 404);
    }

    return c.json({
      success: true,
      data: deleteResult.result,
      message: "Dish order detail deleted successfully",
    });
  }
}
