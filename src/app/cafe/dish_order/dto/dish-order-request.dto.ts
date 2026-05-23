import { z } from "@hono/zod-openapi";

export const createDishOrderRequestSchema = z
  .object({
    guest_name: z.string().min(1).openapi({ example: "John Doe" }),
    guest_phone: z.string().min(1).openapi({ example: "081234567890" }),
    total: z.string().min(1).openapi({ example: "100000.00" }),
    tax: z.string().min(1).openapi({ example: "11000.00" }),
    service_fee: z.string().min(1).openapi({ example: "5000.00" }),
    nett_price: z.string().min(1).openapi({ example: "116000.00" }),
  })
  .openapi("CreateDishOrderRequest");

export const updateDishOrderRequestSchema = z
  .object({
    guest_name: z.string().min(1).optional().openapi({ example: "Jane Doe" }),
    guest_phone: z.string().min(1).optional().openapi({ example: "089876543210" }),
    total: z.string().min(1).optional().openapi({ example: "150000.00" }),
    tax: z.string().min(1).optional().openapi({ example: "16500.00" }),
    service_fee: z.string().min(1).optional().openapi({ example: "7500.00" }),
    nett_price: z.string().min(1).optional().openapi({ example: "174000.00" }),
  })
  .openapi("UpdateDishOrderRequest");

export type CreateDishOrderRequestDto = z.infer<typeof createDishOrderRequestSchema>;
export type UpdateDishOrderRequestDto = z.infer<typeof updateDishOrderRequestSchema>;
