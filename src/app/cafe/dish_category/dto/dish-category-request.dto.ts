import { z } from "@hono/zod-openapi";

export const createDishCategoryRequestSchema = z
  .object({
    name: z.string().min(1).openapi({ example: "Main Course" }),
    icon: z.string().nullable().optional().openapi({ example: "ph-bowl-food" }),
  })
  .openapi("CreateDishCategoryRequest");

export const updateDishCategoryRequestSchema = z
  .object({
    name: z.string().min(1).optional().openapi({ example: "Appetizer" }),
    icon: z.string().nullable().optional().openapi({ example: "ph-cookie" }),
  })
  .openapi("UpdateDishCategoryRequest");

export type CreateDishCategoryRequestDto = z.infer<typeof createDishCategoryRequestSchema>;
export type UpdateDishCategoryRequestDto = z.infer<typeof updateDishCategoryRequestSchema>;
