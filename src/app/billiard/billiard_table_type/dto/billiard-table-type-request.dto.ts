import { z } from "@hono/zod-openapi";

export const createBilliardTableTypeRequestSchema = z
  .object({
    name: z.string().min(1).openapi({ example: "Standard Pool" }),
    icon: z.string().nullable().optional().openapi({ example: "ph-billiards" }),
    description: z.string().nullable().optional().openapi({ example: "Meja billiard standar 8 ball" }),
  })
  .openapi("CreateBilliardTableTypeRequest");

export const updateBilliardTableTypeRequestSchema = z
  .object({
    name: z.string().min(1).optional().openapi({ example: "Premium Snooker" }),
    icon: z.string().nullable().optional().openapi({ example: "ph-trophy" }),
    description: z.string().nullable().optional().openapi({ example: "Meja snooker premium" }),
  })
  .openapi("UpdateBilliardTableTypeRequest");

export type CreateBilliardTableTypeRequestDto = z.infer<typeof createBilliardTableTypeRequestSchema>;
export type UpdateBilliardTableTypeRequestDto = z.infer<typeof updateBilliardTableTypeRequestSchema>;
