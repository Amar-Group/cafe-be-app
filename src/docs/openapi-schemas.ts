import { z } from "@hono/zod-openapi";
import { timestampSchema } from "./openapi-common";

export const roleSchema = z
  .object({
    id: z.number().int().openapi({
      example: 1,
    }),
    code: z.string().openapi({
      example: "ADMIN",
    }),
    name: z.string().openapi({
      example: "Administrator",
    }),
    created_at: timestampSchema,
    updated_at: timestampSchema,
  })
  .openapi("Role");

export const menuSchema = z
  .object({
    id: z.number().int().openapi({
      example: 1,
    }),
    name: z.string().openapi({
      example: "Dashboard",
    }),
    path: z.string().openapi({
      example: "/dashboard",
    }),
    permission_path: z.string().nullable().openapi({
      example: null,
    }),
    icon: z.string().nullable().openapi({
      example: null,
    }),
    parent_id: z.number().int().nullable().openapi({
      example: null,
    }),
    created_at: timestampSchema,
    updated_at: timestampSchema,
  })
  .openapi("Menu");

export const userRoleSummarySchema = z
  .object({
    id: z.number().int().openapi({
      example: 1,
    }),
    code: z.string().openapi({
      example: "ADMIN",
    }),
    name: z.string().openapi({
      example: "Administrator",
    }),
  })
  .openapi("UserRoleSummary");

export const userSchema = z
  .object({
    id: z.number().int().openapi({
      example: 1,
    }),
    email: z.string().email().openapi({
      example: "admin@example.com",
    }),
    name: z.string().openapi({
      example: "Admin User",
    }),
    role_id: z.number().int().openapi({
      example: 1,
    }),
    created_at: timestampSchema,
    updated_at: timestampSchema,
    role: userRoleSummarySchema,
  })
  .openapi("User");

export const navigationPermissionSchema = z
  .object({
    can_read: z.boolean().openapi({
      example: true,
    }),
    can_create: z.boolean().openapi({
      example: true,
    }),
    can_update: z.boolean().openapi({
      example: true,
    }),
    can_delete: z.boolean().openapi({
      example: false,
    }),
    can_report: z.boolean().openapi({
      example: false,
    }),
  })
  .openapi("NavigationPermission");

export const navigationItemSchema: z.ZodTypeAny = z
  .object({
    id: z.number().int().openapi({
      example: 2,
    }),
    name: z.string().openapi({
      example: "Master Data",
    }),
    path: z.string().openapi({
      example: "/master-data",
    }),
    icon: z.string().nullable().openapi({
      example: null,
    }),
    parent_id: z.number().int().nullable().openapi({
      example: null,
    }),
    permissions: navigationPermissionSchema,
    children: z.array(z.lazy(() => navigationItemSchema)),
  })
  .openapi("NavigationItem");

export const rolePermissionSchema = z
  .object({
    id: z.number().int().openapi({
      example: 1,
    }),
    role_id: z.number().int().openapi({
      example: 1,
    }),
    menu_id: z.number().int().openapi({
      example: 2,
    }),
    can_read: z.boolean().openapi({
      example: true,
    }),
    can_create: z.boolean().openapi({
      example: true,
    }),
    can_update: z.boolean().openapi({
      example: true,
    }),
    can_delete: z.boolean().openapi({
      example: true,
    }),
    can_report: z.boolean().openapi({
      example: true,
    }),
    created_at: timestampSchema,
    updated_at: timestampSchema,
    role: userRoleSummarySchema,
    menu: z.object({
      id: z.number().int().openapi({
        example: 2,
      }),
      name: z.string().openapi({
        example: "Master Data",
      }),
      path: z.string().openapi({
        example: "/master-data",
      }),
      permission_path: z.string().nullable().openapi({
        example: null,
      }),
      icon: z.string().nullable().openapi({
        example: null,
      }),
      parent_id: z.number().int().nullable().openapi({
        example: null,
      }),
    }),
  })
  .openapi("RolePermission");

export const uploadSignatureResponseSchema = z
  .object({
    apiKey: z.string().openapi({
      example: "123456789012345",
    }),
    cloudName: z.string().openapi({
      example: "my-cloud",
    }),
    folder: z.string().openapi({
      example: "uploads",
    }),
    signature: z.string().openapi({
      example: "c1d2e3f4",
    }),
    timestamp: z.number().int().openapi({
      example: 1770000000,
    }),
    uploadUrl: z.string().url().openapi({
      example: "https://api.cloudinary.com/v1_1/my-cloud/image/upload",
    }),
  })
  .openapi("UploadSignatureResponse");

export const dishCategorySchema = z
  .object({
    id: z.number().int().openapi({
      example: 1,
    }),
    name: z.string().openapi({
      example: "Main Course",
    }),
    icon: z.string().nullable().openapi({
      example: "ph-bowl-food",
    }),
    created_at: timestampSchema,
    updated_at: timestampSchema,
  })
  .openapi("DishCategory");

export const dishSchema = z
  .object({
    id: z.number().int().openapi({
      example: 1,
    }),
    dish_category_id: z.number().int().openapi({
      example: 1,
    }),
    name: z.string().openapi({
      example: "Nasi Goreng Spesial",
    }),
    slug: z.string().openapi({
      example: "nasi-goreng-spesial",
    }),
    description: z.string().nullable().openapi({
      example: "Nasi goreng dengan telur dan ayam",
    }),
    price: z.string().openapi({
      example: "35000.00",
    }),
    thumbnail: z.string().nullable().openapi({
      example: "https://res.cloudinary.com/xxx/image.jpg",
    }),
    thumbnail_public_id: z.string().nullable().openapi({
      example: "uploads/dish-001",
    }),
    is_available: z.boolean().openapi({
      example: false,
    }),
    is_active: z.boolean().openapi({
      example: false,
    }),
    created_at: timestampSchema,
    updated_at: timestampSchema,
    category: z
      .object({
        id: z.number().int().nullable().openapi({ example: 1 }),
        name: z.string().nullable().openapi({ example: "Main Course" }),
        icon: z.string().nullable().openapi({ example: "ph-bowl-food" }),
      })
      .nullable(),
  })
  .openapi("Dish");

export const dishImageSchema = z
  .object({
    id: z.number().int().openapi({
      example: 1,
    }),
    dish_id: z.number().int().openapi({
      example: 1,
    }),
    image: z.string().openapi({
      example: "https://res.cloudinary.com/xxx/dish-001.jpg",
    }),
    image_public_id: z.string().openapi({
      example: "uploads/dish-001",
    }),
    created_at: timestampSchema,
    updated_at: timestampSchema,
  })
  .openapi("DishImage");

export const dishOrderSchema = z
  .object({
    id: z.number().int().openapi({
      example: 1,
    }),
    guest_name: z.string().openapi({
      example: "John Doe",
    }),
    guest_phone: z.string().openapi({
      example: "081234567890",
    }),
    total: z.string().openapi({
      example: "100000.00",
    }),
    tax: z.string().openapi({
      example: "11000.00",
    }),
    service_fee: z.string().openapi({
      example: "5000.00",
    }),
    nett_price: z.string().openapi({
      example: "116000.00",
    }),
    created_at: timestampSchema,
    updated_at: timestampSchema,
  })
  .openapi("DishOrder");

export const dishOrderDetailSchema = z
  .object({
    id: z.number().int().openapi({
      example: 1,
    }),
    dish_order_id: z.number().int().openapi({
      example: 1,
    }),
    dish_id: z.number().int().openapi({
      example: 1,
    }),
    quantity: z.number().int().openapi({
      example: 2,
    }),
    notes: z.string().nullable().openapi({
      example: "Extra pedas",
    }),
    status: z.enum(["pending", "confirmed", "preparing", "completed", "cancelled"]).openapi({
      example: "pending",
    }),
    created_at: timestampSchema,
    updated_at: timestampSchema,
    dish: z
      .object({
        id: z.number().int().nullable().openapi({ example: 1 }),
        name: z.string().nullable().openapi({ example: "Nasi Goreng Spesial" }),
        slug: z.string().nullable().openapi({ example: "nasi-goreng-spesial" }),
        price: z.string().nullable().openapi({ example: "35000.00" }),
        thumbnail: z.string().nullable().openapi({ example: "https://res.cloudinary.com/xxx/image.jpg" }),
      })
      .nullable(),
  })
  .openapi("DishOrderDetail");

export const billiardTableTypeSchema = z
  .object({
    id: z.number().int().openapi({
      example: 1,
    }),
    name: z.string().openapi({
      example: "Standard Pool",
    }),
    icon: z.string().nullable().openapi({
      example: "ph-billiards",
    }),
    description: z.string().nullable().openapi({
      example: "Meja billiard standar 8 ball",
    }),
    created_at: timestampSchema,
    updated_at: timestampSchema,
  })
  .openapi("BilliardTableType");

export const billiardTableSchema = z
  .object({
    id: z.number().int().openapi({
      example: 1,
    }),
    table_type_id: z.number().int().openapi({
      example: 1,
    }),
    name: z.string().openapi({
      example: "Table 01",
    }),
    slug: z.string().openapi({
      example: "table-01",
    }),
    price: z.string().openapi({
      example: "50000.00",
    }),
    thumbnail: z.string().nullable().openapi({
      example: "https://res.cloudinary.com/xxx/image.jpg",
    }),
    thumbnail_public_id: z.string().nullable().openapi({
      example: "uploads/table-01",
    }),
    is_available: z.boolean().openapi({
      example: false,
    }),
    is_active: z.boolean().openapi({
      example: false,
    }),
    created_at: timestampSchema,
    updated_at: timestampSchema,
    type: z
      .object({
        id: z.number().int().nullable().openapi({ example: 1 }),
        name: z.string().nullable().openapi({ example: "Standard Pool" }),
        icon: z.string().nullable().openapi({ example: "ph-billiards" }),
      })
      .nullable(),
  })
  .openapi("BilliardTable");

export const billiardTableImageSchema = z
  .object({
    id: z.number().int().openapi({
      example: 1,
    }),
    billiard_table_id: z.number().int().openapi({
      example: 1,
    }),
    image: z.string().openapi({
      example: "https://res.cloudinary.com/xxx/table-01.jpg",
    }),
    image_public_id: z.string().openapi({
      example: "uploads/table-01",
    }),
    created_at: timestampSchema,
    updated_at: timestampSchema,
  })
  .openapi("BilliardTableImage");

export const scheduleSchema = z
  .object({
    id: z.number().int().openapi({
      example: 1,
    }),
    start_time: z.string().openapi({
      example: "10:00:00",
    }),
    end_time: z.string().openapi({
      example: "11:00:00",
    }),
    created_at: timestampSchema,
    updated_at: timestampSchema,
  })
  .openapi("Schedule");

export const reservationSchema = z
  .object({
    id: z.number().int().openapi({
      example: 1,
    }),
    billiard_table_id: z.number().int().openapi({
      example: 1,
    }),
    guest_name: z.string().openapi({
      example: "John Doe",
    }),
    guest_phone: z.string().openapi({
      example: "081234567890",
    }),
    date: z.string().openapi({
      example: "2024-05-20",
    }),
    schedule_id: z.number().int().openapi({
      example: 1,
    }),
    guest_count: z.number().int().openapi({
      example: 4,
    }),
    notes: z.string().nullable().openapi({
      example: "Meja dekat jendela",
    }),
    status: z.enum(["pending", "confirmed", "preparing", "completed", "cancelled"]).openapi({
      example: "pending",
    }),
    created_at: timestampSchema,
    updated_at: timestampSchema,
    billiard_table: z
      .object({
        id: z.number().int().nullable().openapi({ example: 1 }),
        name: z.string().nullable().openapi({ example: "Table 01" }),
        slug: z.string().nullable().openapi({ example: "table-01" }),
        price: z.string().nullable().openapi({ example: "50000.00" }),
        thumbnail: z.string().nullable().openapi({ example: "https://res.cloudinary.com/xxx/image.jpg" }),
      })
      .nullable(),
    schedule: z
      .object({
        id: z.number().int().nullable().openapi({ example: 1 }),
        start_time: z.string().nullable().openapi({ example: "18:00:00" }),
        end_time: z.string().nullable().openapi({ example: "20:00:00" }),
      })
      .nullable(),
  })
  .openapi("Reservation");

export const paymentSchema = z
  .object({
    id: z.number().int().openapi({
      example: 1,
    }),
    type: z.enum(["dish_order", "reservation"]).openapi({
      example: "dish_order",
    }),
    dish_order_id: z.number().int().nullable().openapi({
      example: 1,
    }),
    reservation_id: z.number().int().nullable().openapi({
      example: null,
    }),
    method: z.enum(["qris", "bank_transfer", "cash", "ewallet", "credit_card"]).openapi({
      example: "qris",
    }),
    provider: z.enum(["midtrans", "xendit", "manual", "cashier"]).openapi({
      example: "midtrans",
    }),
    transaction_id: z.string().nullable().openapi({
      example: "TRX-123456",
    }),
    gross_amount: z.string().openapi({
      example: "116000.00",
    }),
    status: z.enum(["pending", "paid", "failed", "expired", "cancelled", "refunded"]).openapi({
      example: "pending",
    }),
    url: z.string().nullable().openapi({
      example: "https://midtrans.com/pay/123",
    }),
    snap_token: z.string().nullable().openapi({
      example: "snap-token-xyz",
    }),
    paid_at: z.string().nullable().openapi({
      example: "2024-05-20T18:05:00Z",
    }),
    expired_at: z.string().nullable().openapi({
      example: "2024-05-21T18:00:00Z",
    }),
    created_at: timestampSchema,
    updated_at: timestampSchema,
    dish_order: z
      .object({
        id: z.number().int().nullable().openapi({ example: 1 }),
        guest_name: z.string().nullable().openapi({ example: "John Doe" }),
        guest_phone: z.string().nullable().openapi({ example: "081234567890" }),
        nett_price: z.string().nullable().openapi({ example: "116000.00" }),
      })
      .nullable(),
    reservation: z
      .object({
        id: z.number().int().nullable().openapi({ example: 2 }),
        guest_name: z.string().nullable().openapi({ example: "Jane Doe" }),
        guest_phone: z.string().nullable().openapi({ example: "089876543210" }),
        date: z.string().nullable().openapi({ example: "2024-05-20" }),
        schedule_id: z.number().int().nullable().openapi({ example: 1 }),
      })
      .nullable(),
  })
  .openapi("Payment");

