import { z } from "@hono/zod-openapi";

export const createDishOrderDetailRequestSchema = z
  .object({
    dish_order_id: z.number().int().min(1).openapi({ example: 1 }),
    dish_id: z.number().int().min(1).openapi({ example: 1 }),
    quantity: z.number().int().min(1).openapi({ example: 2 }),
    notes: z.string().nullable().optional().openapi({ example: "Extra pedas" }),
    status: z
      .enum(["pending", "confirmed", "preparing", "completed", "cancelled"])
      .optional()
      .openapi({ example: "pending" }),
  })
  .openapi("CreateDishOrderDetailRequest");

export const updateDishOrderDetailRequestSchema = z
  .object({
    dish_order_id: z.number().int().min(1).optional().openapi({ example: 1 }),
    dish_id: z.number().int().min(1).optional().openapi({ example: 1 }),
    quantity: z.number().int().min(1).optional().openapi({ example: 3 }),
    notes: z.string().nullable().optional().openapi({ example: "Tidak pedas" }),
    status: z
      .enum(["pending", "confirmed", "preparing", "completed", "cancelled"])
      .optional()
      .openapi({ example: "confirmed" }),
  })
  .openapi("UpdateDishOrderDetailRequest");

export type CreateDishOrderDetailRequestDto = z.infer<typeof createDishOrderDetailRequestSchema>;
export type UpdateDishOrderDetailRequestDto = z.infer<typeof updateDishOrderDetailRequestSchema>;
