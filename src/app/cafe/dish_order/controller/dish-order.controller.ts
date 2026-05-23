import { Context } from "hono";
import {
  CreateDishOrderRequestDto,
  UpdateDishOrderRequestDto,
} from "../dto/dish-order-request.dto";
import { DishOrderService } from "../service/dish-order.service";

export class DishOrderController {
  static async getAll(c: Context) {
    const orders = await DishOrderService.getAll();

    return c.json({
      success: true,
      data: orders,
      message: "Dish orders fetched successfully",
    });
  }

  static async getById(c: Context) {
    const id = Number(c.req.param("id"));
    const order = await DishOrderService.getById(id);

    if (!order) {
      return c.json({ success: false, message: "Dish order not found" }, 404);
    }

    return c.json({
      success: true,
      data: order,
      message: "Dish order fetched successfully",
    });
  }

  static async create(c: Context) {
    const body: CreateDishOrderRequestDto = await c.req.json();
    const result = await DishOrderService.create(body);

    return c.json(
      {
        success: true,
        data: result,
        message: "Dish order created successfully",
      },
      201,
    );
  }

  static async update(c: Context) {
    const id = Number(c.req.param("id"));
    const body: UpdateDishOrderRequestDto = await c.req.json();
    const updateResult = await DishOrderService.update(id, body);

    if (!updateResult) {
      return c.json({ success: false, message: "Dish order not found" }, 404);
    }

    return c.json({
      success: true,
      data: updateResult.result,
      message: "Dish order updated successfully",
    });
  }

  static async delete(c: Context) {
    const id = Number(c.req.param("id"));
    const deleteResult = await DishOrderService.delete(id);

    if (!deleteResult) {
      return c.json({ success: false, message: "Dish order not found" }, 404);
    }

    return c.json({
      success: true,
      data: deleteResult.result,
      message: "Dish order deleted successfully",
    });
  }
}
