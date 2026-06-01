import type { Context } from "hono";
import { PublicBilliardTableService } from "./public-billiard-table.service";

export class PublicBilliardTableController {
  static async getPublic(c: Context) {
    const tables = await PublicBilliardTableService.getAll();

    return c.json({
      success: true,
      data: tables,
      message: "Public billiard tables fetched successfully",
    });
  }
}
