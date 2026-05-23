import { z } from "@hono/zod-openapi";

export const createDishImageRequestSchema = z
  .object({
    dish_id: z.number().int().min(1).openapi({ example: 1 }),
    image: z.string().min(1).openapi({ example: "https://res.cloudinary.com/xxx/dish-001.jpg" }),
    image_public_id: z.string().min(1).openapi({ example: "uploads/dish-001" }),
  })
  .openapi("CreateDishImageRequest");

export const updateDishImageRequestSchema = z
  .object({
    dish_id: z.number().int().min(1).optional().openapi({ example: 1 }),
    image: z.string().min(1).optional().openapi({ example: "https://res.cloudinary.com/xxx/dish-002.jpg" }),
    image_public_id: z.string().min(1).optional().openapi({ example: "uploads/dish-002" }),
  })
  .openapi("UpdateDishImageRequest");

export type CreateDishImageRequestDto = z.infer<typeof createDishImageRequestSchema>;
export type UpdateDishImageRequestDto = z.infer<typeof updateDishImageRequestSchema>;
