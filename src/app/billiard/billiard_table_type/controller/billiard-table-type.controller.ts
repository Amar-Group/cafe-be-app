import { Context } from "hono";
import {
  CreateBilliardTableTypeRequestDto,
  UpdateBilliardTableTypeRequestDto,
} from "../dto/billiard-table-type-request.dto";
import { BilliardTableTypeService } from "../service/billiard-table-type.service";

export class BilliardTableTypeController {
  static async getAll(c: Context) {
    const types = await BilliardTableTypeService.getAll();

    return c.json({
      success: true,
      data: types,
      message: "Billiard table types fetched successfully",
    });
  }

  static async getById(c: Context) {
    const id = Number(c.req.param("id"));
    const type = await BilliardTableTypeService.getById(id);

    if (!type) {
      return c.json({ success: false, message: "Billiard table type not found" }, 404);
    }

    return c.json({
      success: true,
      data: type,
      message: "Billiard table type fetched successfully",
    });
  }

  static async create(c: Context) {
    const body: CreateBilliardTableTypeRequestDto = await c.req.json();
    const result = await BilliardTableTypeService.create(body);

    return c.json(
      {
        success: true,
        data: result,
        message: "Billiard table type created successfully",
      },
      201,
    );
  }

  static async update(c: Context) {
    const id = Number(c.req.param("id"));
    const body: UpdateBilliardTableTypeRequestDto = await c.req.json();
    const updateResult = await BilliardTableTypeService.update(id, body);

    if (!updateResult) {
      return c.json({ success: false, message: "Billiard table type not found" }, 404);
    }

    return c.json({
      success: true,
      data: updateResult.result,
      message: "Billiard table type updated successfully",
    });
  }

  static async delete(c: Context) {
    const id = Number(c.req.param("id"));
    const deleteResult = await BilliardTableTypeService.delete(id);

    if (!deleteResult) {
      return c.json({ success: false, message: "Billiard table type not found" }, 404);
    }

    return c.json({
      success: true,
      data: deleteResult.result,
      message: "Billiard table type deleted successfully",
    });
  }
}
