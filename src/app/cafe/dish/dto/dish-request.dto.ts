import { z } from "@hono/zod-openapi";

export const createDishRequestSchema = z
  .object({
    dish_category_id: z.number().int().min(1).openapi({ example: 1 }),
    name: z.string().min(1).openapi({ example: "Nasi Goreng Spesial" }),
    slug: z.string().min(1).openapi({ example: "nasi-goreng-spesial" }),
    description: z.string().nullable().optional().openapi({ example: "Nasi goreng dengan telur dan ayam" }),
    price: z.string().min(1).openapi({ example: "35000.00" }),
    thumbnail: z.string().nullable().optional().openapi({ example: "https://res.cloudinary.com/xxx/image.jpg" }),
    thumbnail_public_id: z.string().nullable().optional().openapi({ example: "uploads/dish-001" }),
    is_available: z.boolean().optional().openapi({ example: false }),
    is_active: z.boolean().optional().openapi({ example: false }),
  })
  .openapi("CreateDishRequest");

export const updateDishRequestSchema = z
  .object({
    dish_category_id: z.number().int().min(1).optional().openapi({ example: 1 }),
    name: z.string().min(1).optional().openapi({ example: "Nasi Goreng Special" }),
    slug: z.string().min(1).optional().openapi({ example: "nasi-goreng-special" }),
    description: z.string().nullable().optional().openapi({ example: "Nasi goreng premium" }),
    price: z.string().min(1).optional().openapi({ example: "40000.00" }),
    thumbnail: z.string().nullable().optional().openapi({ example: "https://res.cloudinary.com/xxx/image.jpg" }),
    thumbnail_public_id: z.string().nullable().optional().openapi({ example: "uploads/dish-001" }),
    is_available: z.boolean().optional().openapi({ example: true }),
    is_active: z.boolean().optional().openapi({ example: true }),
  })
  .openapi("UpdateDishRequest");

export type CreateDishRequestDto = z.infer<typeof createDishRequestSchema>;
export type UpdateDishRequestDto = z.infer<typeof updateDishRequestSchema>;
