import { Context } from "hono";
import {
  CreateBilliardTableRequestDto,
  UpdateBilliardTableRequestDto,
} from "../dto/billiard-table-request.dto";
import { BilliardTableService } from "../service/billiard-table.service";

export class BilliardTableController {
  static async getAll(c: Context) {
    const tables = await BilliardTableService.getAll();

    return c.json({
      success: true,
      data: tables,
      message: "Billiard tables fetched successfully",
    });
  }

  static async getById(c: Context) {
    const id = Number(c.req.param("id"));
    const table = await BilliardTableService.getById(id);

    if (!table) {
      return c.json({ success: false, message: "Billiard table not found" }, 404);
    }

    return c.json({
      success: true,
      data: table,
      message: "Billiard table fetched successfully",
    });
  }

  static async create(c: Context) {
    const body: CreateBilliardTableRequestDto = await c.req.json();
    const result = await BilliardTableService.create(body);

    return c.json(
      {
        success: true,
        data: result,
        message: "Billiard table created successfully",
      },
      201,
    );
  }

  static async update(c: Context) {
    const id = Number(c.req.param("id"));
    const body: UpdateBilliardTableRequestDto = await c.req.json();
    const updateResult = await BilliardTableService.update(id, body);

    if (!updateResult) {
      return c.json({ success: false, message: "Billiard table not found" }, 404);
    }

    return c.json({
      success: true,
      data: updateResult.result,
      message: "Billiard table updated successfully",
    });
  }

  static async delete(c: Context) {
    const id = Number(c.req.param("id"));
    const deleteResult = await BilliardTableService.delete(id);

    if (!deleteResult) {
      return c.json({ success: false, message: "Billiard table not found" }, 404);
    }

    return c.json({
      success: true,
      data: deleteResult.result,
      message: "Billiard table deleted successfully",
    });
  }
}
