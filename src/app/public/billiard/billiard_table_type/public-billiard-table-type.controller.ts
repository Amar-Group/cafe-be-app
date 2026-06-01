import type { Context } from "hono";
import { PublicBilliardTableTypeService } from "./public-billiard-table-type.service";

export class PublicBilliardTableTypeController {
  static async getPublic(c: Context) {
    const tableTypes = await PublicBilliardTableTypeService.getAll();

    return c.json({
      success: true,
      data: tableTypes,
      message: "Public billiard table types fetched successfully",
    });
  }
}
