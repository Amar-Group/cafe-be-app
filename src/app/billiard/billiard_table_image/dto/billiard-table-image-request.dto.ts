import { z } from "@hono/zod-openapi";

export const createBilliardTableImageRequestSchema = z
  .object({
    billiard_table_id: z.number().int().min(1).openapi({ example: 1 }),
    image: z.string().min(1).openapi({ example: "https://res.cloudinary.com/xxx/table-01.jpg" }),
    image_public_id: z.string().min(1).openapi({ example: "uploads/table-01" }),
  })
  .openapi("CreateBilliardTableImageRequest");

export const updateBilliardTableImageRequestSchema = z
  .object({
    billiard_table_id: z.number().int().min(1).optional().openapi({ example: 1 }),
    image: z.string().min(1).optional().openapi({ example: "https://res.cloudinary.com/xxx/table-02.jpg" }),
    image_public_id: z.string().min(1).optional().openapi({ example: "uploads/table-02" }),
  })
  .openapi("UpdateBilliardTableImageRequest");

export type CreateBilliardTableImageRequestDto = z.infer<typeof createBilliardTableImageRequestSchema>;
export type UpdateBilliardTableImageRequestDto = z.infer<typeof updateBilliardTableImageRequestSchema>;
