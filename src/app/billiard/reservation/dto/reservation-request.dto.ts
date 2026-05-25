import { z } from "@hono/zod-openapi";

export const createReservationRequestSchema = z
  .object({
    billiard_table_id: z.number().int().min(1).openapi({ example: 1 }),
    guest_name: z.string().min(1).openapi({ example: "John Doe" }),
    guest_phone: z.string().min(1).openapi({ example: "081234567890" }),
    date: z.string().min(1).openapi({ example: "2024-05-20" }),
    schedule_id: z.number().int().min(1).openapi({ example: 1 }),
    guest_count: z.number().int().min(1).openapi({ example: 4 }),
    notes: z.string().nullable().optional().openapi({ example: "Meja dekat jendela" }),
    status: z
      .enum(["pending", "confirmed", "preparing", "completed", "cancelled"])
      .optional()
      .openapi({ example: "pending" }),
  })
  .openapi("CreateReservationRequest");

export const updateReservationRequestSchema = z
  .object({
    billiard_table_id: z.number().int().min(1).optional().openapi({ example: 1 }),
    guest_name: z.string().min(1).optional().openapi({ example: "Jane Doe" }),
    guest_phone: z.string().min(1).optional().openapi({ example: "089876543210" }),
    date: z.string().min(1).optional().openapi({ example: "2024-05-21" }),
    schedule_id: z.number().int().min(1).optional().openapi({ example: 1 }),
    guest_count: z.number().int().min(1).optional().openapi({ example: 2 }),
    notes: z.string().nullable().optional().openapi({ example: "Tidak ada" }),
    status: z
      .enum(["pending", "confirmed", "preparing", "completed", "cancelled"])
      .optional()
      .openapi({ example: "confirmed" }),
  })
  .openapi("UpdateReservationRequest");

export type CreateReservationRequestDto = z.infer<typeof createReservationRequestSchema>;
export type UpdateReservationRequestDto = z.infer<typeof updateReservationRequestSchema>;
