import {
  int,
  varchar,
  datetime,
  boolean,
  mysqlTable,
  foreignKey,
  text,
  decimal,
  date,
  time,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm/sql/sql";

export const menus = mysqlTable(
  "menus",
  {
    id: int().primaryKey().autoincrement(),
    name: varchar({ length: 100 }).notNull(),
    path: varchar({ length: 255 }),
    permission_path: varchar({ length: 255 }),
    icon: varchar({ length: 255 }),
    is_visible: boolean().default(false),
    parent_id: int(),
    created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    parent_fk: foreignKey({
      columns: [table.parent_id],
      foreignColumns: [table.id],
    }),
  })
);

// Roles Table
export const roles = mysqlTable("roles", {
  id: int().primaryKey().autoincrement(),
  code: varchar({ length: 50 }).notNull().unique(),
  name: varchar({ length: 100 }).notNull(),
  created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Users Table
export const users = mysqlTable(
  "users",
  {
    id: int().primaryKey().autoincrement(),
    email: varchar({ length: 100 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    name: varchar({ length: 100 }).notNull(),
    role_id: int().notNull(),
    created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    role_fk: foreignKey({
      columns: [table.role_id],
      foreignColumns: [roles.id],
    }),
  })
);

// Role Permissions Table
export const role_permissions = mysqlTable(
  "role_permissions",
  {
    id: int().primaryKey().autoincrement(),
    role_id: int().notNull(),
    menu_id: int().notNull(),
    can_read: boolean().default(false),
    can_create: boolean().default(false),
    can_update: boolean().default(false),
    can_delete: boolean().default(false),
    can_report: boolean().default(false),
    created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    role_fk: foreignKey({
      columns: [table.role_id],
      foreignColumns: [roles.id],
    }),
    menu_fk: foreignKey({
      columns: [table.menu_id],
      foreignColumns: [menus.id],
    }),
  })
);

// ============================================
// Dish Management Tables
// ============================================

// Dish Categories Table
export const dish_categories = mysqlTable("dish_categories", {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 100 }).notNull(),
  icon: varchar({ length: 255 }),
  created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Dishes Table
export const dishes = mysqlTable(
  "dishes",
  {
    id: int().primaryKey().autoincrement(),
    dish_category_id: int().notNull(),
    name: varchar({ length: 150 }).notNull(),
    slug: varchar({ length: 200 }).notNull().unique(),
    description: text(),
    price: decimal({ precision: 12, scale: 2 }).notNull(),
    thumbnail: varchar({ length: 500 }),
    thumbnail_public_id: varchar({ length: 255 }),
    is_available: boolean().default(false).notNull(),
    is_active: boolean().default(false).notNull(),
    created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    category_fk: foreignKey({
      columns: [table.dish_category_id],
      foreignColumns: [dish_categories.id],
    }),
  })
);

// Dish Images Table
export const dish_images = mysqlTable(
  "dish_images",
  {
    id: int().primaryKey().autoincrement(),
    dish_id: int().notNull(),
    image: varchar({ length: 500 }).notNull(),
    image_public_id: varchar({ length: 255 }).notNull(),
    created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    dish_fk: foreignKey({
      columns: [table.dish_id],
      foreignColumns: [dishes.id],
    }),
  })
);

// Dish Orders Table
export const dish_orders = mysqlTable("dish_orders", {
  id: int().primaryKey().autoincrement(),
  guest_name: varchar({ length: 100 }).notNull(),
  guest_phone: varchar({ length: 20 }).notNull(),
  total: decimal({ precision: 14, scale: 2 }).notNull(),
  tax: decimal({ precision: 14, scale: 2 }).notNull(),
  service_fee: decimal({ precision: 14, scale: 2 }).notNull(),
  nett_price: decimal({ precision: 14, scale: 2 }).notNull(),
  created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Dish Order Details Table
export const dish_order_details = mysqlTable(
  "dish_order_details",
  {
    id: int().primaryKey().autoincrement(),
    dish_order_id: int().notNull(),
    dish_id: int().notNull(),
    quantity: int().notNull(),
    notes: text(),
    status: mysqlEnum(["pending", "confirmed", "preparing", "completed", "cancelled"])
      .default("pending")
      .notNull(),
    created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    order_fk: foreignKey({
      columns: [table.dish_order_id],
      foreignColumns: [dish_orders.id],
    }),
    dish_fk: foreignKey({
      columns: [table.dish_id],
      foreignColumns: [dishes.id],
    }),
  })
);

// ============================================
// Billiard Management Tables
// ============================================

// Billiard Table Types Table
export const billiard_table_types = mysqlTable("billiard_table_types", {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 100 }).notNull(),
  icon: varchar({ length: 255 }),
  description: text(),
  created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Billiard Tables Table
export const billiard_tables = mysqlTable(
  "billiard_tables",
  {
    id: int().primaryKey().autoincrement(),
    table_type_id: int().notNull(),
    name: varchar({ length: 150 }).notNull(),
    slug: varchar({ length: 200 }).notNull().unique(),
    price: decimal({ precision: 12, scale: 2 }).notNull(),
    thumbnail: varchar({ length: 500 }),
    thumbnail_public_id: varchar({ length: 255 }),
    is_available: boolean().default(false).notNull(),
    is_active: boolean().default(false).notNull(),
    created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    type_fk: foreignKey({
      columns: [table.table_type_id],
      foreignColumns: [billiard_table_types.id],
    }),
  })
);

// Billiard Table Images Table
export const billiard_table_images = mysqlTable(
  "billiard_table_images",
  {
    id: int().primaryKey().autoincrement(),
    billiard_table_id: int().notNull(),
    image: varchar({ length: 500 }).notNull(),
    image_public_id: varchar({ length: 255 }).notNull(),
    created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    table_fk: foreignKey({
      columns: [table.billiard_table_id],
      foreignColumns: [billiard_tables.id],
    }),
  })
);

// Schedules Table
export const schedules = mysqlTable("schedules", {
  id: int().primaryKey().autoincrement(),
  start_time: time().notNull(),
  end_time: time().notNull(),
  created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Reservations Table
export const reservations = mysqlTable(
  "reservations",
  {
    id: int().primaryKey().autoincrement(),
    billiard_table_id: int().notNull(),
    guest_name: varchar({ length: 100 }).notNull(),
    guest_phone: varchar({ length: 20 }).notNull(),
    date: date().notNull(),
    schedule_id: int().notNull(),
    guest_count: int().notNull(),
    notes: text(),
    status: mysqlEnum(["pending", "confirmed", "preparing", "completed", "cancelled"])
      .default("pending")
      .notNull(),
    created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    table_fk: foreignKey({
      columns: [table.billiard_table_id],
      foreignColumns: [billiard_tables.id],
    }),
    schedule_fk: foreignKey({
      columns: [table.schedule_id],
      foreignColumns: [schedules.id],
    }),
  })
);

// ============================================
// Payment Table
// ============================================

// Payments Table
export const payments = mysqlTable(
  "payments",
  {
    id: int().primaryKey().autoincrement(),
    type: mysqlEnum(["dish_order", "reservation"]).notNull(),
    dish_order_id: int(),
    reservation_id: int(),
    method: mysqlEnum(["qris", "bank_transfer", "cash", "ewallet", "credit_card"]).notNull(),
    provider: mysqlEnum(["midtrans", "xendit", "manual", "cashier"]).notNull(),
    transaction_id: varchar({ length: 255 }),
    gross_amount: decimal({ precision: 14, scale: 2 }).notNull(),
    status: mysqlEnum(["pending", "paid", "failed", "expired", "cancelled", "refunded"])
      .default("pending")
      .notNull(),
    url: varchar({ length: 500 }),
    snap_token: varchar({ length: 255 }),
    paid_at: datetime(),
    expired_at: datetime(),
    created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    dish_order_fk: foreignKey({
      columns: [table.dish_order_id],
      foreignColumns: [dish_orders.id],
    }),
    reservation_fk: foreignKey({
      columns: [table.reservation_id],
      foreignColumns: [reservations.id],
    }),
  })
);
