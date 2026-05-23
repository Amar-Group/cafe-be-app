import { z } from "@hono/zod-openapi";

export const createPaymentRequestSchema = z
  .object({
    type: z.enum(["dish_order", "reservation"]).openapi({ example: "dish_order" }),
    dish_order_id: z.number().int().min(1).nullable().optional().openapi({ example: 1 }),
    reservation_id: z.number().int().min(1).nullable().optional().openapi({ example: null }),
    method: z
      .enum(["qris", "bank_transfer", "cash", "ewallet", "credit_card"])
      .openapi({ example: "qris" }),
    provider: z
      .enum(["midtrans", "xendit", "manual", "cashier"])
      .openapi({ example: "midtrans" }),
    transaction_id: z.string().nullable().optional().openapi({ example: "TRX-123456" }),
    gross_amount: z.string().min(1).openapi({ example: "116000.00" }),
    status: z
      .enum(["pending", "paid", "failed", "expired", "cancelled", "refunded"])
      .optional()
      .openapi({ example: "pending" }),
    url: z.string().nullable().optional().openapi({ example: "https://midtrans.com/pay/123" }),
    snap_token: z.string().nullable().optional().openapi({ example: "snap-token-xyz" }),
    paid_at: z.string().nullable().optional().openapi({ example: "2024-05-20T18:00:00Z" }),
    expired_at: z.string().nullable().optional().openapi({ example: "2024-05-21T18:00:00Z" }),
  })
  .openapi("CreatePaymentRequest");

export const updatePaymentRequestSchema = z
  .object({
    type: z.enum(["dish_order", "reservation"]).optional().openapi({ example: "dish_order" }),
    dish_order_id: z.number().int().min(1).nullable().optional().openapi({ example: 1 }),
    reservation_id: z.number().int().min(1).nullable().optional().openapi({ example: null }),
    method: z
      .enum(["qris", "bank_transfer", "cash", "ewallet", "credit_card"])
      .optional()
      .openapi({ example: "bank_transfer" }),
    provider: z
      .enum(["midtrans", "xendit", "manual", "cashier"])
      .optional()
      .openapi({ example: "manual" }),
    transaction_id: z.string().nullable().optional().openapi({ example: "TRX-123456" }),
    gross_amount: z.string().min(1).optional().openapi({ example: "116000.00" }),
    status: z
      .enum(["pending", "paid", "failed", "expired", "cancelled", "refunded"])
      .optional()
      .openapi({ example: "paid" }),
    url: z.string().nullable().optional().openapi({ example: null }),
    snap_token: z.string().nullable().optional().openapi({ example: null }),
    paid_at: z.string().nullable().optional().openapi({ example: "2024-05-20T18:05:00Z" }),
    expired_at: z.string().nullable().optional().openapi({ example: "2024-05-21T18:00:00Z" }),
  })
  .openapi("UpdatePaymentRequest");

export type CreatePaymentRequestDto = z.infer<typeof createPaymentRequestSchema>;
export type UpdatePaymentRequestDto = z.infer<typeof updatePaymentRequestSchema>;
