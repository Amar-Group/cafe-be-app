import { z } from "@hono/zod-openapi";

export const createBilliardTableRequestSchema = z
  .object({
    table_type_id: z.number().int().min(1).openapi({ example: 1 }),
    name: z.string().min(1).openapi({ example: "Table 01" }),
    slug: z.string().min(1).openapi({ example: "table-01" }),
    price: z.string().min(1).openapi({ example: "50000.00" }),
    thumbnail: z.string().nullable().optional().openapi({ example: "https://res.cloudinary.com/xxx/image.jpg" }),
    thumbnail_public_id: z.string().nullable().optional().openapi({ example: "uploads/table-01" }),
    is_available: z.boolean().optional().openapi({ example: false }),
    is_active: z.boolean().optional().openapi({ example: false }),
  })
  .openapi("CreateBilliardTableRequest");

export const updateBilliardTableRequestSchema = z
  .object({
    table_type_id: z.number().int().min(1).optional().openapi({ example: 1 }),
    name: z.string().min(1).optional().openapi({ example: "Table 01 VIP" }),
    slug: z.string().min(1).optional().openapi({ example: "table-01-vip" }),
    price: z.string().min(1).optional().openapi({ example: "75000.00" }),
    thumbnail: z.string().nullable().optional().openapi({ example: "https://res.cloudinary.com/xxx/image_vip.jpg" }),
    thumbnail_public_id: z.string().nullable().optional().openapi({ example: "uploads/table-01-vip" }),
    is_available: z.boolean().optional().openapi({ example: true }),
    is_active: z.boolean().optional().openapi({ example: true }),
  })
  .openapi("UpdateBilliardTableRequest");

export type CreateBilliardTableRequestDto = z.infer<typeof createBilliardTableRequestSchema>;
export type UpdateBilliardTableRequestDto = z.infer<typeof updateBilliardTableRequestSchema>;
