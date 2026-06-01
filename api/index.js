var __defProp = Object.defineProperty;
var __returnValue = (v) => v;
function __exportSetter(name, newValue) {
  this[name] = __returnValue.bind(null, newValue);
}
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: __exportSetter.bind(all, name)
    });
};

// src/index.ts
import { Hono } from "hono";
import { logger } from "hono/logger";

// src/middleware/appToken.ts
var appTokenMiddleware = async (c, next) => {
  const appToken = c.req.header("X-App-Token");
  const expectedToken = process.env.APP_TOKEN;
  if (!appToken) {
    return c.json({
      success: false,
      message: "Unauthorized - Missing X-App-Token header"
    }, 401);
  }
  if (appToken !== expectedToken) {
    return c.json({
      success: false,
      message: "Unauthorized - Invalid app token"
    }, 401);
  }
  await next();
};
var loggerMiddleware = async (c, next) => {
  const method = c.req.method;
  const path = c.req.path;
  const start = Date.now();
  console.log(`[${new Date().toISOString()}] ${method} ${path}`);
  await next();
  const duration = Date.now() - start;
  console.log(`OK ${method} ${path} - ${duration}ms`);
};

// src/middleware/originGuard.ts
import { cors } from "hono/cors";
function normalizeOrigin(origin) {
  return origin.trim().replace(/\/+$/, "");
}
var allowedOrigins = (process.env.ALLOWED_APP_URL ?? "").split(",").map((origin) => normalizeOrigin(origin)).filter(Boolean);
function getRequestOrigin(c) {
  const origin = c.req.header("origin");
  if (origin) {
    return origin;
  }
  const referer = c.req.header("referer");
  if (!referer) {
    return;
  }
  try {
    return normalizeOrigin(new URL(referer).origin);
  } catch {
    return;
  }
}
function getServerOrigin(c) {
  try {
    return normalizeOrigin(new URL(c.req.url).origin);
  } catch {
    return;
  }
}
var originGuard = async (c, next) => {
  if (allowedOrigins.length === 0) {
    await next();
    return;
  }
  const requestOrigin = getRequestOrigin(c);
  const normalizedRequestOrigin = requestOrigin ? normalizeOrigin(requestOrigin) : undefined;
  const serverOrigin = getServerOrigin(c);
  if (!normalizedRequestOrigin) {
    await next();
    return;
  }
  if (serverOrigin && normalizedRequestOrigin === serverOrigin) {
    await next();
    return;
  }
  if (!allowedOrigins.includes(normalizedRequestOrigin)) {
    return c.json({
      success: false,
      message: "Forbidden origin"
    }, 403);
  }
  await next();
};
var corsMiddleware = cors({
  origin: (origin) => {
    if (!origin) {
      return "";
    }
    const normalizedOrigin = normalizeOrigin(origin);
    if (allowedOrigins.length === 0) {
      return normalizedOrigin;
    }
    return allowedOrigins.includes(normalizedOrigin) ? normalizedOrigin : "";
  },
  allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization", "X-App-Token"],
  credentials: true
});

// src/middleware/errorHandler.ts
import { HTTPException } from "hono/http-exception";
var notFoundHandler = (c) => {
  return c.json({
    success: false,
    message: `Route not found: ${c.req.path}`
  }, 404);
};
var errorHandler = (err, c) => {
  console.error("[Error Handler]", err);
  if (err instanceof HTTPException) {
    return c.json({
      success: false,
      message: err.message
    }, err.status);
  }
  return c.json({
    success: false,
    message: err.message || "Internal server error",
    stack: err.stack
  }, 500);
};

// src/app/user/service/user-auth.service.ts
import { compare } from "bcryptjs";

// src/utils/jwt.ts
import jwt from "jsonwebtoken";
var JWT_SECRET = process.env.JWT_SECRET;
function generateToken(payload, expiresIn = "24h") {
  try {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn });
    return token;
  } catch (error) {
    throw new Error(`Failed to generate token: ${error}`);
  }
}
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

// src/app/user/repository/user-read.repository.ts
import { eq } from "drizzle-orm";

// src/db/connection.ts
import"dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";

// src/db/schema.ts
var exports_schema = {};
__export(exports_schema, {
  users: () => users,
  schedules: () => schedules,
  roles: () => roles,
  role_permissions: () => role_permissions,
  reservations: () => reservations,
  payments: () => payments,
  menus: () => menus,
  dishes: () => dishes,
  dish_orders: () => dish_orders,
  dish_order_details: () => dish_order_details,
  dish_images: () => dish_images,
  dish_categories: () => dish_categories,
  billiard_tables: () => billiard_tables,
  billiard_table_types: () => billiard_table_types,
  billiard_table_images: () => billiard_table_images
});
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
  mysqlEnum
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm/sql/sql";
var menus = mysqlTable("menus", {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 100 }).notNull(),
  path: varchar({ length: 255 }),
  permission_path: varchar({ length: 255 }),
  icon: varchar({ length: 255 }),
  is_visible: boolean().default(false),
  parent_id: int(),
  created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull()
}, (table) => ({
  parent_fk: foreignKey({
    columns: [table.parent_id],
    foreignColumns: [table.id]
  })
}));
var roles = mysqlTable("roles", {
  id: int().primaryKey().autoincrement(),
  code: varchar({ length: 50 }).notNull().unique(),
  name: varchar({ length: 100 }).notNull(),
  created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull()
});
var users = mysqlTable("users", {
  id: int().primaryKey().autoincrement(),
  email: varchar({ length: 100 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 100 }).notNull(),
  role_id: int().notNull(),
  created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull()
}, (table) => ({
  role_fk: foreignKey({
    columns: [table.role_id],
    foreignColumns: [roles.id]
  })
}));
var role_permissions = mysqlTable("role_permissions", {
  id: int().primaryKey().autoincrement(),
  role_id: int().notNull(),
  menu_id: int().notNull(),
  can_read: boolean().default(false),
  can_create: boolean().default(false),
  can_update: boolean().default(false),
  can_delete: boolean().default(false),
  can_report: boolean().default(false),
  created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull()
}, (table) => ({
  role_fk: foreignKey({
    columns: [table.role_id],
    foreignColumns: [roles.id]
  }),
  menu_fk: foreignKey({
    columns: [table.menu_id],
    foreignColumns: [menus.id]
  })
}));
var dish_categories = mysqlTable("dish_categories", {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 100 }).notNull(),
  icon: varchar({ length: 255 }),
  created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull()
});
var dishes = mysqlTable("dishes", {
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
  updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull()
}, (table) => ({
  category_fk: foreignKey({
    columns: [table.dish_category_id],
    foreignColumns: [dish_categories.id]
  })
}));
var dish_images = mysqlTable("dish_images", {
  id: int().primaryKey().autoincrement(),
  dish_id: int().notNull(),
  image: varchar({ length: 500 }).notNull(),
  image_public_id: varchar({ length: 255 }).notNull(),
  created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull()
}, (table) => ({
  dish_fk: foreignKey({
    columns: [table.dish_id],
    foreignColumns: [dishes.id]
  })
}));
var dish_orders = mysqlTable("dish_orders", {
  id: int().primaryKey().autoincrement(),
  guest_name: varchar({ length: 100 }).notNull(),
  guest_phone: varchar({ length: 20 }).notNull(),
  total: decimal({ precision: 14, scale: 2 }).notNull(),
  tax: decimal({ precision: 14, scale: 2 }).notNull(),
  service_fee: decimal({ precision: 14, scale: 2 }).notNull(),
  nett_price: decimal({ precision: 14, scale: 2 }).notNull(),
  status: mysqlEnum(["pending", "confirmed", "preparing", "completed", "cancelled"]).default("pending").notNull(),
  created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull()
});
var dish_order_details = mysqlTable("dish_order_details", {
  id: int().primaryKey().autoincrement(),
  dish_order_id: int().notNull(),
  dish_id: int().notNull(),
  quantity: int().notNull(),
  notes: text(),
  created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull()
}, (table) => ({
  order_fk: foreignKey({
    columns: [table.dish_order_id],
    foreignColumns: [dish_orders.id]
  }),
  dish_fk: foreignKey({
    columns: [table.dish_id],
    foreignColumns: [dishes.id]
  })
}));
var billiard_table_types = mysqlTable("billiard_table_types", {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 100 }).notNull(),
  icon: varchar({ length: 255 }),
  description: text(),
  created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull()
});
var billiard_tables = mysqlTable("billiard_tables", {
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
  updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull()
}, (table) => ({
  type_fk: foreignKey({
    columns: [table.table_type_id],
    foreignColumns: [billiard_table_types.id]
  })
}));
var billiard_table_images = mysqlTable("billiard_table_images", {
  id: int().primaryKey().autoincrement(),
  billiard_table_id: int().notNull(),
  image: varchar({ length: 500 }).notNull(),
  image_public_id: varchar({ length: 255 }).notNull(),
  created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull()
}, (table) => ({
  table_fk: foreignKey({
    columns: [table.billiard_table_id],
    foreignColumns: [billiard_tables.id]
  })
}));
var schedules = mysqlTable("schedules", {
  id: int().primaryKey().autoincrement(),
  start_time: time().notNull(),
  end_time: time().notNull(),
  created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull()
});
var reservations = mysqlTable("reservations", {
  id: int().primaryKey().autoincrement(),
  billiard_table_id: int().notNull(),
  guest_name: varchar({ length: 100 }).notNull(),
  guest_phone: varchar({ length: 20 }).notNull(),
  date: date().notNull(),
  schedule_id: int().notNull(),
  guest_count: int().notNull(),
  notes: text(),
  status: mysqlEnum(["pending", "confirmed", "preparing", "completed", "cancelled"]).default("pending").notNull(),
  created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull()
}, (table) => ({
  table_fk: foreignKey({
    columns: [table.billiard_table_id],
    foreignColumns: [billiard_tables.id]
  }),
  schedule_fk: foreignKey({
    columns: [table.schedule_id],
    foreignColumns: [schedules.id]
  })
}));
var payments = mysqlTable("payments", {
  id: int().primaryKey().autoincrement(),
  type: mysqlEnum(["dish_order", "reservation"]).notNull(),
  dish_order_id: int(),
  reservation_id: int(),
  method: mysqlEnum(["qris", "bank_transfer", "cash", "ewallet", "credit_card"]).notNull(),
  provider: mysqlEnum(["midtrans", "xendit", "manual", "cashier"]).notNull(),
  transaction_id: varchar({ length: 255 }),
  gross_amount: decimal({ precision: 14, scale: 2 }).notNull(),
  status: mysqlEnum(["pending", "paid", "failed", "expired", "cancelled", "refunded"]).default("pending").notNull(),
  url: varchar({ length: 500 }),
  snap_token: varchar({ length: 255 }),
  paid_at: datetime(),
  expired_at: datetime(),
  created_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: datetime().default(sql`CURRENT_TIMESTAMP`).notNull()
}, (table) => ({
  dish_order_fk: foreignKey({
    columns: [table.dish_order_id],
    foreignColumns: [dish_orders.id]
  }),
  reservation_fk: foreignKey({
    columns: [table.reservation_id],
    foreignColumns: [reservations.id]
  })
}));

// src/db/connection.ts
var databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}
var db = drizzle(databaseUrl, {
  schema: exports_schema,
  mode: "default"
});
// src/app/user/repository/user-read.repository.ts
var userWithRelationsSelect = {
  id: users.id,
  email: users.email,
  name: users.name,
  role_id: users.role_id,
  created_at: users.created_at,
  updated_at: users.updated_at,
  role_ref_id: roles.id,
  role_code: roles.code,
  role_name: roles.name
};
function mapUserWithRelations(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role_id: user.role_id,
    created_at: user.created_at,
    updated_at: user.updated_at,
    role: {
      id: user.role_ref_id,
      code: user.role_code,
      name: user.role_name
    }
  };
}

class UserReadRepository {
  static async getAllUsers() {
    try {
      const result = await db.select(userWithRelationsSelect).from(users).innerJoin(roles, eq(users.role_id, roles.id));
      return result.map(mapUserWithRelations);
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error}`);
    }
  }
  static async getUserById(id) {
    try {
      const result = await db.select(userWithRelationsSelect).from(users).innerJoin(roles, eq(users.role_id, roles.id)).where(eq(users.id, id)).limit(1);
      return result[0] ? mapUserWithRelations(result[0]) : null;
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error}`);
    }
  }
  static async getUserByEmail(email) {
    try {
      const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error}`);
    }
  }
}

// src/app/user/service/user-auth.service.ts
class UserAuthService {
  static async login(email, password) {
    const user = await UserReadRepository.getUserByEmail(email);
    if (!user) {
      return null;
    }
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role_id: user.role_id
    });
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role_id: user.role_id
      }
    };
  }
}

// src/app/user/controller/user-auth.controller.ts
class UserAuthController {
  static async login(c) {
    const body = await c.req.json();
    const loginResult = await UserAuthService.login(body.email, body.password);
    if (!loginResult) {
      return c.json({ success: false, message: "Invalid email or password" }, 401);
    }
    return c.json({
      success: true,
      data: loginResult,
      message: "Login successful"
    });
  }
}

// src/app/user/repository/user-navigation.repository.ts
import { eq as eq2 } from "drizzle-orm";
var navigationPermissionSelect = {
  id: menus.id,
  name: menus.name,
  path: menus.path,
  icon: menus.icon,
  is_visible: menus.is_visible,
  parent_id: menus.parent_id,
  can_read: role_permissions.can_read,
  can_create: role_permissions.can_create,
  can_update: role_permissions.can_update,
  can_delete: role_permissions.can_delete,
  can_report: role_permissions.can_report
};
function buildNavigationTree(accessibleMenus, allMenus) {
  if (accessibleMenus.length === 0) {
    return [];
  }
  const allMenuMap = new Map(allMenus.map((menu) => [menu.id, menu]));
  const navigationMap = new Map;
  const upsertMenu = (menu, permissions) => {
    const existing = navigationMap.get(menu.id);
    if (existing) {
      if (permissions) {
        existing.permissions = {
          can_read: existing.permissions.can_read || Boolean(permissions.can_read),
          can_create: existing.permissions.can_create || Boolean(permissions.can_create),
          can_update: existing.permissions.can_update || Boolean(permissions.can_update),
          can_delete: existing.permissions.can_delete || Boolean(permissions.can_delete),
          can_report: existing.permissions.can_report || Boolean(permissions.can_report)
        };
      }
      return existing;
    }
    const navigationItem = {
      id: menu.id,
      name: menu.name,
      path: menu.path,
      icon: menu.icon,
      is_visible: menu.is_visible,
      parent_id: menu.parent_id,
      permissions: {
        can_read: Boolean(permissions?.can_read),
        can_create: Boolean(permissions?.can_create),
        can_update: Boolean(permissions?.can_update),
        can_delete: Boolean(permissions?.can_delete),
        can_report: Boolean(permissions?.can_report)
      },
      children: []
    };
    navigationMap.set(menu.id, navigationItem);
    return navigationItem;
  };
  for (const item of accessibleMenus) {
    upsertMenu(item, {
      can_read: item.can_read ?? false,
      can_create: item.can_create ?? false,
      can_update: item.can_update ?? false,
      can_delete: item.can_delete ?? false,
      can_report: item.can_report ?? false
    });
    let currentParentId = item.parent_id;
    while (currentParentId !== null) {
      const parentMenu = allMenuMap.get(currentParentId);
      if (!parentMenu) {
        break;
      }
      upsertMenu(parentMenu);
      currentParentId = parentMenu.parent_id;
    }
  }
  const treeMap = new Map;
  const roots = [];
  for (const item of navigationMap.values()) {
    treeMap.set(item.id, {
      ...item,
      children: []
    });
  }
  for (const item of treeMap.values()) {
    if (item.parent_id !== null) {
      const parent = treeMap.get(item.parent_id);
      if (parent) {
        parent.children.push(item);
        continue;
      }
    }
    roots.push(item);
  }
  sortNavigationTree(roots);
  return roots;
}
function sortNavigationTree(items) {
  items.sort((a, b) => a.id - b.id);
  for (const item of items) {
    if (item.children.length > 0) {
      sortNavigationTree(item.children);
    }
  }
}

class UserNavigationRepository {
  static async getNavigationByRoleId(roleId) {
    try {
      const result = await db.select(navigationPermissionSelect).from(role_permissions).innerJoin(menus, eq2(role_permissions.menu_id, menus.id)).where(eq2(role_permissions.role_id, roleId));
      const accessibleMenus = result.filter((item) => Boolean(item.can_read || item.can_create || item.can_update || item.can_delete || item.can_report));
      const allMenus = await db.select().from(menus);
      return buildNavigationTree(accessibleMenus, allMenus);
    } catch (error) {
      throw new Error(`Failed to fetch navigation menus: ${error}`);
    }
  }
}

// src/app/user/service/user-navigation.service.ts
class UserNavigationService {
  static async getNavigation(user) {
    if (!user?.role_id) {
      return null;
    }
    return UserNavigationRepository.getNavigationByRoleId(user.role_id);
  }
}

// src/app/user/controller/user-navigation.controller.ts
class UserNavigationController {
  static async getNavigation(c) {
    const user = c.get("user");
    const navigation = await UserNavigationService.getNavigation(user);
    if (!navigation) {
      return c.json({
        success: false,
        message: "Unauthorized - User role not found"
      }, 401);
    }
    return c.json({
      success: true,
      data: navigation,
      message: "Navigation fetched successfully"
    });
  }
}

// src/app/user/service/user.service.ts
import { hash } from "bcryptjs";

// src/app/user/repository/user-write.repository.ts
import { eq as eq3 } from "drizzle-orm";
class UserWriteRepository {
  static async createUser(userData) {
    try {
      return await db.insert(users).values({
        ...userData
      });
    } catch (error) {
      throw new Error(`Failed to create user: ${error}`);
    }
  }
  static async updateUser(id, userData) {
    try {
      return await db.update(users).set({
        ...userData,
        updated_at: new Date
      }).where(eq3(users.id, id));
    } catch (error) {
      throw new Error(`Failed to update user: ${error}`);
    }
  }
  static async deleteUser(id) {
    try {
      return await db.delete(users).where(eq3(users.id, id));
    } catch (error) {
      throw new Error(`Failed to delete user: ${error}`);
    }
  }
}

// src/app/user/service/user.service.ts
class UserService {
  static async getAllUsers() {
    return UserReadRepository.getAllUsers();
  }
  static async getUserById(id) {
    return UserReadRepository.getUserById(id);
  }
  static async createUser(payload) {
    const existingUser = await UserReadRepository.getUserByEmail(payload.email);
    if (existingUser) {
      return { conflict: true };
    }
    const hashedPassword = await hash(payload.password, 10);
    const result = await UserWriteRepository.createUser({
      ...payload,
      password: hashedPassword
    });
    return { conflict: false, result };
  }
  static async updateUser(id, payload) {
    const user = await UserReadRepository.getUserById(id);
    if (!user) {
      return null;
    }
    const updateData = { ...payload };
    if (payload.password) {
      updateData.password = await hash(payload.password, 10);
    }
    const result = await UserWriteRepository.updateUser(id, updateData);
    return { user, result };
  }
  static async deleteUser(id) {
    const user = await UserReadRepository.getUserById(id);
    if (!user) {
      return null;
    }
    const result = await UserWriteRepository.deleteUser(id);
    return { user, result };
  }
}

// src/app/user/controller/user.controller.ts
class UserController {
  static async getAll(c) {
    const users2 = await UserService.getAllUsers();
    return c.json({
      success: true,
      data: users2,
      message: "Users fetched successfully"
    });
  }
  static async getById(c) {
    const id = Number(c.req.param("id"));
    const user = await UserService.getUserById(id);
    if (!user) {
      return c.json({ success: false, message: "User not found" }, 404);
    }
    return c.json({
      success: true,
      data: user,
      message: "User fetched successfully"
    });
  }
  static async create(c) {
    const body = await c.req.json();
    const createResult = await UserService.createUser(body);
    if (createResult.conflict) {
      return c.json({ success: false, message: "Email already registered" }, 400);
    }
    return c.json({
      success: true,
      data: createResult.result,
      message: "User created successfully"
    }, 201);
  }
  static async update(c) {
    const id = Number(c.req.param("id"));
    const body = await c.req.json();
    const updateResult = await UserService.updateUser(id, body);
    if (!updateResult) {
      return c.json({ success: false, message: "User not found" }, 404);
    }
    return c.json({
      success: true,
      data: updateResult.result,
      message: "User updated successfully"
    });
  }
  static async delete(c) {
    const id = Number(c.req.param("id"));
    const deleteResult = await UserService.deleteUser(id);
    if (!deleteResult) {
      return c.json({ success: false, message: "User not found" }, 404);
    }
    return c.json({
      success: true,
      data: deleteResult.result,
      message: "User deleted successfully"
    });
  }
}

// src/docs/openapi-common.ts
import { OpenAPIHono, z } from "@hono/zod-openapi";
var protectedSecurity = [
  { BearerAuth: [], AppToken: [] }
];
var timestampSchema = z.string().datetime().openapi({
  example: "2026-04-27T10:00:00.000Z"
});
var writeResultSchema = z.object({
  affectedRows: z.number().int().optional().openapi({
    example: 1
  }),
  insertId: z.number().int().optional().openapi({
    example: 1
  }),
  warningStatus: z.number().int().optional().openapi({
    example: 0
  })
}).catchall(z.any()).openapi("WriteResult");
var apiErrorResponseSchema = z.object({
  success: z.literal(false).openapi({
    example: false
  }),
  message: z.string().openapi({
    example: "Validation error"
  }),
  errors: z.any().optional().openapi({
    example: {
      formErrors: [],
      fieldErrors: {
        field: ["Required"]
      }
    }
  })
}).openapi("ApiErrorResponse");
function createSuccessEnvelopeSchema(name, dataSchema, messageExample) {
  return z.object({
    success: z.literal(true).openapi({
      example: true
    }),
    data: dataSchema,
    message: z.string().openapi({
      example: messageExample
    })
  }).openapi(name);
}
function createNumericPathParamsSchema(name, example = 1) {
  return z.object({
    [name]: z.coerce.number().int().positive().openapi({
      param: {
        name,
        in: "path"
      },
      example
    })
  });
}
function createCoercedIntSchema(example) {
  return z.coerce.number().int().openapi({
    example
  });
}
function createOptionalCoercedIntSchema(example) {
  return z.preprocess((value) => value === "" || value === null || typeof value === "undefined" ? undefined : value, z.coerce.number().int().optional()).openapi({
    example
  });
}
function createNullableOptionalCoercedIntSchema(example = null) {
  return z.preprocess((value) => value === "" || typeof value === "undefined" ? null : value, z.coerce.number().int().nullable().optional()).openapi({
    example
  });
}
function jsonContent(schema2) {
  return {
    "application/json": {
      schema: schema2
    }
  };
}
function jsonResponse(schema2, description) {
  return {
    description,
    content: jsonContent(schema2)
  };
}
var errorResponses = {
  400: jsonResponse(apiErrorResponseSchema, "Validation error"),
  401: jsonResponse(apiErrorResponseSchema, "Unauthorized"),
  403: jsonResponse(apiErrorResponseSchema, "Forbidden"),
  404: jsonResponse(apiErrorResponseSchema, "Resource not found"),
  500: jsonResponse(apiErrorResponseSchema, "Internal server error")
};
function createOpenApiRouter() {
  return new OpenAPIHono({
    defaultHook: (result, c) => {
      if (result.success === false) {
        return c.json({
          success: false,
          message: "Validation error",
          errors: result.error.flatten()
        }, 400);
      }
    }
  });
}
function registerDefaultSecuritySchemes(router) {
  router.openAPIRegistry.registerComponent("securitySchemes", "BearerAuth", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    description: "JWT token from POST /api/users/login"
  });
  router.openAPIRegistry.registerComponent("securitySchemes", "AppToken", {
    type: "apiKey",
    in: "header",
    name: "X-App-Token",
    description: "Application token defined in APP_TOKEN"
  });
}
function registerOpenApiRoute(router, route, handler) {
  return router.openapi(route, handler);
}
function createModuleOpenApiDocument(router, baseUrl, title) {
  return router.getOpenAPIDocument({
    openapi: "3.0.3",
    info: {
      title,
      version: "1.0.0"
    },
    servers: [
      {
        url: baseUrl,
        description: "Current server"
      }
    ]
  });
}

// src/app/user/route/user.openapi.ts
import { createRoute } from "@hono/zod-openapi";

// src/middleware/auth.ts
var jwtMiddleware = async (c, next) => {
  const authorization = c.req.header("Authorization");
  if (!authorization) {
    return c.json({
      success: false,
      message: "Unauthorized - Missing authorization header"
    }, 401);
  }
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : authorization;
  if (!token) {
    return c.json({
      success: false,
      message: "Unauthorized - Missing token"
    }, 401);
  }
  const payload = verifyToken(token);
  if (!payload) {
    return c.json({
      success: false,
      message: "Unauthorized - Invalid or expired token"
    }, 401);
  }
  c.set("user", payload);
  await next();
};

// src/app/role_permission/repository/role-permission-read.repository.ts
import { and, eq as eq4 } from "drizzle-orm";
class RolePermissionReadRepository {
  static async getAllRolePermissions() {
    try {
      return await db.select({
        id: role_permissions.id,
        role_id: role_permissions.role_id,
        menu_id: role_permissions.menu_id,
        can_read: role_permissions.can_read,
        can_create: role_permissions.can_create,
        can_update: role_permissions.can_update,
        can_delete: role_permissions.can_delete,
        can_report: role_permissions.can_report,
        created_at: role_permissions.created_at,
        updated_at: role_permissions.updated_at,
        role_ref_id: roles.id,
        role_code: roles.code,
        role_name: roles.name,
        menu_ref_id: menus.id,
        menu_name: menus.name,
        menu_path: menus.path,
        menu_permission_path: menus.permission_path,
        menu_icon: menus.icon,
        menu_parent_id: menus.parent_id
      }).from(role_permissions).innerJoin(roles, eq4(role_permissions.role_id, roles.id)).innerJoin(menus, eq4(role_permissions.menu_id, menus.id));
    } catch (error) {
      throw new Error(`Failed to fetch role permissions: ${error}`);
    }
  }
  static async getRolePermissionById(id) {
    try {
      const result = await db.select({
        id: role_permissions.id,
        role_id: role_permissions.role_id,
        menu_id: role_permissions.menu_id,
        can_read: role_permissions.can_read,
        can_create: role_permissions.can_create,
        can_update: role_permissions.can_update,
        can_delete: role_permissions.can_delete,
        can_report: role_permissions.can_report,
        created_at: role_permissions.created_at,
        updated_at: role_permissions.updated_at,
        role_ref_id: roles.id,
        role_code: roles.code,
        role_name: roles.name,
        menu_ref_id: menus.id,
        menu_name: menus.name,
        menu_path: menus.path,
        menu_permission_path: menus.permission_path,
        menu_icon: menus.icon,
        menu_parent_id: menus.parent_id
      }).from(role_permissions).innerJoin(roles, eq4(role_permissions.role_id, roles.id)).innerJoin(menus, eq4(role_permissions.menu_id, menus.id)).where(eq4(role_permissions.id, id)).limit(1);
      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch role permission: ${error}`);
    }
  }
  static async getPermissionsByRoleId(roleId) {
    try {
      return await db.select({
        id: role_permissions.id,
        role_id: role_permissions.role_id,
        menu_id: role_permissions.menu_id,
        can_read: role_permissions.can_read,
        can_create: role_permissions.can_create,
        can_update: role_permissions.can_update,
        can_delete: role_permissions.can_delete,
        can_report: role_permissions.can_report,
        created_at: role_permissions.created_at,
        updated_at: role_permissions.updated_at,
        role_ref_id: roles.id,
        role_code: roles.code,
        role_name: roles.name,
        menu_ref_id: menus.id,
        menu_name: menus.name,
        menu_path: menus.path,
        menu_permission_path: menus.permission_path,
        menu_icon: menus.icon,
        menu_parent_id: menus.parent_id
      }).from(role_permissions).innerJoin(roles, eq4(role_permissions.role_id, roles.id)).innerJoin(menus, eq4(role_permissions.menu_id, menus.id)).where(eq4(role_permissions.role_id, roleId));
    } catch (error) {
      throw new Error(`Failed to fetch role permissions: ${error}`);
    }
  }
  static async getPermissionByRoleIdAndPermissionPath(roleId, permissionPath) {
    try {
      const result = await db.select({
        can_read: role_permissions.can_read,
        can_create: role_permissions.can_create,
        can_update: role_permissions.can_update,
        can_delete: role_permissions.can_delete,
        can_report: role_permissions.can_report
      }).from(role_permissions).innerJoin(menus, eq4(role_permissions.menu_id, menus.id)).where(and(eq4(role_permissions.role_id, roleId), eq4(menus.permission_path, permissionPath)));
      if (result.length === 0) {
        return null;
      }
      return result.reduce((acc, item) => ({
        can_read: acc.can_read || Boolean(item.can_read),
        can_create: acc.can_create || Boolean(item.can_create),
        can_update: acc.can_update || Boolean(item.can_update),
        can_delete: acc.can_delete || Boolean(item.can_delete),
        can_report: acc.can_report || Boolean(item.can_report)
      }), {
        can_read: false,
        can_create: false,
        can_update: false,
        can_delete: false,
        can_report: false
      });
    } catch (error) {
      throw new Error(`Failed to fetch role permission: ${error}`);
    }
  }
}

// src/middleware/permission.ts
var methodToPermissionAction = {
  GET: "can_read",
  POST: "can_create",
  PUT: "can_update",
  PATCH: "can_update",
  DELETE: "can_delete"
};
function resolvePermissionPath(requestPath) {
  const segments = requestPath.split("/").filter(Boolean);
  if (segments.length === 0) {
    return null;
  }
  if (segments[0] === "api") {
    if (segments.length < 2) {
      return null;
    }
    return `/${segments[0]}/${segments[1]}`;
  }
  return `/${segments[0]}`;
}
var requirePermission = (action) => async (c, next) => {
  try {
    const user = c.get("user");
    if (!user?.role_id) {
      return c.json({
        success: false,
        message: "Unauthorized - User role not found"
      }, 401);
    }
    const resolvedAction = action ?? methodToPermissionAction[c.req.method];
    const permissionPath = resolvePermissionPath(c.req.path);
    if (!resolvedAction) {
      return c.json({
        success: false,
        message: `Permission action not configured for method ${c.req.method}`
      }, 500);
    }
    if (!permissionPath) {
      return c.json({
        success: false,
        message: `Permission path could not be resolved from ${c.req.path}`
      }, 500);
    }
    const permission = await RolePermissionReadRepository.getPermissionByRoleIdAndPermissionPath(user.role_id, permissionPath);
    if (!permission || !Boolean(permission[resolvedAction])) {
      return c.json({
        success: false,
        message: "Forbidden - You do not have permission to access this resource"
      }, 403);
    }
    await next();
  } catch (error) {
    return c.json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error"
    }, 500);
  }
};

// src/app/user/dto/user-request.dto.ts
import { z as z2 } from "@hono/zod-openapi";
var loginRequestSchema = z2.object({
  email: z2.string().email().openapi({ example: "admin@example.com" }),
  password: z2.string().min(1).openapi({ example: "admin123" })
}).openapi("LoginRequest");
var createUserRequestSchema = z2.object({
  email: z2.string().email().openapi({ example: "staff@example.com" }),
  password: z2.string().min(1).openapi({ example: "staff123" }),
  name: z2.string().min(1).openapi({ example: "Staff User" }),
  role_id: z2.coerce.number().int().openapi({ example: 2 })
}).openapi("CreateUserRequest");
var updateUserRequestSchema = z2.object({
  email: z2.string().email().optional().openapi({ example: "staff.updated@example.com" }),
  password: z2.string().min(1).optional().openapi({ example: "newpassword123" }),
  name: z2.string().min(1).optional().openapi({ example: "Staff User Update" }),
  role_id: createOptionalCoercedIntSchema(3)
}).openapi("UpdateUserRequest");

// src/app/user/dto/user-response.dto.ts
import { z as z4 } from "@hono/zod-openapi";

// src/docs/openapi-schemas.ts
import { z as z3 } from "@hono/zod-openapi";
var roleSchema = z3.object({
  id: z3.number().int().openapi({
    example: 1
  }),
  code: z3.string().openapi({
    example: "ADMIN"
  }),
  name: z3.string().openapi({
    example: "Administrator"
  }),
  created_at: timestampSchema,
  updated_at: timestampSchema
}).openapi("Role");
var menuSchema = z3.object({
  id: z3.number().int().openapi({
    example: 1
  }),
  name: z3.string().openapi({
    example: "Dashboard"
  }),
  path: z3.string().openapi({
    example: "/dashboard"
  }),
  permission_path: z3.string().nullable().openapi({
    example: null
  }),
  icon: z3.string().nullable().openapi({
    example: null
  }),
  parent_id: z3.number().int().nullable().openapi({
    example: null
  }),
  created_at: timestampSchema,
  updated_at: timestampSchema
}).openapi("Menu");
var userRoleSummarySchema = z3.object({
  id: z3.number().int().openapi({
    example: 1
  }),
  code: z3.string().openapi({
    example: "ADMIN"
  }),
  name: z3.string().openapi({
    example: "Administrator"
  })
}).openapi("UserRoleSummary");
var userSchema = z3.object({
  id: z3.number().int().openapi({
    example: 1
  }),
  email: z3.string().email().openapi({
    example: "admin@example.com"
  }),
  name: z3.string().openapi({
    example: "Admin User"
  }),
  role_id: z3.number().int().openapi({
    example: 1
  }),
  created_at: timestampSchema,
  updated_at: timestampSchema,
  role: userRoleSummarySchema
}).openapi("User");
var navigationPermissionSchema = z3.object({
  can_read: z3.boolean().openapi({
    example: true
  }),
  can_create: z3.boolean().openapi({
    example: true
  }),
  can_update: z3.boolean().openapi({
    example: true
  }),
  can_delete: z3.boolean().openapi({
    example: false
  }),
  can_report: z3.boolean().openapi({
    example: false
  })
}).openapi("NavigationPermission");
var navigationItemSchema = z3.object({
  id: z3.number().int().openapi({
    example: 2
  }),
  name: z3.string().openapi({
    example: "Master Data"
  }),
  path: z3.string().openapi({
    example: "/master-data"
  }),
  icon: z3.string().nullable().openapi({
    example: null
  }),
  parent_id: z3.number().int().nullable().openapi({
    example: null
  }),
  permissions: navigationPermissionSchema,
  children: z3.array(z3.lazy(() => navigationItemSchema))
}).openapi("NavigationItem");
var rolePermissionSchema = z3.object({
  id: z3.number().int().openapi({
    example: 1
  }),
  role_id: z3.number().int().openapi({
    example: 1
  }),
  menu_id: z3.number().int().openapi({
    example: 2
  }),
  can_read: z3.boolean().openapi({
    example: true
  }),
  can_create: z3.boolean().openapi({
    example: true
  }),
  can_update: z3.boolean().openapi({
    example: true
  }),
  can_delete: z3.boolean().openapi({
    example: true
  }),
  can_report: z3.boolean().openapi({
    example: true
  }),
  created_at: timestampSchema,
  updated_at: timestampSchema,
  role: userRoleSummarySchema,
  menu: z3.object({
    id: z3.number().int().openapi({
      example: 2
    }),
    name: z3.string().openapi({
      example: "Master Data"
    }),
    path: z3.string().openapi({
      example: "/master-data"
    }),
    permission_path: z3.string().nullable().openapi({
      example: null
    }),
    icon: z3.string().nullable().openapi({
      example: null
    }),
    parent_id: z3.number().int().nullable().openapi({
      example: null
    })
  })
}).openapi("RolePermission");
var uploadSignatureResponseSchema = z3.object({
  apiKey: z3.string().openapi({
    example: "123456789012345"
  }),
  cloudName: z3.string().openapi({
    example: "my-cloud"
  }),
  folder: z3.string().openapi({
    example: "uploads"
  }),
  signature: z3.string().openapi({
    example: "c1d2e3f4"
  }),
  timestamp: z3.number().int().openapi({
    example: 1770000000
  }),
  uploadUrl: z3.string().url().openapi({
    example: "https://api.cloudinary.com/v1_1/my-cloud/image/upload"
  })
}).openapi("UploadSignatureResponse");
var dishCategorySchema = z3.object({
  id: z3.number().int().openapi({
    example: 1
  }),
  name: z3.string().openapi({
    example: "Main Course"
  }),
  icon: z3.string().nullable().openapi({
    example: "ph-bowl-food"
  }),
  created_at: timestampSchema,
  updated_at: timestampSchema
}).openapi("DishCategory");
var dishSchema = z3.object({
  id: z3.number().int().openapi({
    example: 1
  }),
  dish_category_id: z3.number().int().openapi({
    example: 1
  }),
  name: z3.string().openapi({
    example: "Nasi Goreng Spesial"
  }),
  slug: z3.string().openapi({
    example: "nasi-goreng-spesial"
  }),
  description: z3.string().nullable().openapi({
    example: "Nasi goreng dengan telur dan ayam"
  }),
  price: z3.string().openapi({
    example: "35000.00"
  }),
  thumbnail: z3.string().nullable().openapi({
    example: "https://res.cloudinary.com/xxx/image.jpg"
  }),
  thumbnail_public_id: z3.string().nullable().openapi({
    example: "uploads/dish-001"
  }),
  is_available: z3.boolean().openapi({
    example: false
  }),
  is_active: z3.boolean().openapi({
    example: false
  }),
  created_at: timestampSchema,
  updated_at: timestampSchema,
  category: z3.object({
    id: z3.number().int().nullable().openapi({ example: 1 }),
    name: z3.string().nullable().openapi({ example: "Main Course" }),
    icon: z3.string().nullable().openapi({ example: "ph-bowl-food" })
  }).nullable()
}).openapi("Dish");
var dishImageSchema = z3.object({
  id: z3.number().int().openapi({
    example: 1
  }),
  dish_id: z3.number().int().openapi({
    example: 1
  }),
  image: z3.string().openapi({
    example: "https://res.cloudinary.com/xxx/dish-001.jpg"
  }),
  image_public_id: z3.string().openapi({
    example: "uploads/dish-001"
  }),
  created_at: timestampSchema,
  updated_at: timestampSchema
}).openapi("DishImage");
var dishOrderSchema = z3.object({
  id: z3.number().int().openapi({
    example: 1
  }),
  guest_name: z3.string().openapi({
    example: "John Doe"
  }),
  guest_phone: z3.string().openapi({
    example: "081234567890"
  }),
  total: z3.string().openapi({
    example: "100000.00"
  }),
  tax: z3.string().openapi({
    example: "11000.00"
  }),
  service_fee: z3.string().openapi({
    example: "5000.00"
  }),
  nett_price: z3.string().openapi({
    example: "116000.00"
  }),
  created_at: timestampSchema,
  updated_at: timestampSchema
}).openapi("DishOrder");
var dishOrderDetailSchema = z3.object({
  id: z3.number().int().openapi({
    example: 1
  }),
  dish_order_id: z3.number().int().openapi({
    example: 1
  }),
  dish_id: z3.number().int().openapi({
    example: 1
  }),
  quantity: z3.number().int().openapi({
    example: 2
  }),
  notes: z3.string().nullable().openapi({
    example: "Extra pedas"
  }),
  status: z3.enum(["pending", "confirmed", "preparing", "completed", "cancelled"]).openapi({
    example: "pending"
  }),
  created_at: timestampSchema,
  updated_at: timestampSchema,
  dish: z3.object({
    id: z3.number().int().nullable().openapi({ example: 1 }),
    name: z3.string().nullable().openapi({ example: "Nasi Goreng Spesial" }),
    slug: z3.string().nullable().openapi({ example: "nasi-goreng-spesial" }),
    price: z3.string().nullable().openapi({ example: "35000.00" }),
    thumbnail: z3.string().nullable().openapi({ example: "https://res.cloudinary.com/xxx/image.jpg" })
  }).nullable()
}).openapi("DishOrderDetail");
var billiardTableTypeSchema = z3.object({
  id: z3.number().int().openapi({
    example: 1
  }),
  name: z3.string().openapi({
    example: "Standard Pool"
  }),
  icon: z3.string().nullable().openapi({
    example: "ph-billiards"
  }),
  description: z3.string().nullable().openapi({
    example: "Meja billiard standar 8 ball"
  }),
  created_at: timestampSchema,
  updated_at: timestampSchema
}).openapi("BilliardTableType");
var billiardTableSchema = z3.object({
  id: z3.number().int().openapi({
    example: 1
  }),
  table_type_id: z3.number().int().openapi({
    example: 1
  }),
  name: z3.string().openapi({
    example: "Table 01"
  }),
  slug: z3.string().openapi({
    example: "table-01"
  }),
  price: z3.string().openapi({
    example: "50000.00"
  }),
  thumbnail: z3.string().nullable().openapi({
    example: "https://res.cloudinary.com/xxx/image.jpg"
  }),
  thumbnail_public_id: z3.string().nullable().openapi({
    example: "uploads/table-01"
  }),
  is_available: z3.boolean().openapi({
    example: false
  }),
  is_active: z3.boolean().openapi({
    example: false
  }),
  created_at: timestampSchema,
  updated_at: timestampSchema,
  type: z3.object({
    id: z3.number().int().nullable().openapi({ example: 1 }),
    name: z3.string().nullable().openapi({ example: "Standard Pool" }),
    icon: z3.string().nullable().openapi({ example: "ph-billiards" })
  }).nullable()
}).openapi("BilliardTable");
var billiardTableImageSchema = z3.object({
  id: z3.number().int().openapi({
    example: 1
  }),
  billiard_table_id: z3.number().int().openapi({
    example: 1
  }),
  image: z3.string().openapi({
    example: "https://res.cloudinary.com/xxx/table-01.jpg"
  }),
  image_public_id: z3.string().openapi({
    example: "uploads/table-01"
  }),
  created_at: timestampSchema,
  updated_at: timestampSchema
}).openapi("BilliardTableImage");
var scheduleSchema = z3.object({
  id: z3.number().int().openapi({
    example: 1
  }),
  start_time: z3.string().openapi({
    example: "10:00:00"
  }),
  end_time: z3.string().openapi({
    example: "11:00:00"
  }),
  created_at: timestampSchema,
  updated_at: timestampSchema
}).openapi("Schedule");
var reservationSchema = z3.object({
  id: z3.number().int().openapi({
    example: 1
  }),
  billiard_table_id: z3.number().int().openapi({
    example: 1
  }),
  guest_name: z3.string().openapi({
    example: "John Doe"
  }),
  guest_phone: z3.string().openapi({
    example: "081234567890"
  }),
  date: z3.string().openapi({
    example: "2024-05-20"
  }),
  schedule_id: z3.number().int().openapi({
    example: 1
  }),
  guest_count: z3.number().int().openapi({
    example: 4
  }),
  notes: z3.string().nullable().openapi({
    example: "Meja dekat jendela"
  }),
  status: z3.enum(["pending", "confirmed", "preparing", "completed", "cancelled"]).openapi({
    example: "pending"
  }),
  created_at: timestampSchema,
  updated_at: timestampSchema,
  billiard_table: z3.object({
    id: z3.number().int().nullable().openapi({ example: 1 }),
    name: z3.string().nullable().openapi({ example: "Table 01" }),
    slug: z3.string().nullable().openapi({ example: "table-01" }),
    price: z3.string().nullable().openapi({ example: "50000.00" }),
    thumbnail: z3.string().nullable().openapi({ example: "https://res.cloudinary.com/xxx/image.jpg" })
  }).nullable(),
  schedule: z3.object({
    id: z3.number().int().nullable().openapi({ example: 1 }),
    start_time: z3.string().nullable().openapi({ example: "18:00:00" }),
    end_time: z3.string().nullable().openapi({ example: "20:00:00" })
  }).nullable()
}).openapi("Reservation");
var paymentSchema = z3.object({
  id: z3.number().int().openapi({
    example: 1
  }),
  type: z3.enum(["dish_order", "reservation"]).openapi({
    example: "dish_order"
  }),
  dish_order_id: z3.number().int().nullable().openapi({
    example: 1
  }),
  reservation_id: z3.number().int().nullable().openapi({
    example: null
  }),
  method: z3.enum(["qris", "bank_transfer", "cash", "ewallet", "credit_card"]).openapi({
    example: "qris"
  }),
  provider: z3.enum(["midtrans", "xendit", "manual", "cashier"]).openapi({
    example: "midtrans"
  }),
  transaction_id: z3.string().nullable().openapi({
    example: "TRX-123456"
  }),
  gross_amount: z3.string().openapi({
    example: "116000.00"
  }),
  status: z3.enum(["pending", "paid", "failed", "expired", "cancelled", "refunded"]).openapi({
    example: "pending"
  }),
  url: z3.string().nullable().openapi({
    example: "https://midtrans.com/pay/123"
  }),
  snap_token: z3.string().nullable().openapi({
    example: "snap-token-xyz"
  }),
  paid_at: z3.string().nullable().openapi({
    example: "2024-05-20T18:05:00Z"
  }),
  expired_at: z3.string().nullable().openapi({
    example: "2024-05-21T18:00:00Z"
  }),
  created_at: timestampSchema,
  updated_at: timestampSchema,
  dish_order: z3.object({
    id: z3.number().int().nullable().openapi({ example: 1 }),
    guest_name: z3.string().nullable().openapi({ example: "John Doe" }),
    guest_phone: z3.string().nullable().openapi({ example: "081234567890" }),
    nett_price: z3.string().nullable().openapi({ example: "116000.00" })
  }).nullable(),
  reservation: z3.object({
    id: z3.number().int().nullable().openapi({ example: 2 }),
    guest_name: z3.string().nullable().openapi({ example: "Jane Doe" }),
    guest_phone: z3.string().nullable().openapi({ example: "089876543210" }),
    date: z3.string().nullable().openapi({ example: "2024-05-20" }),
    schedule_id: z3.number().int().nullable().openapi({ example: 1 })
  }).nullable()
}).openapi("Payment");

// src/app/user/dto/user-response.dto.ts
var loginDataSchema = z4.object({
  token: z4.string().openapi({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example"
  }),
  user: z4.object({
    id: z4.number().int().openapi({ example: 1 }),
    email: z4.string().email().openapi({ example: "admin@example.com" }),
    name: z4.string().openapi({ example: "Admin User" }),
    role_id: z4.number().int().openapi({ example: 1 })
  })
}).openapi("LoginResponse");
var loginResponseSchema = createSuccessEnvelopeSchema("LoginEnvelopeResponse", loginDataSchema, "Login successful");
var userListResponseSchema = createSuccessEnvelopeSchema("UserListResponse", z4.array(userSchema), "Users fetched successfully");
var userDetailResponseSchema = createSuccessEnvelopeSchema("UserDetailResponse", userSchema, "User fetched successfully");
var userMutationResponseSchema = createSuccessEnvelopeSchema("UserMutationResponse", writeResultSchema, "User created successfully");
var navigationResponseSchema = createSuccessEnvelopeSchema("NavigationResponse", z4.array(navigationItemSchema), "Navigation fetched successfully");

// src/app/user/route/user.openapi.ts
var userIdParamsSchema = createNumericPathParamsSchema("id");
var loginUserRoute = createRoute({
  method: "post",
  path: "/login",
  tags: ["Users"],
  summary: "Login user",
  security: [],
  request: {
    body: {
      required: true,
      content: { "application/json": { schema: loginRequestSchema } }
    }
  },
  responses: {
    200: jsonResponse(loginResponseSchema, "Successful login"),
    400: jsonResponse(apiErrorResponseSchema, "Email and password are required"),
    401: jsonResponse(apiErrorResponseSchema, "Invalid email or password"),
    500: errorResponses[500]
  }
});
var getAllUsersRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Users"],
  summary: "Get all users",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission()
  ],
  responses: {
    200: jsonResponse(userListResponseSchema, "Users fetched successfully"),
    401: errorResponses[401],
    403: errorResponses[403],
    500: errorResponses[500]
  }
});
var getCurrentUserNavigationRoute = createRoute({
  method: "get",
  path: "/me/navigation",
  tags: ["Users"],
  summary: "Get current user navigation tree",
  security: protectedSecurity,
  middleware: [jwtMiddleware, appTokenMiddleware],
  responses: {
    200: jsonResponse(navigationResponseSchema, "Navigation fetched successfully"),
    401: jsonResponse(apiErrorResponseSchema, "Unauthorized - User role not found"),
    500: errorResponses[500]
  }
});
var getUserByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Users"],
  summary: "Get user by id",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission()
  ],
  request: {
    params: userIdParamsSchema
  },
  responses: {
    200: jsonResponse(userDetailResponseSchema, "User fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid user id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "User not found"),
    500: errorResponses[500]
  }
});
var createUserRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Users"],
  summary: "Create user",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission()
  ],
  request: {
    body: {
      required: true,
      content: { "application/json": { schema: createUserRequestSchema } }
    }
  },
  responses: {
    201: jsonResponse(userMutationResponseSchema, "User created successfully"),
    ...errorResponses,
    400: jsonResponse(apiErrorResponseSchema, "Validation error or email already registered")
  }
});
var updateUserRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags: ["Users"],
  summary: "Update user",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission()
  ],
  request: {
    params: userIdParamsSchema,
    body: {
      required: true,
      content: { "application/json": { schema: updateUserRequestSchema } }
    }
  },
  responses: {
    200: jsonResponse(userMutationResponseSchema, "User updated successfully"),
    ...errorResponses,
    404: jsonResponse(apiErrorResponseSchema, "User not found")
  }
});
var deleteUserRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Users"],
  summary: "Delete user",
  security: protectedSecurity,
  middleware: [
    jwtMiddleware,
    appTokenMiddleware,
    requirePermission()
  ],
  request: {
    params: userIdParamsSchema
  },
  responses: {
    200: jsonResponse(userMutationResponseSchema, "User deleted successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid user id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "User not found"),
    500: errorResponses[500]
  }
});

// src/app/user/route/user.route.ts
var router = createOpenApiRouter();
registerDefaultSecuritySchemes(router);
registerOpenApiRoute(router, loginUserRoute, UserAuthController.login);
registerOpenApiRoute(router, getAllUsersRoute, UserController.getAll);
registerOpenApiRoute(router, getCurrentUserNavigationRoute, UserNavigationController.getNavigation);
registerOpenApiRoute(router, getUserByIdRoute, UserController.getById);
registerOpenApiRoute(router, createUserRoute, UserController.create);
registerOpenApiRoute(router, updateUserRoute, UserController.update);
registerOpenApiRoute(router, deleteUserRoute, UserController.delete);
function getUserOpenApiDocument(baseUrl) {
  return createModuleOpenApiDocument(router, baseUrl, "User API");
}
var user_route_default = router;

// src/app/role/repository/role-read.repository.ts
import { eq as eq5 } from "drizzle-orm";
class RoleReadRepository {
  static async getAllRoles() {
    try {
      return await db.select().from(roles);
    } catch (error) {
      throw new Error(`Failed to fetch roles: ${error}`);
    }
  }
  static async getRoleById(id) {
    try {
      const result = await db.select().from(roles).where(eq5(roles.id, id)).limit(1);
      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch role: ${error}`);
    }
  }
  static async getRoleByCode(code) {
    try {
      const result = await db.select().from(roles).where(eq5(roles.code, code)).limit(1);
      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch role: ${error}`);
    }
  }
}

// src/app/role/repository/role-write.repository.ts
import { eq as eq6 } from "drizzle-orm";
class RoleWriteRepository {
  static async createRole(data) {
    try {
      return await db.insert(roles).values(data);
    } catch (error) {
      throw new Error(`Failed to create role: ${error}`);
    }
  }
  static async updateRole(id, data) {
    try {
      return await db.update(roles).set({
        ...data,
        updated_at: new Date
      }).where(eq6(roles.id, id));
    } catch (error) {
      throw new Error(`Failed to update role: ${error}`);
    }
  }
  static async deleteRole(id) {
    try {
      return await db.delete(roles).where(eq6(roles.id, id));
    } catch (error) {
      throw new Error(`Failed to delete role: ${error}`);
    }
  }
}

// src/app/role/service/role.service.ts
class RoleService {
  static async getAllRoles() {
    return RoleReadRepository.getAllRoles();
  }
  static async getRoleById(id) {
    return RoleReadRepository.getRoleById(id);
  }
  static async createRole(payload) {
    const existingRole = await RoleReadRepository.getRoleByCode(payload.code);
    if (existingRole) {
      return { conflict: true };
    }
    const result = await RoleWriteRepository.createRole(payload);
    return { conflict: false, result };
  }
  static async updateRole(id, payload) {
    const role = await RoleReadRepository.getRoleById(id);
    if (!role) {
      return null;
    }
    const result = await RoleWriteRepository.updateRole(id, payload);
    return { role, result };
  }
  static async deleteRole(id) {
    const role = await RoleReadRepository.getRoleById(id);
    if (!role) {
      return null;
    }
    const result = await RoleWriteRepository.deleteRole(id);
    return { role, result };
  }
}

// src/app/role/controller/role.controller.ts
class RoleController {
  static async getAll(c) {
    const roles2 = await RoleService.getAllRoles();
    return c.json({
      success: true,
      data: roles2,
      message: "Roles fetched successfully"
    });
  }
  static async getById(c) {
    const id = Number(c.req.param("id"));
    const role = await RoleService.getRoleById(id);
    if (!role) {
      return c.json({ success: false, message: "Role not found" }, 404);
    }
    return c.json({
      success: true,
      data: role,
      message: "Role fetched successfully"
    });
  }
  static async create(c) {
    const body = await c.req.json();
    const createResult = await RoleService.createRole(body);
    if (createResult.conflict) {
      return c.json({ success: false, message: "Role code already exists" }, 400);
    }
    return c.json({
      success: true,
      data: createResult.result,
      message: "Role created successfully"
    }, 201);
  }
  static async update(c) {
    const id = Number(c.req.param("id"));
    const body = await c.req.json();
    const updateResult = await RoleService.updateRole(id, body);
    if (!updateResult) {
      return c.json({ success: false, message: "Role not found" }, 404);
    }
    return c.json({
      success: true,
      data: updateResult.result,
      message: "Role updated successfully"
    });
  }
  static async delete(c) {
    const id = Number(c.req.param("id"));
    const deleteResult = await RoleService.deleteRole(id);
    if (!deleteResult) {
      return c.json({ success: false, message: "Role not found" }, 404);
    }
    return c.json({
      success: true,
      data: deleteResult.result,
      message: "Role deleted successfully"
    });
  }
}

// src/app/role/route/role.openapi.ts
import { createRoute as createRoute2 } from "@hono/zod-openapi";

// src/app/role/dto/role-request.dto.ts
import { z as z5 } from "@hono/zod-openapi";
var createRoleRequestSchema = z5.object({
  code: z5.string().min(1).openapi({ example: "SUPERVISOR" }),
  name: z5.string().min(1).openapi({ example: "Supervisor" })
}).openapi("CreateRoleRequest");
var updateRoleRequestSchema = z5.object({
  code: z5.string().min(1).optional().openapi({ example: "SUPERVISOR" }),
  name: z5.string().min(1).optional().openapi({ example: "Supervisor Area" })
}).openapi("UpdateRoleRequest");

// src/app/role/dto/role-response.dto.ts
import { z as z6 } from "@hono/zod-openapi";
var roleListResponseSchema = createSuccessEnvelopeSchema("RoleListResponse", z6.array(roleSchema), "Roles fetched successfully");
var roleDetailResponseSchema = createSuccessEnvelopeSchema("RoleDetailResponse", roleSchema, "Role fetched successfully");
var roleMutationResponseSchema = createSuccessEnvelopeSchema("RoleMutationResponse", writeResultSchema, "Role created successfully");

// src/app/role/route/role.openapi.ts
var tags = ["Roles"];
var roleIdParamsSchema = createNumericPathParamsSchema("id");
var getAllRolesRoute = createRoute2({
  method: "get",
  path: "/",
  tags,
  summary: "Get all roles",
  security: protectedSecurity,
  responses: {
    200: jsonResponse(roleListResponseSchema, "Roles fetched successfully"),
    401: errorResponses[401],
    403: errorResponses[403],
    500: errorResponses[500]
  }
});
var getRoleByIdRoute = createRoute2({
  method: "get",
  path: "/{id}",
  tags,
  summary: "Get role by id",
  security: protectedSecurity,
  request: {
    params: roleIdParamsSchema
  },
  responses: {
    200: jsonResponse(roleDetailResponseSchema, "Role fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid role id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Role not found"),
    500: errorResponses[500]
  }
});
var createRoleRoute = createRoute2({
  method: "post",
  path: "/",
  tags,
  summary: "Create role",
  security: protectedSecurity,
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createRoleRequestSchema
        }
      }
    }
  },
  responses: {
    201: jsonResponse(roleMutationResponseSchema, "Role created successfully"),
    ...errorResponses
  }
});
var updateRoleRoute = createRoute2({
  method: "put",
  path: "/{id}",
  tags,
  summary: "Update role",
  security: protectedSecurity,
  request: {
    params: roleIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateRoleRequestSchema
        }
      }
    }
  },
  responses: {
    200: jsonResponse(roleMutationResponseSchema, "Role updated successfully"),
    ...errorResponses,
    404: jsonResponse(apiErrorResponseSchema, "Role not found")
  }
});
var deleteRoleRoute = createRoute2({
  method: "delete",
  path: "/{id}",
  tags,
  summary: "Delete role",
  security: protectedSecurity,
  request: {
    params: roleIdParamsSchema
  },
  responses: {
    200: jsonResponse(roleMutationResponseSchema, "Role deleted successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid role id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Role not found"),
    500: errorResponses[500]
  }
});

// src/app/role/route/role.route.ts
var router2 = createOpenApiRouter();
registerDefaultSecuritySchemes(router2);
router2.use("*", jwtMiddleware, appTokenMiddleware, requirePermission());
registerOpenApiRoute(router2, getAllRolesRoute, RoleController.getAll);
registerOpenApiRoute(router2, getRoleByIdRoute, RoleController.getById);
registerOpenApiRoute(router2, createRoleRoute, RoleController.create);
registerOpenApiRoute(router2, updateRoleRoute, RoleController.update);
registerOpenApiRoute(router2, deleteRoleRoute, RoleController.delete);
function getRoleOpenApiDocument(baseUrl) {
  return createModuleOpenApiDocument(router2, baseUrl, "Role API");
}
var role_route_default = router2;

// src/app/menu/repository/menu-read.repository.ts
import { eq as eq7, isNull } from "drizzle-orm";
class MenuReadRepository {
  static async getAllMenus() {
    try {
      return await db.select().from(menus);
    } catch (error) {
      throw new Error(`Failed to fetch menus: ${error}`);
    }
  }
  static async getMenuById(id) {
    try {
      const result = await db.select().from(menus).where(eq7(menus.id, id)).limit(1);
      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch menu: ${error}`);
    }
  }
  static async getMenusByParentId(parentId) {
    try {
      if (parentId === null) {
        return await db.select().from(menus).where(isNull(menus.parent_id));
      }
      return await db.select().from(menus).where(eq7(menus.parent_id, parentId));
    } catch (error) {
      throw new Error(`Failed to fetch menus: ${error}`);
    }
  }
}

// src/app/menu/repository/menu-write.repository.ts
import { eq as eq8 } from "drizzle-orm";
class MenuWriteRepository {
  static async createMenu(data) {
    try {
      return await db.insert(menus).values(data);
    } catch (error) {
      throw new Error(`Failed to create menu: ${error}`);
    }
  }
  static async updateMenu(id, data) {
    try {
      return await db.update(menus).set({
        ...data,
        updated_at: new Date
      }).where(eq8(menus.id, id));
    } catch (error) {
      throw new Error(`Failed to update menu: ${error}`);
    }
  }
  static async deleteMenu(id) {
    try {
      return await db.delete(menus).where(eq8(menus.id, id));
    } catch (error) {
      throw new Error(`Failed to delete menu: ${error}`);
    }
  }
}

// src/app/menu/service/menu.service.ts
class MenuService {
  static async getAllMenus() {
    return MenuReadRepository.getAllMenus();
  }
  static async getMenuById(id) {
    return MenuReadRepository.getMenuById(id);
  }
  static async getMenusByParentId(parentId) {
    return MenuReadRepository.getMenusByParentId(parentId);
  }
  static async createMenu(payload) {
    return MenuWriteRepository.createMenu(payload);
  }
  static async updateMenu(id, payload) {
    const menu = await MenuReadRepository.getMenuById(id);
    if (!menu) {
      return null;
    }
    const result = await MenuWriteRepository.updateMenu(id, payload);
    return { menu, result };
  }
  static async deleteMenu(id) {
    const menu = await MenuReadRepository.getMenuById(id);
    if (!menu) {
      return null;
    }
    const result = await MenuWriteRepository.deleteMenu(id);
    return { menu, result };
  }
}

// src/app/menu/controller/menu.controller.ts
class MenuController {
  static async getAll(c) {
    const menus2 = await MenuService.getAllMenus();
    return c.json({
      success: true,
      data: menus2,
      message: "Menus fetched successfully"
    });
  }
  static async getById(c) {
    const id = Number(c.req.param("id"));
    const menu = await MenuService.getMenuById(id);
    if (!menu) {
      return c.json({ success: false, message: "Menu not found" }, 404);
    }
    return c.json({
      success: true,
      data: menu,
      message: "Menu fetched successfully"
    });
  }
  static async create(c) {
    const body = await c.req.json();
    const result = await MenuService.createMenu(body);
    return c.json({
      success: true,
      data: result,
      message: "Menu created successfully"
    }, 201);
  }
  static async update(c) {
    const id = Number(c.req.param("id"));
    const body = await c.req.json();
    const updateResult = await MenuService.updateMenu(id, body);
    if (!updateResult) {
      return c.json({ success: false, message: "Menu not found" }, 404);
    }
    return c.json({
      success: true,
      data: updateResult.result,
      message: "Menu updated successfully"
    });
  }
  static async delete(c) {
    const id = Number(c.req.param("id"));
    const deleteResult = await MenuService.deleteMenu(id);
    if (!deleteResult) {
      return c.json({ success: false, message: "Menu not found" }, 404);
    }
    return c.json({
      success: true,
      data: deleteResult.result,
      message: "Menu deleted successfully"
    });
  }
}

// src/app/menu/route/menu.openapi.ts
import { createRoute as createRoute3 } from "@hono/zod-openapi";

// src/app/menu/dto/menu-request.dto.ts
import { z as z7 } from "@hono/zod-openapi";
var createMenuRequestSchema = z7.object({
  name: z7.string().min(1).max(100).openapi({ example: "Reports" }),
  path: z7.string().max(255).optional().nullable().openapi({ example: "/reports" }),
  permission_path: z7.string().max(255).optional().nullable().openapi({ example: "/api/reports" }),
  icon: z7.string().max(255).optional().nullable().openapi({ example: "ph-chart-bar" }),
  is_visible: z7.boolean().optional().default(false),
  parent_id: z7.number().int().optional().nullable().openapi({ example: null })
}).openapi("CreateMenuRequest");
var updateMenuRequestSchema = z7.object({
  name: z7.string().min(1).optional().openapi({ example: "Report Detail" }),
  path: z7.string().min(1).optional().openapi({ example: "/reports/detail" }),
  permission_path: z7.string().nullable().optional().openapi({ example: "/api/reports" }),
  icon: z7.string().nullable().optional().openapi({ example: "ph-list" }),
  parent_id: createNullableOptionalCoercedIntSchema(2)
}).openapi("UpdateMenuRequest");

// src/app/menu/dto/menu-response.dto.ts
import { z as z8 } from "@hono/zod-openapi";
var menuListResponseSchema = createSuccessEnvelopeSchema("MenuListResponse", z8.array(menuSchema), "Menus fetched successfully");
var menuDetailResponseSchema = createSuccessEnvelopeSchema("MenuDetailResponse", menuSchema, "Menu fetched successfully");
var menuMutationResponseSchema = createSuccessEnvelopeSchema("MenuMutationResponse", writeResultSchema, "Menu created successfully");

// src/app/menu/route/menu.openapi.ts
var tags2 = ["Menus"];
var menuIdParamsSchema = createNumericPathParamsSchema("id");
var getAllMenusRoute = createRoute3({
  method: "get",
  path: "/",
  tags: tags2,
  summary: "Get all menus",
  security: protectedSecurity,
  responses: {
    200: jsonResponse(menuListResponseSchema, "Menus fetched successfully"),
    401: errorResponses[401],
    403: errorResponses[403],
    500: errorResponses[500]
  }
});
var getMenuByIdRoute = createRoute3({
  method: "get",
  path: "/{id}",
  tags: tags2,
  summary: "Get menu by id",
  security: protectedSecurity,
  request: {
    params: menuIdParamsSchema
  },
  responses: {
    200: jsonResponse(menuDetailResponseSchema, "Menu fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid menu id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Menu not found"),
    500: errorResponses[500]
  }
});
var createMenuRoute = createRoute3({
  method: "post",
  path: "/",
  tags: tags2,
  summary: "Create menu",
  security: protectedSecurity,
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createMenuRequestSchema
        }
      }
    }
  },
  responses: {
    201: jsonResponse(menuMutationResponseSchema, "Menu created successfully"),
    ...errorResponses
  }
});
var updateMenuRoute = createRoute3({
  method: "put",
  path: "/{id}",
  tags: tags2,
  summary: "Update menu",
  security: protectedSecurity,
  request: {
    params: menuIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateMenuRequestSchema
        }
      }
    }
  },
  responses: {
    200: jsonResponse(menuMutationResponseSchema, "Menu updated successfully"),
    ...errorResponses,
    404: jsonResponse(apiErrorResponseSchema, "Menu not found")
  }
});
var deleteMenuRoute = createRoute3({
  method: "delete",
  path: "/{id}",
  tags: tags2,
  summary: "Delete menu",
  security: protectedSecurity,
  request: {
    params: menuIdParamsSchema
  },
  responses: {
    200: jsonResponse(menuMutationResponseSchema, "Menu deleted successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid menu id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Menu not found"),
    500: errorResponses[500]
  }
});

// src/app/menu/route/menu.route.ts
var router3 = createOpenApiRouter();
registerDefaultSecuritySchemes(router3);
router3.use("*", jwtMiddleware, appTokenMiddleware, requirePermission());
registerOpenApiRoute(router3, getAllMenusRoute, MenuController.getAll);
registerOpenApiRoute(router3, getMenuByIdRoute, MenuController.getById);
registerOpenApiRoute(router3, createMenuRoute, MenuController.create);
registerOpenApiRoute(router3, updateMenuRoute, MenuController.update);
registerOpenApiRoute(router3, deleteMenuRoute, MenuController.delete);
function getMenuOpenApiDocument(baseUrl) {
  return createModuleOpenApiDocument(router3, baseUrl, "Menu API");
}
var menu_route_default = router3;

// src/app/role_permission/repository/role-permission-write.repository.ts
import { eq as eq9 } from "drizzle-orm";
class RolePermissionWriteRepository {
  static async createRolePermission(data) {
    try {
      return await db.insert(role_permissions).values(data);
    } catch (error) {
      throw new Error(`Failed to create role permission: ${error}`);
    }
  }
  static async updateRolePermission(id, data) {
    try {
      return await db.update(role_permissions).set({
        ...data,
        updated_at: new Date
      }).where(eq9(role_permissions.id, id));
    } catch (error) {
      throw new Error(`Failed to update role permission: ${error}`);
    }
  }
  static async deleteRolePermission(id) {
    try {
      return await db.delete(role_permissions).where(eq9(role_permissions.id, id));
    } catch (error) {
      throw new Error(`Failed to delete role permission: ${error}`);
    }
  }
}

// src/app/role_permission/service/role-permission.service.ts
class RolePermissionService {
  static mapRolePermission(rolePermission) {
    return {
      id: rolePermission.id,
      role_id: rolePermission.role_id,
      menu_id: rolePermission.menu_id,
      can_read: Boolean(rolePermission.can_read),
      can_create: Boolean(rolePermission.can_create),
      can_update: Boolean(rolePermission.can_update),
      can_delete: Boolean(rolePermission.can_delete),
      can_report: Boolean(rolePermission.can_report),
      created_at: rolePermission.created_at,
      updated_at: rolePermission.updated_at,
      role: {
        id: rolePermission.role_ref_id,
        code: rolePermission.role_code,
        name: rolePermission.role_name
      },
      menu: {
        id: rolePermission.menu_ref_id,
        name: rolePermission.menu_name,
        path: rolePermission.menu_path,
        permission_path: rolePermission.menu_permission_path,
        icon: rolePermission.menu_icon,
        parent_id: rolePermission.menu_parent_id
      }
    };
  }
  static async getAllRolePermissions() {
    const result = await RolePermissionReadRepository.getAllRolePermissions();
    return result.map((item) => RolePermissionService.mapRolePermission(item));
  }
  static async getRolePermissionById(id) {
    const result = await RolePermissionReadRepository.getRolePermissionById(id);
    if (!result) {
      return null;
    }
    return RolePermissionService.mapRolePermission(result);
  }
  static async getPermissionsByRoleId(roleId) {
    const result = await RolePermissionReadRepository.getPermissionsByRoleId(roleId);
    return result.map((item) => RolePermissionService.mapRolePermission(item));
  }
  static async createRolePermission(payload) {
    return RolePermissionWriteRepository.createRolePermission(payload);
  }
  static async updateRolePermission(id, payload) {
    const rolePermission = await RolePermissionReadRepository.getRolePermissionById(id);
    if (!rolePermission) {
      return null;
    }
    const result = await RolePermissionWriteRepository.updateRolePermission(id, payload);
    return { rolePermission, result };
  }
  static async deleteRolePermission(id) {
    const rolePermission = await RolePermissionReadRepository.getRolePermissionById(id);
    if (!rolePermission) {
      return null;
    }
    const result = await RolePermissionWriteRepository.deleteRolePermission(id);
    return { rolePermission, result };
  }
}

// src/app/role_permission/controller/role-permission.controller.ts
class RolePermissionController {
  static async getAll(c) {
    const rolePermissions = await RolePermissionService.getAllRolePermissions();
    return c.json({
      success: true,
      data: rolePermissions,
      message: "Role permissions fetched successfully"
    });
  }
  static async getById(c) {
    const id = Number(c.req.param("id"));
    const rolePermission = await RolePermissionService.getRolePermissionById(id);
    if (!rolePermission) {
      return c.json({ success: false, message: "Role permission not found" }, 404);
    }
    return c.json({
      success: true,
      data: rolePermission,
      message: "Role permission fetched successfully"
    });
  }
  static async getByRoleId(c) {
    const roleId = Number(c.req.param("roleId"));
    const permissions = await RolePermissionService.getPermissionsByRoleId(roleId);
    return c.json({
      success: true,
      data: permissions,
      message: "Role permissions fetched successfully"
    });
  }
  static async create(c) {
    const body = await c.req.json();
    const result = await RolePermissionService.createRolePermission(body);
    return c.json({
      success: true,
      data: result,
      message: "Role permission created successfully"
    }, 201);
  }
  static async update(c) {
    const id = Number(c.req.param("id"));
    const body = await c.req.json();
    const updateResult = await RolePermissionService.updateRolePermission(id, body);
    if (!updateResult) {
      return c.json({ success: false, message: "Role permission not found" }, 404);
    }
    return c.json({
      success: true,
      data: updateResult.result,
      message: "Role permission updated successfully"
    });
  }
  static async delete(c) {
    const id = Number(c.req.param("id"));
    const deleteResult = await RolePermissionService.deleteRolePermission(id);
    if (!deleteResult) {
      return c.json({ success: false, message: "Role permission not found" }, 404);
    }
    return c.json({
      success: true,
      data: deleteResult.result,
      message: "Role permission deleted successfully"
    });
  }
}

// src/app/role_permission/route/role-permission.openapi.ts
import { createRoute as createRoute4 } from "@hono/zod-openapi";

// src/app/role_permission/dto/role-permission-request.dto.ts
import { z as z9 } from "@hono/zod-openapi";
var createRolePermissionRequestSchema = z9.object({
  role_id: createCoercedIntSchema(1),
  menu_id: createCoercedIntSchema(2),
  can_read: z9.boolean().optional().openapi({ example: true }),
  can_create: z9.boolean().optional().openapi({ example: true }),
  can_update: z9.boolean().optional().openapi({ example: true }),
  can_delete: z9.boolean().optional().openapi({ example: false }),
  can_report: z9.boolean().optional().openapi({ example: false })
}).openapi("CreateRolePermissionRequest");
var updateRolePermissionRequestSchema = z9.object({
  role_id: createOptionalCoercedIntSchema(2),
  menu_id: createOptionalCoercedIntSchema(5),
  can_read: z9.boolean().optional().openapi({ example: true }),
  can_create: z9.boolean().optional().openapi({ example: false }),
  can_update: z9.boolean().optional().openapi({ example: false }),
  can_delete: z9.boolean().optional().openapi({ example: false }),
  can_report: z9.boolean().optional().openapi({ example: false })
}).openapi("UpdateRolePermissionRequest");

// src/app/role_permission/dto/role-permission-response.dto.ts
import { z as z10 } from "@hono/zod-openapi";
var listResponseSchema = createSuccessEnvelopeSchema("RolePermissionListResponse", z10.array(rolePermissionSchema), "Role permissions fetched successfully");
var detailResponseSchema = createSuccessEnvelopeSchema("RolePermissionDetailResponse", rolePermissionSchema, "Role permission fetched successfully");
var mutationResponseSchema = createSuccessEnvelopeSchema("RolePermissionMutationResponse", writeResultSchema, "Role permission created successfully");

// src/app/role_permission/route/role-permission.openapi.ts
var rolePermissionIdParamsSchema = createNumericPathParamsSchema("id");
var roleIdParamsSchema2 = createNumericPathParamsSchema("roleId");
var getAllRolePermissionsRoute = createRoute4({
  method: "get",
  path: "/",
  tags: ["Role Permissions"],
  summary: "Get all role permissions",
  security: protectedSecurity,
  responses: {
    200: jsonResponse(listResponseSchema, "Role permissions fetched successfully"),
    401: errorResponses[401],
    403: errorResponses[403],
    500: errorResponses[500]
  }
});
var getRolePermissionByIdRoute = createRoute4({
  method: "get",
  path: "/{id}",
  tags: ["Role Permissions"],
  summary: "Get role permission by id",
  security: protectedSecurity,
  request: { params: rolePermissionIdParamsSchema },
  responses: {
    200: jsonResponse(detailResponseSchema, "Role permission fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid role permission id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Role permission not found"),
    500: errorResponses[500]
  }
});
var getRolePermissionsByRoleIdRoute = createRoute4({
  method: "get",
  path: "/role/{roleId}",
  tags: ["Role Permissions"],
  summary: "Get role permissions by role id",
  security: protectedSecurity,
  request: { params: roleIdParamsSchema2 },
  responses: {
    200: jsonResponse(listResponseSchema, "Role permissions fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid role id"),
    401: errorResponses[401],
    403: errorResponses[403],
    500: errorResponses[500]
  }
});
var createRolePermissionRoute = createRoute4({
  method: "post",
  path: "/",
  tags: ["Role Permissions"],
  summary: "Create role permission",
  security: protectedSecurity,
  request: {
    body: {
      required: true,
      content: { "application/json": { schema: createRolePermissionRequestSchema } }
    }
  },
  responses: {
    201: jsonResponse(mutationResponseSchema, "Role permission created successfully"),
    ...errorResponses
  }
});
var updateRolePermissionRoute = createRoute4({
  method: "put",
  path: "/{id}",
  tags: ["Role Permissions"],
  summary: "Update role permission",
  security: protectedSecurity,
  request: {
    params: rolePermissionIdParamsSchema,
    body: {
      required: true,
      content: { "application/json": { schema: updateRolePermissionRequestSchema } }
    }
  },
  responses: {
    200: jsonResponse(mutationResponseSchema, "Role permission updated successfully"),
    ...errorResponses,
    404: jsonResponse(apiErrorResponseSchema, "Role permission not found")
  }
});
var deleteRolePermissionRoute = createRoute4({
  method: "delete",
  path: "/{id}",
  tags: ["Role Permissions"],
  summary: "Delete role permission",
  security: protectedSecurity,
  request: { params: rolePermissionIdParamsSchema },
  responses: {
    200: jsonResponse(mutationResponseSchema, "Role permission deleted successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid role permission id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Role permission not found"),
    500: errorResponses[500]
  }
});

// src/app/role_permission/route/role-permission.route.ts
var router4 = createOpenApiRouter();
registerDefaultSecuritySchemes(router4);
router4.use("*", jwtMiddleware, appTokenMiddleware, requirePermission());
registerOpenApiRoute(router4, getAllRolePermissionsRoute, RolePermissionController.getAll);
registerOpenApiRoute(router4, getRolePermissionByIdRoute, RolePermissionController.getById);
registerOpenApiRoute(router4, getRolePermissionsByRoleIdRoute, RolePermissionController.getByRoleId);
registerOpenApiRoute(router4, createRolePermissionRoute, RolePermissionController.create);
registerOpenApiRoute(router4, updateRolePermissionRoute, RolePermissionController.update);
registerOpenApiRoute(router4, deleteRolePermissionRoute, RolePermissionController.delete);
function getRolePermissionOpenApiDocument(baseUrl) {
  return createModuleOpenApiDocument(router4, baseUrl, "Role Permission API");
}
var role_permission_route_default = router4;

// src/utils/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";
var DEFAULT_CLOUDINARY_FOLDER = "uploads";
function getCloudinaryUrl() {
  return process.env.CLOUDINARY_URL;
}
function getCloudinaryFolder() {
  return process.env.CLOUDINARY_FOLDER || DEFAULT_CLOUDINARY_FOLDER;
}
function parseCloudinaryUrl(cloudinaryUrl) {
  const parsedUrl = new URL(cloudinaryUrl);
  const cloudName = parsedUrl.hostname;
  const apiKey = decodeURIComponent(parsedUrl.username);
  const apiSecret = decodeURIComponent(parsedUrl.password);
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Invalid Cloudinary URL configuration");
  }
  return {
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  };
}
function configureCloudinary() {
  const cloudinaryUrl = getCloudinaryUrl();
  if (!cloudinaryUrl) {
    throw new Error("CLOUDINARY_URL is not configured");
  }
  cloudinary.config(parseCloudinaryUrl(cloudinaryUrl));
}
function createSignedUploadParams(category) {
  const cloudinaryUrl = getCloudinaryUrl();
  if (!cloudinaryUrl) {
    throw new Error("CLOUDINARY_URL is not configured");
  }
  const config = parseCloudinaryUrl(cloudinaryUrl);
  const baseFolder = getCloudinaryFolder();
  const folder = category ? `${baseFolder}/${category}` : baseFolder;
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request({
    folder,
    timestamp
  }, config.api_secret);
  return {
    apiKey: config.api_key,
    cloudName: config.cloud_name,
    folder,
    signature,
    timestamp,
    uploadUrl: `https://api.cloudinary.com/v1_1/${config.cloud_name}/image/upload`
  };
}
async function deleteImageFromCloudinary(publicId) {
  if (!publicId) {
    return;
  }
  configureCloudinary();
  await cloudinary.uploader.destroy(publicId, {
    resource_type: "image"
  });
}
async function deleteImageFromCloudinarySafely(publicId) {
  try {
    await deleteImageFromCloudinary(publicId);
  } catch (error) {
    console.error(`[Cloudinary] Failed to delete image "${publicId}":`, error);
  }
}

// src/app/upload/controller/upload.controller.ts
class UploadController {
  static async createSignature(c) {
    const query = c.req.valid("query");
    const signedParams = createSignedUploadParams(query.category);
    return c.json({
      success: true,
      data: signedParams,
      message: "Upload signature created successfully"
    });
  }
}

// src/app/upload/route/upload.openapi.ts
import { createRoute as createRoute5, z as z11 } from "@hono/zod-openapi";
var uploadSignatureEnvelopeSchema = createSuccessEnvelopeSchema("UploadSignatureEnvelopeResponse", uploadSignatureResponseSchema, "Upload signature created successfully");
var createUploadSignatureRoute = createRoute5({
  method: "post",
  path: "/signature",
  tags: ["Uploads"],
  summary: "Create Cloudinary signed upload params",
  security: protectedSecurity,
  request: {
    query: z11.object({
      category: z11.enum(["cafe", "billiard"]).optional()
    })
  },
  responses: {
    200: jsonResponse(uploadSignatureEnvelopeSchema, "Upload signature created successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Validation error"),
    401: errorResponses[401],
    500: errorResponses[500]
  }
});

// src/app/upload/route/upload.route.ts
var router5 = createOpenApiRouter();
registerDefaultSecuritySchemes(router5);
registerOpenApiRoute(router5, createUploadSignatureRoute, UploadController.createSignature);
function getUploadOpenApiDocument(baseUrl) {
  return createModuleOpenApiDocument(router5, baseUrl, "Upload API");
}
var upload_route_default = router5;

// src/app/cafe/dish_category/repository/dish-category-read.repository.ts
import { eq as eq10 } from "drizzle-orm";
class DishCategoryReadRepository {
  static async getAll() {
    try {
      return await db.select().from(dish_categories);
    } catch (error) {
      throw new Error(`Failed to fetch dish categories: ${error}`);
    }
  }
  static async getById(id) {
    try {
      const result = await db.select().from(dish_categories).where(eq10(dish_categories.id, id)).limit(1);
      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch dish category: ${error}`);
    }
  }
}

// src/app/cafe/dish_category/repository/dish-category-write.repository.ts
import { eq as eq11 } from "drizzle-orm";
class DishCategoryWriteRepository {
  static async create(data) {
    try {
      return await db.insert(dish_categories).values(data);
    } catch (error) {
      throw new Error(`Failed to create dish category: ${error}`);
    }
  }
  static async update(id, data) {
    try {
      return await db.update(dish_categories).set({
        ...data,
        updated_at: new Date
      }).where(eq11(dish_categories.id, id));
    } catch (error) {
      throw new Error(`Failed to update dish category: ${error}`);
    }
  }
  static async delete(id) {
    try {
      return await db.delete(dish_categories).where(eq11(dish_categories.id, id));
    } catch (error) {
      throw new Error(`Failed to delete dish category: ${error}`);
    }
  }
}

// src/app/cafe/dish_category/service/dish-category.service.ts
class DishCategoryService {
  static async getAll() {
    return DishCategoryReadRepository.getAll();
  }
  static async getById(id) {
    return DishCategoryReadRepository.getById(id);
  }
  static async create(payload) {
    return DishCategoryWriteRepository.create(payload);
  }
  static async update(id, payload) {
    const category = await DishCategoryReadRepository.getById(id);
    if (!category) {
      return null;
    }
    const result = await DishCategoryWriteRepository.update(id, payload);
    return { category, result };
  }
  static async delete(id) {
    const category = await DishCategoryReadRepository.getById(id);
    if (!category) {
      return null;
    }
    const result = await DishCategoryWriteRepository.delete(id);
    return { category, result };
  }
}

// src/app/cafe/dish_category/controller/dish-category.controller.ts
class DishCategoryController {
  static async getAll(c) {
    const categories = await DishCategoryService.getAll();
    return c.json({
      success: true,
      data: categories,
      message: "Dish categories fetched successfully"
    });
  }
  static async getById(c) {
    const id = Number(c.req.param("id"));
    const category = await DishCategoryService.getById(id);
    if (!category) {
      return c.json({ success: false, message: "Dish category not found" }, 404);
    }
    return c.json({
      success: true,
      data: category,
      message: "Dish category fetched successfully"
    });
  }
  static async create(c) {
    const body = await c.req.json();
    const result = await DishCategoryService.create(body);
    return c.json({
      success: true,
      data: result,
      message: "Dish category created successfully"
    }, 201);
  }
  static async update(c) {
    const id = Number(c.req.param("id"));
    const body = await c.req.json();
    const updateResult = await DishCategoryService.update(id, body);
    if (!updateResult) {
      return c.json({ success: false, message: "Dish category not found" }, 404);
    }
    return c.json({
      success: true,
      data: updateResult.result,
      message: "Dish category updated successfully"
    });
  }
  static async delete(c) {
    const id = Number(c.req.param("id"));
    const deleteResult = await DishCategoryService.delete(id);
    if (!deleteResult) {
      return c.json({ success: false, message: "Dish category not found" }, 404);
    }
    return c.json({
      success: true,
      data: deleteResult.result,
      message: "Dish category deleted successfully"
    });
  }
}

// src/app/cafe/dish_category/route/dish-category.openapi.ts
import { createRoute as createRoute6 } from "@hono/zod-openapi";

// src/app/cafe/dish_category/dto/dish-category-request.dto.ts
import { z as z12 } from "@hono/zod-openapi";
var createDishCategoryRequestSchema = z12.object({
  name: z12.string().min(1).openapi({ example: "Main Course" }),
  icon: z12.string().nullable().optional().openapi({ example: "ph-bowl-food" })
}).openapi("CreateDishCategoryRequest");
var updateDishCategoryRequestSchema = z12.object({
  name: z12.string().min(1).optional().openapi({ example: "Appetizer" }),
  icon: z12.string().nullable().optional().openapi({ example: "ph-cookie" })
}).openapi("UpdateDishCategoryRequest");

// src/app/cafe/dish_category/dto/dish-category-response.dto.ts
import { z as z13 } from "@hono/zod-openapi";
var dishCategoryListResponseSchema = createSuccessEnvelopeSchema("DishCategoryListResponse", z13.array(dishCategorySchema), "Dish categories fetched successfully");
var dishCategoryDetailResponseSchema = createSuccessEnvelopeSchema("DishCategoryDetailResponse", dishCategorySchema, "Dish category fetched successfully");
var dishCategoryMutationResponseSchema = createSuccessEnvelopeSchema("DishCategoryMutationResponse", writeResultSchema, "Dish category created successfully");

// src/app/cafe/dish_category/route/dish-category.openapi.ts
var tags3 = ["Dish Categories"];
var dishCategoryIdParamsSchema = createNumericPathParamsSchema("id");
var getAllDishCategoriesRoute = createRoute6({
  method: "get",
  path: "/",
  tags: tags3,
  summary: "Get all dish categories",
  security: protectedSecurity,
  responses: {
    200: jsonResponse(dishCategoryListResponseSchema, "Dish categories fetched successfully"),
    401: errorResponses[401],
    403: errorResponses[403],
    500: errorResponses[500]
  }
});
var getDishCategoryByIdRoute = createRoute6({
  method: "get",
  path: "/{id}",
  tags: tags3,
  summary: "Get dish category by id",
  security: protectedSecurity,
  request: {
    params: dishCategoryIdParamsSchema
  },
  responses: {
    200: jsonResponse(dishCategoryDetailResponseSchema, "Dish category fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid dish category id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Dish category not found"),
    500: errorResponses[500]
  }
});
var createDishCategoryRoute = createRoute6({
  method: "post",
  path: "/",
  tags: tags3,
  summary: "Create dish category",
  security: protectedSecurity,
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createDishCategoryRequestSchema
        }
      }
    }
  },
  responses: {
    201: jsonResponse(dishCategoryMutationResponseSchema, "Dish category created successfully"),
    ...errorResponses
  }
});
var updateDishCategoryRoute = createRoute6({
  method: "put",
  path: "/{id}",
  tags: tags3,
  summary: "Update dish category",
  security: protectedSecurity,
  request: {
    params: dishCategoryIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateDishCategoryRequestSchema
        }
      }
    }
  },
  responses: {
    200: jsonResponse(dishCategoryMutationResponseSchema, "Dish category updated successfully"),
    ...errorResponses,
    404: jsonResponse(apiErrorResponseSchema, "Dish category not found")
  }
});
var deleteDishCategoryRoute = createRoute6({
  method: "delete",
  path: "/{id}",
  tags: tags3,
  summary: "Delete dish category",
  security: protectedSecurity,
  request: {
    params: dishCategoryIdParamsSchema
  },
  responses: {
    200: jsonResponse(dishCategoryMutationResponseSchema, "Dish category deleted successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid dish category id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Dish category not found"),
    500: errorResponses[500]
  }
});

// src/app/cafe/dish_category/route/dish-category.route.ts
var router6 = createOpenApiRouter();
registerDefaultSecuritySchemes(router6);
router6.use("*", jwtMiddleware, appTokenMiddleware, requirePermission());
registerOpenApiRoute(router6, getAllDishCategoriesRoute, DishCategoryController.getAll);
registerOpenApiRoute(router6, getDishCategoryByIdRoute, DishCategoryController.getById);
registerOpenApiRoute(router6, createDishCategoryRoute, DishCategoryController.create);
registerOpenApiRoute(router6, updateDishCategoryRoute, DishCategoryController.update);
registerOpenApiRoute(router6, deleteDishCategoryRoute, DishCategoryController.delete);
function getDishCategoryOpenApiDocument(baseUrl) {
  return createModuleOpenApiDocument(router6, baseUrl, "Dish Category API");
}
var dish_category_route_default = router6;

// src/app/cafe/dish/repository/dish-read.repository.ts
import { eq as eq12 } from "drizzle-orm";
class DishReadRepository {
  static async getAll() {
    try {
      return await db.select({
        id: dishes.id,
        dish_category_id: dishes.dish_category_id,
        name: dishes.name,
        slug: dishes.slug,
        description: dishes.description,
        price: dishes.price,
        thumbnail: dishes.thumbnail,
        thumbnail_public_id: dishes.thumbnail_public_id,
        is_available: dishes.is_available,
        is_active: dishes.is_active,
        created_at: dishes.created_at,
        updated_at: dishes.updated_at,
        category: {
          id: dish_categories.id,
          name: dish_categories.name,
          icon: dish_categories.icon
        }
      }).from(dishes).leftJoin(dish_categories, eq12(dishes.dish_category_id, dish_categories.id));
    } catch (error) {
      throw new Error(`Failed to fetch dishes: ${error}`);
    }
  }
  static async getById(id) {
    try {
      const result = await db.select({
        id: dishes.id,
        dish_category_id: dishes.dish_category_id,
        name: dishes.name,
        slug: dishes.slug,
        description: dishes.description,
        price: dishes.price,
        thumbnail: dishes.thumbnail,
        thumbnail_public_id: dishes.thumbnail_public_id,
        is_available: dishes.is_available,
        is_active: dishes.is_active,
        created_at: dishes.created_at,
        updated_at: dishes.updated_at,
        category: {
          id: dish_categories.id,
          name: dish_categories.name,
          icon: dish_categories.icon
        }
      }).from(dishes).leftJoin(dish_categories, eq12(dishes.dish_category_id, dish_categories.id)).where(eq12(dishes.id, id)).limit(1);
      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch dish: ${error}`);
    }
  }
}

// src/app/cafe/dish/repository/dish-write.repository.ts
import { eq as eq13 } from "drizzle-orm";
class DishWriteRepository {
  static async create(data) {
    try {
      return await db.insert(dishes).values(data);
    } catch (error) {
      throw new Error(`Failed to create dish: ${error}`);
    }
  }
  static async update(id, data) {
    try {
      return await db.update(dishes).set({
        ...data,
        updated_at: new Date
      }).where(eq13(dishes.id, id));
    } catch (error) {
      throw new Error(`Failed to update dish: ${error}`);
    }
  }
  static async delete(id) {
    try {
      return await db.delete(dishes).where(eq13(dishes.id, id));
    } catch (error) {
      throw new Error(`Failed to delete dish: ${error}`);
    }
  }
}

// src/app/cafe/dish/service/dish.service.ts
class DishService {
  static async getAll() {
    return DishReadRepository.getAll();
  }
  static async getById(id) {
    return DishReadRepository.getById(id);
  }
  static async create(payload) {
    return DishWriteRepository.create(payload);
  }
  static async update(id, payload) {
    const dish = await DishReadRepository.getById(id);
    if (!dish) {
      return null;
    }
    const result = await DishWriteRepository.update(id, payload);
    return { dish, result };
  }
  static async delete(id) {
    const dish = await DishReadRepository.getById(id);
    if (!dish) {
      return null;
    }
    const result = await DishWriteRepository.delete(id);
    return { dish, result };
  }
}

// src/app/cafe/dish/controller/dish.controller.ts
class DishController {
  static async getAll(c) {
    const dishes2 = await DishService.getAll();
    return c.json({
      success: true,
      data: dishes2,
      message: "Dishes fetched successfully"
    });
  }
  static async getById(c) {
    const id = Number(c.req.param("id"));
    const dish = await DishService.getById(id);
    if (!dish) {
      return c.json({ success: false, message: "Dish not found" }, 404);
    }
    return c.json({
      success: true,
      data: dish,
      message: "Dish fetched successfully"
    });
  }
  static async create(c) {
    const body = await c.req.json();
    const result = await DishService.create(body);
    return c.json({
      success: true,
      data: result,
      message: "Dish created successfully"
    }, 201);
  }
  static async update(c) {
    const id = Number(c.req.param("id"));
    const body = await c.req.json();
    let oldPublicId = null;
    if (body.thumbnail_public_id !== undefined) {
      const existing = await DishService.getById(id);
      if (existing && existing.thumbnail_public_id !== body.thumbnail_public_id) {
        oldPublicId = existing.thumbnail_public_id;
      }
    }
    const updateResult = await DishService.update(id, body);
    if (!updateResult) {
      return c.json({ success: false, message: "Dish not found" }, 404);
    }
    if (oldPublicId) {
      await deleteImageFromCloudinarySafely(oldPublicId);
    }
    return c.json({
      success: true,
      data: updateResult.result,
      message: "Dish updated successfully"
    });
  }
  static async delete(c) {
    const id = Number(c.req.param("id"));
    const existing = await DishService.getById(id);
    if (!existing) {
      return c.json({ success: false, message: "Dish not found" }, 404);
    }
    const deleteResult = await DishService.delete(id);
    if (!deleteResult) {
      return c.json({ success: false, message: "Dish not found" }, 404);
    }
    if (existing.thumbnail_public_id) {
      await deleteImageFromCloudinarySafely(existing.thumbnail_public_id);
    }
    return c.json({
      success: true,
      data: deleteResult.result,
      message: "Dish deleted successfully"
    });
  }
}

// src/app/cafe/dish/route/dish.openapi.ts
import { createRoute as createRoute7 } from "@hono/zod-openapi";

// src/app/cafe/dish/dto/dish-request.dto.ts
import { z as z14 } from "@hono/zod-openapi";
var createDishRequestSchema = z14.object({
  dish_category_id: z14.number().int().min(1).openapi({ example: 1 }),
  name: z14.string().min(1).openapi({ example: "Nasi Goreng Spesial" }),
  slug: z14.string().min(1).openapi({ example: "nasi-goreng-spesial" }),
  description: z14.string().nullable().optional().openapi({ example: "Nasi goreng dengan telur dan ayam" }),
  price: z14.string().min(1).openapi({ example: "35000.00" }),
  thumbnail: z14.string().nullable().optional().openapi({ example: "https://res.cloudinary.com/xxx/image.jpg" }),
  thumbnail_public_id: z14.string().nullable().optional().openapi({ example: "uploads/dish-001" }),
  is_available: z14.boolean().optional().openapi({ example: false }),
  is_active: z14.boolean().optional().openapi({ example: false })
}).openapi("CreateDishRequest");
var updateDishRequestSchema = z14.object({
  dish_category_id: z14.number().int().min(1).optional().openapi({ example: 1 }),
  name: z14.string().min(1).optional().openapi({ example: "Nasi Goreng Special" }),
  slug: z14.string().min(1).optional().openapi({ example: "nasi-goreng-special" }),
  description: z14.string().nullable().optional().openapi({ example: "Nasi goreng premium" }),
  price: z14.string().min(1).optional().openapi({ example: "40000.00" }),
  thumbnail: z14.string().nullable().optional().openapi({ example: "https://res.cloudinary.com/xxx/image.jpg" }),
  thumbnail_public_id: z14.string().nullable().optional().openapi({ example: "uploads/dish-001" }),
  is_available: z14.boolean().optional().openapi({ example: true }),
  is_active: z14.boolean().optional().openapi({ example: true })
}).openapi("UpdateDishRequest");

// src/app/cafe/dish/dto/dish-response.dto.ts
import { z as z15 } from "@hono/zod-openapi";
var dishListResponseSchema = createSuccessEnvelopeSchema("DishListResponse", z15.array(dishSchema), "Dishes fetched successfully");
var dishDetailResponseSchema = createSuccessEnvelopeSchema("DishDetailResponse", dishSchema, "Dish fetched successfully");
var dishMutationResponseSchema = createSuccessEnvelopeSchema("DishMutationResponse", writeResultSchema, "Dish created successfully");

// src/app/cafe/dish/route/dish.openapi.ts
var tags4 = ["Dishes"];
var dishIdParamsSchema = createNumericPathParamsSchema("id");
var getAllDishesRoute = createRoute7({
  method: "get",
  path: "/",
  tags: tags4,
  summary: "Get all dishes",
  security: protectedSecurity,
  responses: {
    200: jsonResponse(dishListResponseSchema, "Dishes fetched successfully"),
    401: errorResponses[401],
    403: errorResponses[403],
    500: errorResponses[500]
  }
});
var getDishByIdRoute = createRoute7({
  method: "get",
  path: "/{id}",
  tags: tags4,
  summary: "Get dish by id",
  security: protectedSecurity,
  request: {
    params: dishIdParamsSchema
  },
  responses: {
    200: jsonResponse(dishDetailResponseSchema, "Dish fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid dish id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Dish not found"),
    500: errorResponses[500]
  }
});
var createDishRoute = createRoute7({
  method: "post",
  path: "/",
  tags: tags4,
  summary: "Create dish",
  security: protectedSecurity,
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createDishRequestSchema
        }
      }
    }
  },
  responses: {
    201: jsonResponse(dishMutationResponseSchema, "Dish created successfully"),
    ...errorResponses
  }
});
var updateDishRoute = createRoute7({
  method: "put",
  path: "/{id}",
  tags: tags4,
  summary: "Update dish",
  security: protectedSecurity,
  request: {
    params: dishIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateDishRequestSchema
        }
      }
    }
  },
  responses: {
    200: jsonResponse(dishMutationResponseSchema, "Dish updated successfully"),
    ...errorResponses,
    404: jsonResponse(apiErrorResponseSchema, "Dish not found")
  }
});
var deleteDishRoute = createRoute7({
  method: "delete",
  path: "/{id}",
  tags: tags4,
  summary: "Delete dish",
  security: protectedSecurity,
  request: {
    params: dishIdParamsSchema
  },
  responses: {
    200: jsonResponse(dishMutationResponseSchema, "Dish deleted successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid dish id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Dish not found"),
    500: errorResponses[500]
  }
});

// src/app/cafe/dish/route/dish.route.ts
var router7 = createOpenApiRouter();
registerDefaultSecuritySchemes(router7);
router7.use("*", jwtMiddleware, appTokenMiddleware, requirePermission());
registerOpenApiRoute(router7, getAllDishesRoute, DishController.getAll);
registerOpenApiRoute(router7, getDishByIdRoute, DishController.getById);
registerOpenApiRoute(router7, createDishRoute, DishController.create);
registerOpenApiRoute(router7, updateDishRoute, DishController.update);
registerOpenApiRoute(router7, deleteDishRoute, DishController.delete);
function getDishOpenApiDocument(baseUrl) {
  return createModuleOpenApiDocument(router7, baseUrl, "Dish API");
}
var dish_route_default = router7;

// src/app/public/cafe/dish_category/public-dish-category.route.ts
import { OpenAPIHono as OpenAPIHono2 } from "@hono/zod-openapi";

// src/app/public/cafe/dish_category/public-dish-category.openapi.ts
import { createRoute as createRoute8 } from "@hono/zod-openapi";

// src/app/public/cafe/dish_category/public-dish-category.dto.ts
import { z as z16 } from "@hono/zod-openapi";
var publicDishCategoryListResponseSchema = createSuccessEnvelopeSchema("PublicDishCategoryListResponse", z16.array(dishCategorySchema), "Public dish categories fetched successfully");

// src/app/public/cafe/dish_category/public-dish-category.openapi.ts
var tags5 = ["Dish Categories"];
var getPublicDishCategoriesRoute = createRoute8({
  method: "get",
  path: "/",
  tags: tags5,
  summary: "Get all dish categories (public)",
  security: [],
  responses: {
    200: jsonResponse(publicDishCategoryListResponseSchema, "Dish categories fetched successfully"),
    500: errorResponses[500]
  }
});

// src/app/public/cafe/dish_category/public-dish-category.repository.ts
class PublicDishCategoryRepository {
  static async getAll() {
    try {
      return await db.select().from(dish_categories);
    } catch (error) {
      throw new Error(`Failed to fetch public dish categories: ${error}`);
    }
  }
}

// src/app/public/cafe/dish_category/public-dish-category.service.ts
class PublicDishCategoryService {
  static async getAll() {
    return PublicDishCategoryRepository.getAll();
  }
}

// src/app/public/cafe/dish_category/public-dish-category.controller.ts
class PublicDishCategoryController {
  static async getPublic(c) {
    const categories = await PublicDishCategoryService.getAll();
    return c.json({
      success: true,
      data: categories,
      message: "Public dish categories fetched successfully"
    });
  }
}

// src/app/public/cafe/dish_category/public-dish-category.route.ts
var router8 = new OpenAPIHono2;
registerDefaultSecuritySchemes(router8);
registerOpenApiRoute(router8, getPublicDishCategoriesRoute, PublicDishCategoryController.getPublic);
var public_dish_category_route_default = router8;
function getPublicDishCategoryOpenApiDocument(baseUrl) {
  return router8.getOpenAPIDocument({
    openapi: "3.0.3",
    info: {
      title: "Public Dish Categories API",
      version: "1.0.0"
    },
    servers: [{ url: baseUrl }]
  });
}

// src/app/public/cafe/dish/public-dish.route.ts
import { OpenAPIHono as OpenAPIHono3 } from "@hono/zod-openapi";

// src/app/public/cafe/dish/public-dish.openapi.ts
import { createRoute as createRoute9 } from "@hono/zod-openapi";

// src/app/public/cafe/dish/public-dish.dto.ts
import { z as z17 } from "@hono/zod-openapi";
var publicDishListResponseSchema = createSuccessEnvelopeSchema("PublicDishListResponse", z17.array(dishSchema), "Public dishes fetched successfully");

// src/app/public/cafe/dish/public-dish.openapi.ts
var tags6 = ["Dishes"];
var getPublicDishesRoute = createRoute9({
  method: "get",
  path: "/",
  tags: tags6,
  summary: "Get all dishes (public)",
  security: [],
  responses: {
    200: jsonResponse(publicDishListResponseSchema, "Dishes fetched successfully"),
    500: errorResponses[500]
  }
});

// src/app/public/cafe/dish/public-dish.repository.ts
import { eq as eq14 } from "drizzle-orm";
class PublicDishRepository {
  static async getAll() {
    try {
      return await db.select({
        id: dishes.id,
        dish_category_id: dishes.dish_category_id,
        name: dishes.name,
        slug: dishes.slug,
        description: dishes.description,
        price: dishes.price,
        thumbnail: dishes.thumbnail,
        thumbnail_public_id: dishes.thumbnail_public_id,
        is_available: dishes.is_available,
        is_active: dishes.is_active,
        created_at: dishes.created_at,
        updated_at: dishes.updated_at,
        category: {
          id: dish_categories.id,
          name: dish_categories.name,
          icon: dish_categories.icon
        }
      }).from(dishes).leftJoin(dish_categories, eq14(dishes.dish_category_id, dish_categories.id)).where(eq14(dishes.is_active, true));
    } catch (error) {
      throw new Error(`Failed to fetch public dishes: ${error}`);
    }
  }
}

// src/app/public/cafe/dish/public-dish.service.ts
class PublicDishService {
  static async getAll() {
    return PublicDishRepository.getAll();
  }
}

// src/app/public/cafe/dish/public-dish.controller.ts
class PublicDishController {
  static async getPublic(c) {
    const dishes2 = await PublicDishService.getAll();
    return c.json({
      success: true,
      data: dishes2,
      message: "Public dishes fetched successfully"
    });
  }
}

// src/app/public/cafe/dish/public-dish.route.ts
var router9 = new OpenAPIHono3;
registerDefaultSecuritySchemes(router9);
registerOpenApiRoute(router9, getPublicDishesRoute, PublicDishController.getPublic);
function getPublicDishOpenApiDocument(baseUrl) {
  return createModuleOpenApiDocument(router9, baseUrl, "Public Dish API");
}
var public_dish_route_default = router9;

// src/app/public/billiard/billiard_table_type/public-billiard-table-type.route.ts
import { OpenAPIHono as OpenAPIHono4 } from "@hono/zod-openapi";

// src/app/public/billiard/billiard_table_type/public-billiard-table-type.openapi.ts
import { createRoute as createRoute10 } from "@hono/zod-openapi";

// src/app/public/billiard/billiard_table_type/public-billiard-table-type.dto.ts
import { z as z18 } from "@hono/zod-openapi";
var PublicBilliardTableTypeListResponseSchema = createSuccessEnvelopeSchema("PublicBilliardTableTypeListResponse", z18.array(billiardTableTypeSchema), "Public billiard table types fetched successfully");

// src/app/public/billiard/billiard_table_type/public-billiard-table-type.openapi.ts
var getPublicBilliardTableTypesRoute = createRoute10({
  method: "get",
  path: "/",
  tags: ["Public Billiard Table Types"],
  summary: "Get all public billiard table types",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: PublicBilliardTableTypeListResponseSchema
        }
      },
      description: "List of all public billiard table types"
    }
  }
});

// src/app/public/billiard/billiard_table_type/public-billiard-table-type.repository.ts
class PublicBilliardTableTypeRepository {
  static async getAll() {
    try {
      return await db.select().from(billiard_table_types);
    } catch (error) {
      throw new Error(`Failed to fetch public billiard table types: ${error}`);
    }
  }
}

// src/app/public/billiard/billiard_table_type/public-billiard-table-type.service.ts
class PublicBilliardTableTypeService {
  static async getAll() {
    return PublicBilliardTableTypeRepository.getAll();
  }
}

// src/app/public/billiard/billiard_table_type/public-billiard-table-type.controller.ts
class PublicBilliardTableTypeController {
  static async getPublic(c) {
    const tableTypes = await PublicBilliardTableTypeService.getAll();
    return c.json({
      success: true,
      data: tableTypes,
      message: "Public billiard table types fetched successfully"
    });
  }
}

// src/app/public/billiard/billiard_table_type/public-billiard-table-type.route.ts
var router10 = new OpenAPIHono4;
registerDefaultSecuritySchemes(router10);
registerOpenApiRoute(router10, getPublicBilliardTableTypesRoute, PublicBilliardTableTypeController.getPublic);
function getPublicBilliardTableTypeOpenApiDocument(baseUrl) {
  return createModuleOpenApiDocument(router10, baseUrl, "Public Billiard Table Type API");
}
var public_billiard_table_type_route_default = router10;

// src/app/public/billiard/billiard_table/public-billiard-table.route.ts
import { OpenAPIHono as OpenAPIHono5 } from "@hono/zod-openapi";

// src/app/public/billiard/billiard_table/public-billiard-table.openapi.ts
import { createRoute as createRoute11 } from "@hono/zod-openapi";

// src/app/public/billiard/billiard_table/public-billiard-table.dto.ts
import { z as z19 } from "@hono/zod-openapi";
var PublicBilliardTableListResponseSchema = createSuccessEnvelopeSchema("PublicBilliardTableListResponse", z19.array(billiardTableSchema), "Public billiard tables fetched successfully");

// src/app/public/billiard/billiard_table/public-billiard-table.openapi.ts
var tags7 = ["Public Billiard Tables"];
var getPublicBilliardTablesRoute = createRoute11({
  method: "get",
  path: "/",
  tags: tags7,
  summary: "Get all dishes (public)",
  security: [],
  responses: {
    200: jsonResponse(PublicBilliardTableListResponseSchema, "Public billiard tables fetched successfully"),
    500: errorResponses[500]
  }
});

// src/app/public/billiard/billiard_table/public-billiard-table.repository.ts
import { eq as eq15 } from "drizzle-orm";
class PublicBilliardTableRepository {
  static async getAll() {
    try {
      return await db.select({
        id: billiard_tables.id,
        table_type_id: billiard_tables.table_type_id,
        name: billiard_tables.name,
        slug: billiard_tables.slug,
        price: billiard_tables.price,
        thumbnail: billiard_tables.thumbnail,
        thumbnail_public_id: billiard_tables.thumbnail_public_id,
        is_available: billiard_tables.is_available,
        is_active: billiard_tables.is_active,
        created_at: billiard_tables.created_at,
        updated_at: billiard_tables.updated_at,
        type: {
          id: billiard_table_types.id,
          name: billiard_table_types.name,
          icon: billiard_table_types.icon
        }
      }).from(billiard_tables).leftJoin(billiard_table_types, eq15(billiard_tables.table_type_id, billiard_table_types.id)).where(eq15(billiard_tables.is_active, true));
    } catch (error) {
      throw new Error(`Failed to fetch public billiard tables: ${error}`);
    }
  }
}

// src/app/public/billiard/billiard_table/public-billiard-table.service.ts
class PublicBilliardTableService {
  static async getAll() {
    return PublicBilliardTableRepository.getAll();
  }
}

// src/app/public/billiard/billiard_table/public-billiard-table.controller.ts
class PublicBilliardTableController {
  static async getPublic(c) {
    const tables = await PublicBilliardTableService.getAll();
    return c.json({
      success: true,
      data: tables,
      message: "Public billiard tables fetched successfully"
    });
  }
}

// src/app/public/billiard/billiard_table/public-billiard-table.route.ts
var router11 = new OpenAPIHono5;
registerDefaultSecuritySchemes(router11);
registerOpenApiRoute(router11, getPublicBilliardTablesRoute, PublicBilliardTableController.getPublic);
function getPublicBilliardTableOpenApiDocument(baseUrl) {
  return createModuleOpenApiDocument(router11, baseUrl, "Public Billiard Table API");
}
var public_billiard_table_route_default = router11;

// src/app/public/billiard/schedule/public-schedule.route.ts
import { OpenAPIHono as OpenAPIHono6 } from "@hono/zod-openapi";

// src/app/public/billiard/schedule/public-schedule.openapi.ts
import { createRoute as createRoute12 } from "@hono/zod-openapi";

// src/app/public/billiard/schedule/public-schedule.dto.ts
import { z as z20 } from "@hono/zod-openapi";
var PublicScheduleListResponseSchema = createSuccessEnvelopeSchema("PublicScheduleListResponse", z20.array(scheduleSchema), "Public schedules fetched successfully");

// src/app/public/billiard/schedule/public-schedule.openapi.ts
var getPublicSchedulesRoute = createRoute12({
  method: "get",
  path: "/",
  tags: ["Public Billiard Schedules"],
  summary: "Get all public billiard schedules",
  description: "Retrieve a list of all available billiard schedules (publicly accessible).",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: PublicScheduleListResponseSchema
        }
      },
      description: "Successfully retrieved public schedules"
    }
  }
});

// src/app/public/billiard/schedule/public-schedule.repository.ts
class PublicScheduleRepository {
  static async getAll() {
    try {
      return await db.select().from(schedules);
    } catch (error) {
      throw new Error(`Failed to fetch public schedules: ${error}`);
    }
  }
}

// src/app/public/billiard/schedule/public-schedule.service.ts
class PublicScheduleService {
  static async getAll() {
    return PublicScheduleRepository.getAll();
  }
}

// src/app/public/billiard/schedule/public-schedule.controller.ts
class PublicScheduleController {
  static async getPublic(c) {
    const tableSchedules = await PublicScheduleService.getAll();
    return c.json({
      success: true,
      data: tableSchedules,
      message: "Public billiard schedules fetched successfully"
    });
  }
}

// src/app/public/billiard/schedule/public-schedule.route.ts
var router12 = new OpenAPIHono6;
registerDefaultSecuritySchemes(router12);
registerOpenApiRoute(router12, getPublicSchedulesRoute, PublicScheduleController.getPublic);
var public_schedule_route_default = router12;

// src/app/cafe/dish_image/repository/dish-image-read.repository.ts
import { eq as eq16 } from "drizzle-orm";
class DishImageReadRepository {
  static async getAll() {
    try {
      return await db.select().from(dish_images);
    } catch (error) {
      throw new Error(`Failed to fetch dish images: ${error}`);
    }
  }
  static async getById(id) {
    try {
      const result = await db.select().from(dish_images).where(eq16(dish_images.id, id)).limit(1);
      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch dish image: ${error}`);
    }
  }
  static async getByDishId(dishId) {
    try {
      return await db.select().from(dish_images).where(eq16(dish_images.dish_id, dishId));
    } catch (error) {
      throw new Error(`Failed to fetch dish images: ${error}`);
    }
  }
}

// src/app/cafe/dish_image/repository/dish-image-write.repository.ts
import { eq as eq17 } from "drizzle-orm";
class DishImageWriteRepository {
  static async create(data) {
    try {
      return await db.insert(dish_images).values(data);
    } catch (error) {
      throw new Error(`Failed to create dish image: ${error}`);
    }
  }
  static async update(id, data) {
    try {
      return await db.update(dish_images).set({
        ...data,
        updated_at: new Date
      }).where(eq17(dish_images.id, id));
    } catch (error) {
      throw new Error(`Failed to update dish image: ${error}`);
    }
  }
  static async delete(id) {
    try {
      return await db.delete(dish_images).where(eq17(dish_images.id, id));
    } catch (error) {
      throw new Error(`Failed to delete dish image: ${error}`);
    }
  }
}

// src/app/cafe/dish_image/service/dish-image.service.ts
class DishImageService {
  static async getAll() {
    return DishImageReadRepository.getAll();
  }
  static async getById(id) {
    return DishImageReadRepository.getById(id);
  }
  static async create(payload) {
    return DishImageWriteRepository.create(payload);
  }
  static async update(id, payload) {
    const image = await DishImageReadRepository.getById(id);
    if (!image) {
      return null;
    }
    const result = await DishImageWriteRepository.update(id, payload);
    return { image, result };
  }
  static async delete(id) {
    const image = await DishImageReadRepository.getById(id);
    if (!image) {
      return null;
    }
    const result = await DishImageWriteRepository.delete(id);
    return { image, result };
  }
}

// src/app/cafe/dish_image/controller/dish-image.controller.ts
class DishImageController {
  static async getAll(c) {
    const images = await DishImageService.getAll();
    return c.json({
      success: true,
      data: images,
      message: "Dish images fetched successfully"
    });
  }
  static async getById(c) {
    const id = Number(c.req.param("id"));
    const image = await DishImageService.getById(id);
    if (!image) {
      return c.json({ success: false, message: "Dish image not found" }, 404);
    }
    return c.json({
      success: true,
      data: image,
      message: "Dish image fetched successfully"
    });
  }
  static async create(c) {
    const body = await c.req.json();
    const result = await DishImageService.create(body);
    return c.json({
      success: true,
      data: result,
      message: "Dish image created successfully"
    }, 201);
  }
  static async update(c) {
    const id = Number(c.req.param("id"));
    const body = await c.req.json();
    let oldPublicId = null;
    if (body.image_public_id !== undefined) {
      const existing = await DishImageService.getById(id);
      if (existing && existing.image_public_id !== body.image_public_id) {
        oldPublicId = existing.image_public_id;
      }
    }
    const updateResult = await DishImageService.update(id, body);
    if (!updateResult) {
      return c.json({ success: false, message: "Dish image not found" }, 404);
    }
    if (oldPublicId) {
      await deleteImageFromCloudinarySafely(oldPublicId);
    }
    return c.json({
      success: true,
      data: updateResult.result,
      message: "Dish image updated successfully"
    });
  }
  static async delete(c) {
    const id = Number(c.req.param("id"));
    const existing = await DishImageService.getById(id);
    if (!existing) {
      return c.json({ success: false, message: "Dish image not found" }, 404);
    }
    const deleteResult = await DishImageService.delete(id);
    if (!deleteResult) {
      return c.json({ success: false, message: "Dish image not found" }, 404);
    }
    if (existing.image_public_id) {
      await deleteImageFromCloudinarySafely(existing.image_public_id);
    }
    return c.json({
      success: true,
      data: deleteResult.result,
      message: "Dish image deleted successfully"
    });
  }
}

// src/app/cafe/dish_image/route/dish-image.openapi.ts
import { createRoute as createRoute13 } from "@hono/zod-openapi";

// src/app/cafe/dish_image/dto/dish-image-request.dto.ts
import { z as z21 } from "@hono/zod-openapi";
var createDishImageRequestSchema = z21.object({
  dish_id: z21.number().int().min(1).openapi({ example: 1 }),
  image: z21.string().min(1).openapi({ example: "https://res.cloudinary.com/xxx/dish-001.jpg" }),
  image_public_id: z21.string().min(1).openapi({ example: "uploads/dish-001" })
}).openapi("CreateDishImageRequest");
var updateDishImageRequestSchema = z21.object({
  dish_id: z21.number().int().min(1).optional().openapi({ example: 1 }),
  image: z21.string().min(1).optional().openapi({ example: "https://res.cloudinary.com/xxx/dish-002.jpg" }),
  image_public_id: z21.string().min(1).optional().openapi({ example: "uploads/dish-002" })
}).openapi("UpdateDishImageRequest");

// src/app/cafe/dish_image/dto/dish-image-response.dto.ts
import { z as z22 } from "@hono/zod-openapi";
var dishImageListResponseSchema = createSuccessEnvelopeSchema("DishImageListResponse", z22.array(dishImageSchema), "Dish images fetched successfully");
var dishImageDetailResponseSchema = createSuccessEnvelopeSchema("DishImageDetailResponse", dishImageSchema, "Dish image fetched successfully");
var dishImageMutationResponseSchema = createSuccessEnvelopeSchema("DishImageMutationResponse", writeResultSchema, "Dish image created successfully");

// src/app/cafe/dish_image/route/dish-image.openapi.ts
var tags8 = ["Dish Images"];
var dishImageIdParamsSchema = createNumericPathParamsSchema("id");
var getAllDishImagesRoute = createRoute13({
  method: "get",
  path: "/",
  tags: tags8,
  summary: "Get all dish images",
  security: protectedSecurity,
  responses: {
    200: jsonResponse(dishImageListResponseSchema, "Dish images fetched successfully"),
    401: errorResponses[401],
    403: errorResponses[403],
    500: errorResponses[500]
  }
});
var getDishImageByIdRoute = createRoute13({
  method: "get",
  path: "/{id}",
  tags: tags8,
  summary: "Get dish image by id",
  security: protectedSecurity,
  request: {
    params: dishImageIdParamsSchema
  },
  responses: {
    200: jsonResponse(dishImageDetailResponseSchema, "Dish image fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid dish image id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Dish image not found"),
    500: errorResponses[500]
  }
});
var createDishImageRoute = createRoute13({
  method: "post",
  path: "/",
  tags: tags8,
  summary: "Create dish image",
  security: protectedSecurity,
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createDishImageRequestSchema
        }
      }
    }
  },
  responses: {
    201: jsonResponse(dishImageMutationResponseSchema, "Dish image created successfully"),
    ...errorResponses
  }
});
var updateDishImageRoute = createRoute13({
  method: "put",
  path: "/{id}",
  tags: tags8,
  summary: "Update dish image",
  security: protectedSecurity,
  request: {
    params: dishImageIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateDishImageRequestSchema
        }
      }
    }
  },
  responses: {
    200: jsonResponse(dishImageMutationResponseSchema, "Dish image updated successfully"),
    ...errorResponses,
    404: jsonResponse(apiErrorResponseSchema, "Dish image not found")
  }
});
var deleteDishImageRoute = createRoute13({
  method: "delete",
  path: "/{id}",
  tags: tags8,
  summary: "Delete dish image",
  security: protectedSecurity,
  request: {
    params: dishImageIdParamsSchema
  },
  responses: {
    200: jsonResponse(dishImageMutationResponseSchema, "Dish image deleted successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid dish image id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Dish image not found"),
    500: errorResponses[500]
  }
});

// src/app/cafe/dish_image/route/dish-image.route.ts
var router13 = createOpenApiRouter();
registerDefaultSecuritySchemes(router13);
router13.use("*", jwtMiddleware, appTokenMiddleware, requirePermission());
registerOpenApiRoute(router13, getAllDishImagesRoute, DishImageController.getAll);
registerOpenApiRoute(router13, getDishImageByIdRoute, DishImageController.getById);
registerOpenApiRoute(router13, createDishImageRoute, DishImageController.create);
registerOpenApiRoute(router13, updateDishImageRoute, DishImageController.update);
registerOpenApiRoute(router13, deleteDishImageRoute, DishImageController.delete);
function getDishImageOpenApiDocument(baseUrl) {
  return createModuleOpenApiDocument(router13, baseUrl, "Dish Image API");
}
var dish_image_route_default = router13;

// src/app/cafe/dish_order/repository/dish-order-read.repository.ts
import { eq as eq18, desc } from "drizzle-orm";
class DishOrderReadRepository {
  static async getAll() {
    try {
      const results = await db.select({
        id: dish_orders.id,
        guest_name: dish_orders.guest_name,
        guest_phone: dish_orders.guest_phone,
        total: dish_orders.total,
        tax: dish_orders.tax,
        service_fee: dish_orders.service_fee,
        nett_price: dish_orders.nett_price,
        status: dish_orders.status,
        created_at: dish_orders.created_at,
        updated_at: dish_orders.updated_at,
        payment_status: payments.status,
        payment_method: payments.method
      }).from(dish_orders).leftJoin(payments, eq18(dish_orders.id, payments.dish_order_id)).orderBy(desc(dish_orders.created_at));
      return results;
    } catch (error) {
      throw new Error(`Failed to fetch dish orders: ${error}`);
    }
  }
  static async getById(id) {
    try {
      const result = await db.select({
        id: dish_orders.id,
        guest_name: dish_orders.guest_name,
        guest_phone: dish_orders.guest_phone,
        total: dish_orders.total,
        tax: dish_orders.tax,
        service_fee: dish_orders.service_fee,
        nett_price: dish_orders.nett_price,
        status: dish_orders.status,
        created_at: dish_orders.created_at,
        updated_at: dish_orders.updated_at,
        payment_status: payments.status,
        payment_method: payments.method
      }).from(dish_orders).leftJoin(payments, eq18(dish_orders.id, payments.dish_order_id)).where(eq18(dish_orders.id, id)).limit(1);
      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch dish order: ${error}`);
    }
  }
  static async getOrderDetailsWithDish(dishOrderId) {
    try {
      const results = await db.select({
        id: dish_order_details.id,
        quantity: dish_order_details.quantity,
        dish_name: dishes.name
      }).from(dish_order_details).leftJoin(dishes, eq18(dish_order_details.dish_id, dishes.id)).where(eq18(dish_order_details.dish_order_id, dishOrderId));
      return results;
    } catch (error) {
      throw new Error(`Failed to fetch dish order details: ${error}`);
    }
  }
}

// src/app/cafe/dish_order/repository/dish-order-write.repository.ts
import { eq as eq19 } from "drizzle-orm";
class DishOrderWriteRepository {
  static async create(data) {
    try {
      return await db.insert(dish_orders).values(data);
    } catch (error) {
      throw new Error(`Failed to create dish order: ${error}`);
    }
  }
  static async update(id, data) {
    try {
      return await db.update(dish_orders).set({
        ...data,
        updated_at: new Date
      }).where(eq19(dish_orders.id, id));
    } catch (error) {
      throw new Error(`Failed to update dish order: ${error}`);
    }
  }
  static async delete(id) {
    try {
      return await db.delete(dish_orders).where(eq19(dish_orders.id, id));
    } catch (error) {
      throw new Error(`Failed to delete dish order: ${error}`);
    }
  }
}

// src/app/cafe/dish_order/service/dish-order.service.ts
class DishOrderService {
  static async getAll() {
    return DishOrderReadRepository.getAll();
  }
  static async getById(id) {
    return DishOrderReadRepository.getById(id);
  }
  static async create(payload) {
    return DishOrderWriteRepository.create(payload);
  }
  static async update(id, payload) {
    const order = await DishOrderReadRepository.getById(id);
    if (!order) {
      return null;
    }
    const result = await DishOrderWriteRepository.update(id, payload);
    return { order, result };
  }
  static async delete(id) {
    const order = await DishOrderReadRepository.getById(id);
    if (!order) {
      return null;
    }
    const result = await DishOrderWriteRepository.delete(id);
    return { order, result };
  }
}

// src/app/cafe/dish_order/controller/dish-order.controller.ts
class DishOrderController {
  static async getAll(c) {
    const orders = await DishOrderService.getAll();
    return c.json({
      success: true,
      data: orders,
      message: "Dish orders fetched successfully"
    });
  }
  static async getById(c) {
    const id = Number(c.req.param("id"));
    const order = await DishOrderService.getById(id);
    if (!order) {
      return c.json({ success: false, message: "Dish order not found" }, 404);
    }
    return c.json({
      success: true,
      data: order,
      message: "Dish order fetched successfully"
    });
  }
  static async create(c) {
    const body = await c.req.json();
    const result = await DishOrderService.create(body);
    return c.json({
      success: true,
      data: result,
      message: "Dish order created successfully"
    }, 201);
  }
  static async update(c) {
    const id = Number(c.req.param("id"));
    const body = await c.req.json();
    const updateResult = await DishOrderService.update(id, body);
    if (!updateResult) {
      return c.json({ success: false, message: "Dish order not found" }, 404);
    }
    return c.json({
      success: true,
      data: updateResult.result,
      message: "Dish order updated successfully"
    });
  }
  static async delete(c) {
    const id = Number(c.req.param("id"));
    const deleteResult = await DishOrderService.delete(id);
    if (!deleteResult) {
      return c.json({ success: false, message: "Dish order not found" }, 404);
    }
    return c.json({
      success: true,
      data: deleteResult.result,
      message: "Dish order deleted successfully"
    });
  }
}

// src/app/cafe/dish_order/route/dish-order.openapi.ts
import { createRoute as createRoute14 } from "@hono/zod-openapi";

// src/app/cafe/dish_order/dto/dish-order-request.dto.ts
import { z as z23 } from "@hono/zod-openapi";
var createDishOrderRequestSchema = z23.object({
  guest_name: z23.string().min(1).openapi({ example: "John Doe" }),
  guest_phone: z23.string().min(1).openapi({ example: "081234567890" }),
  total: z23.string().min(1).openapi({ example: "100000.00" }),
  tax: z23.string().min(1).openapi({ example: "11000.00" }),
  service_fee: z23.string().min(1).openapi({ example: "5000.00" }),
  nett_price: z23.string().min(1).openapi({ example: "116000.00" }),
  status: z23.enum(["pending", "confirmed", "preparing", "completed", "cancelled"]).optional().openapi({ example: "pending" })
}).openapi("CreateDishOrderRequest");
var updateDishOrderRequestSchema = z23.object({
  guest_name: z23.string().min(1).optional().openapi({ example: "Jane Doe" }),
  guest_phone: z23.string().min(1).optional().openapi({ example: "089876543210" }),
  total: z23.string().min(1).optional().openapi({ example: "150000.00" }),
  tax: z23.string().min(1).optional().openapi({ example: "16500.00" }),
  service_fee: z23.string().min(1).optional().openapi({ example: "7500.00" }),
  nett_price: z23.string().min(1).optional().openapi({ example: "174000.00" }),
  status: z23.enum(["pending", "confirmed", "preparing", "completed", "cancelled"]).optional().openapi({ example: "confirmed" })
}).openapi("UpdateDishOrderRequest");

// src/app/cafe/dish_order/dto/dish-order-response.dto.ts
import { z as z24 } from "@hono/zod-openapi";
var dishOrderListResponseSchema = createSuccessEnvelopeSchema("DishOrderListResponse", z24.array(dishOrderSchema), "Dish orders fetched successfully");
var dishOrderDetailResponseSchema = createSuccessEnvelopeSchema("DishOrderDetailResponse", dishOrderSchema, "Dish order fetched successfully");
var dishOrderMutationResponseSchema = createSuccessEnvelopeSchema("DishOrderMutationResponse", writeResultSchema, "Dish order created successfully");

// src/app/cafe/dish_order/route/dish-order.openapi.ts
var tags9 = ["Dish Orders"];
var dishOrderIdParamsSchema = createNumericPathParamsSchema("id");
var getAllDishOrdersRoute = createRoute14({
  method: "get",
  path: "/",
  tags: tags9,
  summary: "Get all dish orders",
  security: protectedSecurity,
  responses: {
    200: jsonResponse(dishOrderListResponseSchema, "Dish orders fetched successfully"),
    401: errorResponses[401],
    403: errorResponses[403],
    500: errorResponses[500]
  }
});
var getDishOrderByIdRoute = createRoute14({
  method: "get",
  path: "/{id}",
  tags: tags9,
  summary: "Get dish order by id",
  security: protectedSecurity,
  request: {
    params: dishOrderIdParamsSchema
  },
  responses: {
    200: jsonResponse(dishOrderDetailResponseSchema, "Dish order fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid dish order id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Dish order not found"),
    500: errorResponses[500]
  }
});
var createDishOrderRoute = createRoute14({
  method: "post",
  path: "/",
  tags: tags9,
  summary: "Create dish order",
  security: protectedSecurity,
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createDishOrderRequestSchema
        }
      }
    }
  },
  responses: {
    201: jsonResponse(dishOrderMutationResponseSchema, "Dish order created successfully"),
    ...errorResponses
  }
});
var updateDishOrderRoute = createRoute14({
  method: "put",
  path: "/{id}",
  tags: tags9,
  summary: "Update dish order",
  security: protectedSecurity,
  request: {
    params: dishOrderIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateDishOrderRequestSchema
        }
      }
    }
  },
  responses: {
    200: jsonResponse(dishOrderMutationResponseSchema, "Dish order updated successfully"),
    ...errorResponses,
    404: jsonResponse(apiErrorResponseSchema, "Dish order not found")
  }
});
var deleteDishOrderRoute = createRoute14({
  method: "delete",
  path: "/{id}",
  tags: tags9,
  summary: "Delete dish order",
  security: protectedSecurity,
  request: {
    params: dishOrderIdParamsSchema
  },
  responses: {
    200: jsonResponse(dishOrderMutationResponseSchema, "Dish order deleted successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid dish order id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Dish order not found"),
    500: errorResponses[500]
  }
});

// src/app/cafe/dish_order/route/dish-order.route.ts
var router14 = createOpenApiRouter();
registerDefaultSecuritySchemes(router14);
router14.use("*", jwtMiddleware, appTokenMiddleware, requirePermission());
registerOpenApiRoute(router14, getAllDishOrdersRoute, DishOrderController.getAll);
registerOpenApiRoute(router14, getDishOrderByIdRoute, DishOrderController.getById);
registerOpenApiRoute(router14, createDishOrderRoute, DishOrderController.create);
registerOpenApiRoute(router14, updateDishOrderRoute, DishOrderController.update);
registerOpenApiRoute(router14, deleteDishOrderRoute, DishOrderController.delete);
function getDishOrderOpenApiDocument(baseUrl) {
  return createModuleOpenApiDocument(router14, baseUrl, "Dish Order API");
}
var dish_order_route_default = router14;

// src/app/cafe/dish_order_detail/repository/dish-order-detail-read.repository.ts
import { eq as eq20 } from "drizzle-orm";
class DishOrderDetailReadRepository {
  static async getAll() {
    try {
      return await db.select({
        id: dish_order_details.id,
        dish_order_id: dish_order_details.dish_order_id,
        dish_id: dish_order_details.dish_id,
        quantity: dish_order_details.quantity,
        notes: dish_order_details.notes,
        created_at: dish_order_details.created_at,
        updated_at: dish_order_details.updated_at,
        dish: {
          id: dishes.id,
          name: dishes.name,
          slug: dishes.slug,
          price: dishes.price,
          thumbnail: dishes.thumbnail
        }
      }).from(dish_order_details).leftJoin(dishes, eq20(dish_order_details.dish_id, dishes.id));
    } catch (error) {
      throw new Error(`Failed to fetch dish order details: ${error}`);
    }
  }
  static async getById(id) {
    try {
      const result = await db.select({
        id: dish_order_details.id,
        dish_order_id: dish_order_details.dish_order_id,
        dish_id: dish_order_details.dish_id,
        quantity: dish_order_details.quantity,
        notes: dish_order_details.notes,
        created_at: dish_order_details.created_at,
        updated_at: dish_order_details.updated_at,
        dish: {
          id: dishes.id,
          name: dishes.name,
          slug: dishes.slug,
          price: dishes.price,
          thumbnail: dishes.thumbnail
        }
      }).from(dish_order_details).leftJoin(dishes, eq20(dish_order_details.dish_id, dishes.id)).where(eq20(dish_order_details.id, id)).limit(1);
      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch dish order detail: ${error}`);
    }
  }
  static async getByOrderId(orderId) {
    try {
      return await db.select({
        id: dish_order_details.id,
        dish_order_id: dish_order_details.dish_order_id,
        dish_id: dish_order_details.dish_id,
        quantity: dish_order_details.quantity,
        notes: dish_order_details.notes,
        created_at: dish_order_details.created_at,
        updated_at: dish_order_details.updated_at,
        dish: {
          id: dishes.id,
          name: dishes.name,
          slug: dishes.slug,
          price: dishes.price,
          thumbnail: dishes.thumbnail
        }
      }).from(dish_order_details).leftJoin(dishes, eq20(dish_order_details.dish_id, dishes.id)).where(eq20(dish_order_details.dish_order_id, orderId));
    } catch (error) {
      throw new Error(`Failed to fetch dish order details: ${error}`);
    }
  }
}

// src/app/cafe/dish_order_detail/repository/dish-order-detail-write.repository.ts
import { eq as eq21 } from "drizzle-orm";
class DishOrderDetailWriteRepository {
  static async create(data) {
    try {
      return await db.insert(dish_order_details).values(data);
    } catch (error) {
      throw new Error(`Failed to create dish order detail: ${error}`);
    }
  }
  static async update(id, data) {
    try {
      return await db.update(dish_order_details).set({
        ...data,
        updated_at: new Date
      }).where(eq21(dish_order_details.id, id));
    } catch (error) {
      throw new Error(`Failed to update dish order detail: ${error}`);
    }
  }
  static async delete(id) {
    try {
      return await db.delete(dish_order_details).where(eq21(dish_order_details.id, id));
    } catch (error) {
      throw new Error(`Failed to delete dish order detail: ${error}`);
    }
  }
}

// src/app/cafe/dish_order_detail/service/dish-order-detail.service.ts
import { eq as eq22 } from "drizzle-orm";

class DishOrderDetailService {
  static async getAll() {
    return DishOrderDetailReadRepository.getAll();
  }
  static async getById(id) {
    return DishOrderDetailReadRepository.getById(id);
  }
  static async recalculateOrderTotals(dishOrderId) {
    try {
      const details = await db.select({
        quantity: dish_order_details.quantity,
        price: dishes.price
      }).from(dish_order_details).leftJoin(dishes, eq22(dish_order_details.dish_id, dishes.id)).where(eq22(dish_order_details.dish_order_id, dishOrderId));
      let total = 0;
      for (const item of details) {
        if (item.price && item.quantity) {
          total += Number(item.price) * item.quantity;
        }
      }
      const tax = total * 0.11;
      const serviceFee = total * 0.05;
      const nettPrice = total + tax + serviceFee;
      await DishOrderWriteRepository.update(dishOrderId, {
        total: total.toFixed(2),
        tax: tax.toFixed(2),
        service_fee: serviceFee.toFixed(2),
        nett_price: nettPrice.toFixed(2)
      });
    } catch (error) {
      console.error("Failed to recalculate order totals:", error);
    }
  }
  static async create(payload) {
    const result = await DishOrderDetailWriteRepository.create(payload);
    await this.recalculateOrderTotals(payload.dish_order_id);
    return result;
  }
  static async update(id, payload) {
    const detail = await DishOrderDetailReadRepository.getById(id);
    if (!detail) {
      return null;
    }
    const result = await DishOrderDetailWriteRepository.update(id, payload);
    await this.recalculateOrderTotals(detail.dish_order_id);
    return { detail, result };
  }
  static async delete(id) {
    const detail = await DishOrderDetailReadRepository.getById(id);
    if (!detail) {
      return null;
    }
    const result = await DishOrderDetailWriteRepository.delete(id);
    await this.recalculateOrderTotals(detail.dish_order_id);
    return { detail, result };
  }
}

// src/app/cafe/dish_order_detail/controller/dish-order-detail.controller.ts
class DishOrderDetailController {
  static async getAll(c) {
    const details = await DishOrderDetailService.getAll();
    return c.json({
      success: true,
      data: details,
      message: "Dish order details fetched successfully"
    });
  }
  static async getById(c) {
    const id = Number(c.req.param("id"));
    const detail = await DishOrderDetailService.getById(id);
    if (!detail) {
      return c.json({ success: false, message: "Dish order detail not found" }, 404);
    }
    return c.json({
      success: true,
      data: detail,
      message: "Dish order detail fetched successfully"
    });
  }
  static async create(c) {
    const body = await c.req.json();
    const result = await DishOrderDetailService.create(body);
    return c.json({
      success: true,
      data: result,
      message: "Dish order detail created successfully"
    }, 201);
  }
  static async update(c) {
    const id = Number(c.req.param("id"));
    const body = await c.req.json();
    const updateResult = await DishOrderDetailService.update(id, body);
    if (!updateResult) {
      return c.json({ success: false, message: "Dish order detail not found" }, 404);
    }
    return c.json({
      success: true,
      data: updateResult.result,
      message: "Dish order detail updated successfully"
    });
  }
  static async delete(c) {
    const id = Number(c.req.param("id"));
    const deleteResult = await DishOrderDetailService.delete(id);
    if (!deleteResult) {
      return c.json({ success: false, message: "Dish order detail not found" }, 404);
    }
    return c.json({
      success: true,
      data: deleteResult.result,
      message: "Dish order detail deleted successfully"
    });
  }
}

// src/app/cafe/dish_order_detail/route/dish-order-detail.openapi.ts
import { createRoute as createRoute15 } from "@hono/zod-openapi";

// src/app/cafe/dish_order_detail/dto/dish-order-detail-request.dto.ts
import { z as z25 } from "@hono/zod-openapi";
var createDishOrderDetailRequestSchema = z25.object({
  dish_order_id: z25.number().int().min(1).openapi({ example: 1 }),
  dish_id: z25.number().int().min(1).openapi({ example: 1 }),
  quantity: z25.number().int().min(1).openapi({ example: 2 }),
  notes: z25.string().nullable().optional().openapi({ example: "Extra pedas" })
}).openapi("CreateDishOrderDetailRequest");
var updateDishOrderDetailRequestSchema = z25.object({
  dish_order_id: z25.number().int().min(1).optional().openapi({ example: 1 }),
  dish_id: z25.number().int().min(1).optional().openapi({ example: 1 }),
  quantity: z25.number().int().min(1).optional().openapi({ example: 3 }),
  notes: z25.string().nullable().optional().openapi({ example: "Tidak pedas" })
}).openapi("UpdateDishOrderDetailRequest");

// src/app/cafe/dish_order_detail/dto/dish-order-detail-response.dto.ts
import { z as z26 } from "@hono/zod-openapi";
var dishOrderDetailListResponseSchema = createSuccessEnvelopeSchema("DishOrderDetailListResponse", z26.array(dishOrderDetailSchema), "Dish order details fetched successfully");
var dishOrderDetailDetailResponseSchema = createSuccessEnvelopeSchema("DishOrderDetailDetailResponse", dishOrderDetailSchema, "Dish order detail fetched successfully");
var dishOrderDetailMutationResponseSchema = createSuccessEnvelopeSchema("DishOrderDetailMutationResponse", writeResultSchema, "Dish order detail created successfully");

// src/app/cafe/dish_order_detail/route/dish-order-detail.openapi.ts
var tags10 = ["Dish Order Details"];
var dishOrderDetailIdParamsSchema = createNumericPathParamsSchema("id");
var getAllDishOrderDetailsRoute = createRoute15({
  method: "get",
  path: "/",
  tags: tags10,
  summary: "Get all dish order details",
  security: protectedSecurity,
  responses: {
    200: jsonResponse(dishOrderDetailListResponseSchema, "Dish order details fetched successfully"),
    401: errorResponses[401],
    403: errorResponses[403],
    500: errorResponses[500]
  }
});
var getDishOrderDetailByIdRoute = createRoute15({
  method: "get",
  path: "/{id}",
  tags: tags10,
  summary: "Get dish order detail by id",
  security: protectedSecurity,
  request: {
    params: dishOrderDetailIdParamsSchema
  },
  responses: {
    200: jsonResponse(dishOrderDetailDetailResponseSchema, "Dish order detail fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid dish order detail id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Dish order detail not found"),
    500: errorResponses[500]
  }
});
var createDishOrderDetailRoute = createRoute15({
  method: "post",
  path: "/",
  tags: tags10,
  summary: "Create dish order detail",
  security: protectedSecurity,
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createDishOrderDetailRequestSchema
        }
      }
    }
  },
  responses: {
    201: jsonResponse(dishOrderDetailMutationResponseSchema, "Dish order detail created successfully"),
    ...errorResponses
  }
});
var updateDishOrderDetailRoute = createRoute15({
  method: "put",
  path: "/{id}",
  tags: tags10,
  summary: "Update dish order detail",
  security: protectedSecurity,
  request: {
    params: dishOrderDetailIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateDishOrderDetailRequestSchema
        }
      }
    }
  },
  responses: {
    200: jsonResponse(dishOrderDetailMutationResponseSchema, "Dish order detail updated successfully"),
    ...errorResponses,
    404: jsonResponse(apiErrorResponseSchema, "Dish order detail not found")
  }
});
var deleteDishOrderDetailRoute = createRoute15({
  method: "delete",
  path: "/{id}",
  tags: tags10,
  summary: "Delete dish order detail",
  security: protectedSecurity,
  request: {
    params: dishOrderDetailIdParamsSchema
  },
  responses: {
    200: jsonResponse(dishOrderDetailMutationResponseSchema, "Dish order detail deleted successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid dish order detail id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Dish order detail not found"),
    500: errorResponses[500]
  }
});

// src/app/cafe/dish_order_detail/route/dish-order-detail.route.ts
var router15 = createOpenApiRouter();
registerDefaultSecuritySchemes(router15);
router15.use("*", jwtMiddleware, appTokenMiddleware, requirePermission());
registerOpenApiRoute(router15, getAllDishOrderDetailsRoute, DishOrderDetailController.getAll);
registerOpenApiRoute(router15, getDishOrderDetailByIdRoute, DishOrderDetailController.getById);
registerOpenApiRoute(router15, createDishOrderDetailRoute, DishOrderDetailController.create);
registerOpenApiRoute(router15, updateDishOrderDetailRoute, DishOrderDetailController.update);
registerOpenApiRoute(router15, deleteDishOrderDetailRoute, DishOrderDetailController.delete);
function getDishOrderDetailOpenApiDocument(baseUrl) {
  return createModuleOpenApiDocument(router15, baseUrl, "Dish Order Detail API");
}
var dish_order_detail_route_default = router15;

// src/app/billiard/billiard_table_type/repository/billiard-table-type-read.repository.ts
import { eq as eq23 } from "drizzle-orm";
class BilliardTableTypeReadRepository {
  static async getAll() {
    try {
      return await db.select().from(billiard_table_types);
    } catch (error) {
      throw new Error(`Failed to fetch billiard table types: ${error}`);
    }
  }
  static async getById(id) {
    try {
      const result = await db.select().from(billiard_table_types).where(eq23(billiard_table_types.id, id)).limit(1);
      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch billiard table type: ${error}`);
    }
  }
}

// src/app/billiard/billiard_table_type/repository/billiard-table-type-write.repository.ts
import { eq as eq24 } from "drizzle-orm";
class BilliardTableTypeWriteRepository {
  static async create(data) {
    try {
      return await db.insert(billiard_table_types).values(data);
    } catch (error) {
      throw new Error(`Failed to create billiard table type: ${error}`);
    }
  }
  static async update(id, data) {
    try {
      return await db.update(billiard_table_types).set({
        ...data,
        updated_at: new Date
      }).where(eq24(billiard_table_types.id, id));
    } catch (error) {
      throw new Error(`Failed to update billiard table type: ${error}`);
    }
  }
  static async delete(id) {
    try {
      return await db.delete(billiard_table_types).where(eq24(billiard_table_types.id, id));
    } catch (error) {
      throw new Error(`Failed to delete billiard table type: ${error}`);
    }
  }
}

// src/app/billiard/billiard_table_type/service/billiard-table-type.service.ts
class BilliardTableTypeService {
  static async getAll() {
    return BilliardTableTypeReadRepository.getAll();
  }
  static async getById(id) {
    return BilliardTableTypeReadRepository.getById(id);
  }
  static async create(payload) {
    return BilliardTableTypeWriteRepository.create(payload);
  }
  static async update(id, payload) {
    const type = await BilliardTableTypeReadRepository.getById(id);
    if (!type) {
      return null;
    }
    const result = await BilliardTableTypeWriteRepository.update(id, payload);
    return { type, result };
  }
  static async delete(id) {
    const type = await BilliardTableTypeReadRepository.getById(id);
    if (!type) {
      return null;
    }
    const result = await BilliardTableTypeWriteRepository.delete(id);
    return { type, result };
  }
}

// src/app/billiard/billiard_table_type/controller/billiard-table-type.controller.ts
class BilliardTableTypeController {
  static async getAll(c) {
    const types = await BilliardTableTypeService.getAll();
    return c.json({
      success: true,
      data: types,
      message: "Billiard table types fetched successfully"
    });
  }
  static async getById(c) {
    const id = Number(c.req.param("id"));
    const type = await BilliardTableTypeService.getById(id);
    if (!type) {
      return c.json({ success: false, message: "Billiard table type not found" }, 404);
    }
    return c.json({
      success: true,
      data: type,
      message: "Billiard table type fetched successfully"
    });
  }
  static async create(c) {
    const body = await c.req.json();
    const result = await BilliardTableTypeService.create(body);
    return c.json({
      success: true,
      data: result,
      message: "Billiard table type created successfully"
    }, 201);
  }
  static async update(c) {
    const id = Number(c.req.param("id"));
    const body = await c.req.json();
    const updateResult = await BilliardTableTypeService.update(id, body);
    if (!updateResult) {
      return c.json({ success: false, message: "Billiard table type not found" }, 404);
    }
    return c.json({
      success: true,
      data: updateResult.result,
      message: "Billiard table type updated successfully"
    });
  }
  static async delete(c) {
    const id = Number(c.req.param("id"));
    const deleteResult = await BilliardTableTypeService.delete(id);
    if (!deleteResult) {
      return c.json({ success: false, message: "Billiard table type not found" }, 404);
    }
    return c.json({
      success: true,
      data: deleteResult.result,
      message: "Billiard table type deleted successfully"
    });
  }
}

// src/app/billiard/billiard_table_type/route/billiard-table-type.openapi.ts
import { createRoute as createRoute16 } from "@hono/zod-openapi";

// src/app/billiard/billiard_table_type/dto/billiard-table-type-request.dto.ts
import { z as z27 } from "@hono/zod-openapi";
var createBilliardTableTypeRequestSchema = z27.object({
  name: z27.string().min(1).openapi({ example: "Standard Pool" }),
  icon: z27.string().nullable().optional().openapi({ example: "ph-billiards" }),
  description: z27.string().nullable().optional().openapi({ example: "Meja billiard standar 8 ball" })
}).openapi("CreateBilliardTableTypeRequest");
var updateBilliardTableTypeRequestSchema = z27.object({
  name: z27.string().min(1).optional().openapi({ example: "Premium Snooker" }),
  icon: z27.string().nullable().optional().openapi({ example: "ph-trophy" }),
  description: z27.string().nullable().optional().openapi({ example: "Meja snooker premium" })
}).openapi("UpdateBilliardTableTypeRequest");

// src/app/billiard/billiard_table_type/dto/billiard-table-type-response.dto.ts
import { z as z28 } from "@hono/zod-openapi";
var billiardTableTypeListResponseSchema = createSuccessEnvelopeSchema("BilliardTableTypeListResponse", z28.array(billiardTableTypeSchema), "Billiard table types fetched successfully");
var billiardTableTypeDetailResponseSchema = createSuccessEnvelopeSchema("BilliardTableTypeDetailResponse", billiardTableTypeSchema, "Billiard table type fetched successfully");
var billiardTableTypeMutationResponseSchema = createSuccessEnvelopeSchema("BilliardTableTypeMutationResponse", writeResultSchema, "Billiard table type created successfully");

// src/app/billiard/billiard_table_type/route/billiard-table-type.openapi.ts
var tags11 = ["Billiard Table Types"];
var billiardTableTypeIdParamsSchema = createNumericPathParamsSchema("id");
var getAllBilliardTableTypesRoute = createRoute16({
  method: "get",
  path: "/",
  tags: tags11,
  summary: "Get all billiard table types",
  security: protectedSecurity,
  responses: {
    200: jsonResponse(billiardTableTypeListResponseSchema, "Billiard table types fetched successfully"),
    401: errorResponses[401],
    403: errorResponses[403],
    500: errorResponses[500]
  }
});
var getBilliardTableTypeByIdRoute = createRoute16({
  method: "get",
  path: "/{id}",
  tags: tags11,
  summary: "Get billiard table type by id",
  security: protectedSecurity,
  request: {
    params: billiardTableTypeIdParamsSchema
  },
  responses: {
    200: jsonResponse(billiardTableTypeDetailResponseSchema, "Billiard table type fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid billiard table type id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Billiard table type not found"),
    500: errorResponses[500]
  }
});
var createBilliardTableTypeRoute = createRoute16({
  method: "post",
  path: "/",
  tags: tags11,
  summary: "Create billiard table type",
  security: protectedSecurity,
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createBilliardTableTypeRequestSchema
        }
      }
    }
  },
  responses: {
    201: jsonResponse(billiardTableTypeMutationResponseSchema, "Billiard table type created successfully"),
    ...errorResponses
  }
});
var updateBilliardTableTypeRoute = createRoute16({
  method: "put",
  path: "/{id}",
  tags: tags11,
  summary: "Update billiard table type",
  security: protectedSecurity,
  request: {
    params: billiardTableTypeIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateBilliardTableTypeRequestSchema
        }
      }
    }
  },
  responses: {
    200: jsonResponse(billiardTableTypeMutationResponseSchema, "Billiard table type updated successfully"),
    ...errorResponses,
    404: jsonResponse(apiErrorResponseSchema, "Billiard table type not found")
  }
});
var deleteBilliardTableTypeRoute = createRoute16({
  method: "delete",
  path: "/{id}",
  tags: tags11,
  summary: "Delete billiard table type",
  security: protectedSecurity,
  request: {
    params: billiardTableTypeIdParamsSchema
  },
  responses: {
    200: jsonResponse(billiardTableTypeMutationResponseSchema, "Billiard table type deleted successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid billiard table type id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Billiard table type not found"),
    500: errorResponses[500]
  }
});

// src/app/billiard/billiard_table_type/route/billiard-table-type.route.ts
var router16 = createOpenApiRouter();
registerDefaultSecuritySchemes(router16);
router16.use("*", jwtMiddleware, appTokenMiddleware, requirePermission());
registerOpenApiRoute(router16, getAllBilliardTableTypesRoute, BilliardTableTypeController.getAll);
registerOpenApiRoute(router16, getBilliardTableTypeByIdRoute, BilliardTableTypeController.getById);
registerOpenApiRoute(router16, createBilliardTableTypeRoute, BilliardTableTypeController.create);
registerOpenApiRoute(router16, updateBilliardTableTypeRoute, BilliardTableTypeController.update);
registerOpenApiRoute(router16, deleteBilliardTableTypeRoute, BilliardTableTypeController.delete);
function getBilliardTableTypeOpenApiDocument(baseUrl) {
  return createModuleOpenApiDocument(router16, baseUrl, "Billiard Table Type API");
}
var billiard_table_type_route_default = router16;

// src/app/billiard/billiard_table/repository/billiard-table-read.repository.ts
import { eq as eq25 } from "drizzle-orm";
class BilliardTableReadRepository {
  static async getAll() {
    try {
      return await db.select({
        id: billiard_tables.id,
        table_type_id: billiard_tables.table_type_id,
        name: billiard_tables.name,
        slug: billiard_tables.slug,
        price: billiard_tables.price,
        thumbnail: billiard_tables.thumbnail,
        thumbnail_public_id: billiard_tables.thumbnail_public_id,
        is_available: billiard_tables.is_available,
        is_active: billiard_tables.is_active,
        created_at: billiard_tables.created_at,
        updated_at: billiard_tables.updated_at,
        type: {
          id: billiard_table_types.id,
          name: billiard_table_types.name,
          icon: billiard_table_types.icon
        }
      }).from(billiard_tables).leftJoin(billiard_table_types, eq25(billiard_tables.table_type_id, billiard_table_types.id));
    } catch (error) {
      throw new Error(`Failed to fetch billiard tables: ${error}`);
    }
  }
  static async getById(id) {
    try {
      const result = await db.select({
        id: billiard_tables.id,
        table_type_id: billiard_tables.table_type_id,
        name: billiard_tables.name,
        slug: billiard_tables.slug,
        price: billiard_tables.price,
        thumbnail: billiard_tables.thumbnail,
        thumbnail_public_id: billiard_tables.thumbnail_public_id,
        is_available: billiard_tables.is_available,
        is_active: billiard_tables.is_active,
        created_at: billiard_tables.created_at,
        updated_at: billiard_tables.updated_at,
        type: {
          id: billiard_table_types.id,
          name: billiard_table_types.name,
          icon: billiard_table_types.icon
        }
      }).from(billiard_tables).leftJoin(billiard_table_types, eq25(billiard_tables.table_type_id, billiard_table_types.id)).where(eq25(billiard_tables.id, id)).limit(1);
      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch billiard table: ${error}`);
    }
  }
}

// src/app/billiard/billiard_table/repository/billiard-table-write.repository.ts
import { eq as eq26 } from "drizzle-orm";
class BilliardTableWriteRepository {
  static async create(data) {
    try {
      return await db.insert(billiard_tables).values(data);
    } catch (error) {
      throw new Error(`Failed to create billiard table: ${error}`);
    }
  }
  static async update(id, data) {
    try {
      return await db.update(billiard_tables).set({
        ...data,
        updated_at: new Date
      }).where(eq26(billiard_tables.id, id));
    } catch (error) {
      throw new Error(`Failed to update billiard table: ${error}`);
    }
  }
  static async delete(id) {
    try {
      return await db.delete(billiard_tables).where(eq26(billiard_tables.id, id));
    } catch (error) {
      throw new Error(`Failed to delete billiard table: ${error}`);
    }
  }
}

// src/app/billiard/billiard_table/service/billiard-table.service.ts
class BilliardTableService {
  static async getAll() {
    return BilliardTableReadRepository.getAll();
  }
  static async getById(id) {
    return BilliardTableReadRepository.getById(id);
  }
  static async create(payload) {
    return BilliardTableWriteRepository.create(payload);
  }
  static async update(id, payload) {
    const table = await BilliardTableReadRepository.getById(id);
    if (!table) {
      return null;
    }
    const result = await BilliardTableWriteRepository.update(id, payload);
    return { table, result };
  }
  static async delete(id) {
    const table = await BilliardTableReadRepository.getById(id);
    if (!table) {
      return null;
    }
    const result = await BilliardTableWriteRepository.delete(id);
    return { table, result };
  }
}

// src/app/billiard/billiard_table/controller/billiard-table.controller.ts
class BilliardTableController {
  static async getAll(c) {
    const tables = await BilliardTableService.getAll();
    return c.json({
      success: true,
      data: tables,
      message: "Billiard tables fetched successfully"
    });
  }
  static async getById(c) {
    const id = Number(c.req.param("id"));
    const table = await BilliardTableService.getById(id);
    if (!table) {
      return c.json({ success: false, message: "Billiard table not found" }, 404);
    }
    return c.json({
      success: true,
      data: table,
      message: "Billiard table fetched successfully"
    });
  }
  static async create(c) {
    const body = await c.req.json();
    const result = await BilliardTableService.create(body);
    return c.json({
      success: true,
      data: result,
      message: "Billiard table created successfully"
    }, 201);
  }
  static async update(c) {
    const id = Number(c.req.param("id"));
    const body = await c.req.json();
    const updateResult = await BilliardTableService.update(id, body);
    if (!updateResult) {
      return c.json({ success: false, message: "Billiard table not found" }, 404);
    }
    return c.json({
      success: true,
      data: updateResult.result,
      message: "Billiard table updated successfully"
    });
  }
  static async delete(c) {
    const id = Number(c.req.param("id"));
    const deleteResult = await BilliardTableService.delete(id);
    if (!deleteResult) {
      return c.json({ success: false, message: "Billiard table not found" }, 404);
    }
    return c.json({
      success: true,
      data: deleteResult.result,
      message: "Billiard table deleted successfully"
    });
  }
}

// src/app/billiard/billiard_table/route/billiard-table.openapi.ts
import { createRoute as createRoute17 } from "@hono/zod-openapi";

// src/app/billiard/billiard_table/dto/billiard-table-request.dto.ts
import { z as z29 } from "@hono/zod-openapi";
var createBilliardTableRequestSchema = z29.object({
  table_type_id: z29.number().int().min(1).openapi({ example: 1 }),
  name: z29.string().min(1).openapi({ example: "Table 01" }),
  slug: z29.string().min(1).openapi({ example: "table-01" }),
  price: z29.string().min(1).openapi({ example: "50000.00" }),
  thumbnail: z29.string().nullable().optional().openapi({ example: "https://res.cloudinary.com/xxx/image.jpg" }),
  thumbnail_public_id: z29.string().nullable().optional().openapi({ example: "uploads/table-01" }),
  is_available: z29.boolean().optional().openapi({ example: false }),
  is_active: z29.boolean().optional().openapi({ example: false })
}).openapi("CreateBilliardTableRequest");
var updateBilliardTableRequestSchema = z29.object({
  table_type_id: z29.number().int().min(1).optional().openapi({ example: 1 }),
  name: z29.string().min(1).optional().openapi({ example: "Table 01 VIP" }),
  slug: z29.string().min(1).optional().openapi({ example: "table-01-vip" }),
  price: z29.string().min(1).optional().openapi({ example: "75000.00" }),
  thumbnail: z29.string().nullable().optional().openapi({ example: "https://res.cloudinary.com/xxx/image_vip.jpg" }),
  thumbnail_public_id: z29.string().nullable().optional().openapi({ example: "uploads/table-01-vip" }),
  is_available: z29.boolean().optional().openapi({ example: true }),
  is_active: z29.boolean().optional().openapi({ example: true })
}).openapi("UpdateBilliardTableRequest");

// src/app/billiard/billiard_table/dto/billiard-table-response.dto.ts
import { z as z30 } from "@hono/zod-openapi";
var billiardTableListResponseSchema = createSuccessEnvelopeSchema("BilliardTableListResponse", z30.array(billiardTableSchema), "Billiard tables fetched successfully");
var billiardTableDetailResponseSchema = createSuccessEnvelopeSchema("BilliardTableDetailResponse", billiardTableSchema, "Billiard table fetched successfully");
var billiardTableMutationResponseSchema = createSuccessEnvelopeSchema("BilliardTableMutationResponse", writeResultSchema, "Billiard table created successfully");

// src/app/billiard/billiard_table/route/billiard-table.openapi.ts
var tags12 = ["Billiard Tables"];
var billiardTableIdParamsSchema = createNumericPathParamsSchema("id");
var getAllBilliardTablesRoute = createRoute17({
  method: "get",
  path: "/",
  tags: tags12,
  summary: "Get all billiard tables",
  security: protectedSecurity,
  responses: {
    200: jsonResponse(billiardTableListResponseSchema, "Billiard tables fetched successfully"),
    401: errorResponses[401],
    403: errorResponses[403],
    500: errorResponses[500]
  }
});
var getBilliardTableByIdRoute = createRoute17({
  method: "get",
  path: "/{id}",
  tags: tags12,
  summary: "Get billiard table by id",
  security: protectedSecurity,
  request: {
    params: billiardTableIdParamsSchema
  },
  responses: {
    200: jsonResponse(billiardTableDetailResponseSchema, "Billiard table fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid billiard table id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Billiard table not found"),
    500: errorResponses[500]
  }
});
var createBilliardTableRoute = createRoute17({
  method: "post",
  path: "/",
  tags: tags12,
  summary: "Create billiard table",
  security: protectedSecurity,
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createBilliardTableRequestSchema
        }
      }
    }
  },
  responses: {
    201: jsonResponse(billiardTableMutationResponseSchema, "Billiard table created successfully"),
    ...errorResponses
  }
});
var updateBilliardTableRoute = createRoute17({
  method: "put",
  path: "/{id}",
  tags: tags12,
  summary: "Update billiard table",
  security: protectedSecurity,
  request: {
    params: billiardTableIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateBilliardTableRequestSchema
        }
      }
    }
  },
  responses: {
    200: jsonResponse(billiardTableMutationResponseSchema, "Billiard table updated successfully"),
    ...errorResponses,
    404: jsonResponse(apiErrorResponseSchema, "Billiard table not found")
  }
});
var deleteBilliardTableRoute = createRoute17({
  method: "delete",
  path: "/{id}",
  tags: tags12,
  summary: "Delete billiard table",
  security: protectedSecurity,
  request: {
    params: billiardTableIdParamsSchema
  },
  responses: {
    200: jsonResponse(billiardTableMutationResponseSchema, "Billiard table deleted successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid billiard table id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Billiard table not found"),
    500: errorResponses[500]
  }
});

// src/app/billiard/billiard_table/route/billiard-table.route.ts
var router17 = createOpenApiRouter();
registerDefaultSecuritySchemes(router17);
router17.use("*", jwtMiddleware, appTokenMiddleware, requirePermission());
registerOpenApiRoute(router17, getAllBilliardTablesRoute, BilliardTableController.getAll);
registerOpenApiRoute(router17, getBilliardTableByIdRoute, BilliardTableController.getById);
registerOpenApiRoute(router17, createBilliardTableRoute, BilliardTableController.create);
registerOpenApiRoute(router17, updateBilliardTableRoute, BilliardTableController.update);
registerOpenApiRoute(router17, deleteBilliardTableRoute, BilliardTableController.delete);
function getBilliardTableOpenApiDocument(baseUrl) {
  return createModuleOpenApiDocument(router17, baseUrl, "Billiard Table API");
}
var billiard_table_route_default = router17;

// src/app/billiard/billiard_table_image/repository/billiard-table-image-read.repository.ts
import { eq as eq27 } from "drizzle-orm";
class BilliardTableImageReadRepository {
  static async getAll() {
    try {
      return await db.select().from(billiard_table_images);
    } catch (error) {
      throw new Error(`Failed to fetch billiard table images: ${error}`);
    }
  }
  static async getById(id) {
    try {
      const result = await db.select().from(billiard_table_images).where(eq27(billiard_table_images.id, id)).limit(1);
      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch billiard table image: ${error}`);
    }
  }
  static async getByTableId(tableId) {
    try {
      return await db.select().from(billiard_table_images).where(eq27(billiard_table_images.billiard_table_id, tableId));
    } catch (error) {
      throw new Error(`Failed to fetch billiard table images: ${error}`);
    }
  }
}

// src/app/billiard/billiard_table_image/repository/billiard-table-image-write.repository.ts
import { eq as eq28 } from "drizzle-orm";
class BilliardTableImageWriteRepository {
  static async create(data) {
    try {
      return await db.insert(billiard_table_images).values(data);
    } catch (error) {
      throw new Error(`Failed to create billiard table image: ${error}`);
    }
  }
  static async update(id, data) {
    try {
      return await db.update(billiard_table_images).set({
        ...data,
        updated_at: new Date
      }).where(eq28(billiard_table_images.id, id));
    } catch (error) {
      throw new Error(`Failed to update billiard table image: ${error}`);
    }
  }
  static async delete(id) {
    try {
      return await db.delete(billiard_table_images).where(eq28(billiard_table_images.id, id));
    } catch (error) {
      throw new Error(`Failed to delete billiard table image: ${error}`);
    }
  }
}

// src/app/billiard/billiard_table_image/service/billiard-table-image.service.ts
class BilliardTableImageService {
  static async getAll() {
    return BilliardTableImageReadRepository.getAll();
  }
  static async getById(id) {
    return BilliardTableImageReadRepository.getById(id);
  }
  static async create(payload) {
    return BilliardTableImageWriteRepository.create(payload);
  }
  static async update(id, payload) {
    const image = await BilliardTableImageReadRepository.getById(id);
    if (!image) {
      return null;
    }
    const result = await BilliardTableImageWriteRepository.update(id, payload);
    return { image, result };
  }
  static async delete(id) {
    const image = await BilliardTableImageReadRepository.getById(id);
    if (!image) {
      return null;
    }
    const result = await BilliardTableImageWriteRepository.delete(id);
    return { image, result };
  }
}

// src/app/billiard/billiard_table_image/controller/billiard-table-image.controller.ts
class BilliardTableImageController {
  static async getAll(c) {
    const images = await BilliardTableImageService.getAll();
    return c.json({
      success: true,
      data: images,
      message: "Billiard table images fetched successfully"
    });
  }
  static async getById(c) {
    const id = Number(c.req.param("id"));
    const image = await BilliardTableImageService.getById(id);
    if (!image) {
      return c.json({ success: false, message: "Billiard table image not found" }, 404);
    }
    return c.json({
      success: true,
      data: image,
      message: "Billiard table image fetched successfully"
    });
  }
  static async create(c) {
    const body = await c.req.json();
    const result = await BilliardTableImageService.create(body);
    return c.json({
      success: true,
      data: result,
      message: "Billiard table image created successfully"
    }, 201);
  }
  static async update(c) {
    const id = Number(c.req.param("id"));
    const body = await c.req.json();
    const updateResult = await BilliardTableImageService.update(id, body);
    if (!updateResult) {
      return c.json({ success: false, message: "Billiard table image not found" }, 404);
    }
    return c.json({
      success: true,
      data: updateResult.result,
      message: "Billiard table image updated successfully"
    });
  }
  static async delete(c) {
    const id = Number(c.req.param("id"));
    const deleteResult = await BilliardTableImageService.delete(id);
    if (!deleteResult) {
      return c.json({ success: false, message: "Billiard table image not found" }, 404);
    }
    return c.json({
      success: true,
      data: deleteResult.result,
      message: "Billiard table image deleted successfully"
    });
  }
}

// src/app/billiard/billiard_table_image/route/billiard-table-image.openapi.ts
import { createRoute as createRoute18 } from "@hono/zod-openapi";

// src/app/billiard/billiard_table_image/dto/billiard-table-image-request.dto.ts
import { z as z31 } from "@hono/zod-openapi";
var createBilliardTableImageRequestSchema = z31.object({
  billiard_table_id: z31.number().int().min(1).openapi({ example: 1 }),
  image: z31.string().min(1).openapi({ example: "https://res.cloudinary.com/xxx/table-01.jpg" }),
  image_public_id: z31.string().min(1).openapi({ example: "uploads/table-01" })
}).openapi("CreateBilliardTableImageRequest");
var updateBilliardTableImageRequestSchema = z31.object({
  billiard_table_id: z31.number().int().min(1).optional().openapi({ example: 1 }),
  image: z31.string().min(1).optional().openapi({ example: "https://res.cloudinary.com/xxx/table-02.jpg" }),
  image_public_id: z31.string().min(1).optional().openapi({ example: "uploads/table-02" })
}).openapi("UpdateBilliardTableImageRequest");

// src/app/billiard/billiard_table_image/dto/billiard-table-image-response.dto.ts
import { z as z32 } from "@hono/zod-openapi";
var billiardTableImageListResponseSchema = createSuccessEnvelopeSchema("BilliardTableImageListResponse", z32.array(billiardTableImageSchema), "Billiard table images fetched successfully");
var billiardTableImageDetailResponseSchema = createSuccessEnvelopeSchema("BilliardTableImageDetailResponse", billiardTableImageSchema, "Billiard table image fetched successfully");
var billiardTableImageMutationResponseSchema = createSuccessEnvelopeSchema("BilliardTableImageMutationResponse", writeResultSchema, "Billiard table image created successfully");

// src/app/billiard/billiard_table_image/route/billiard-table-image.openapi.ts
var tags13 = ["Billiard Table Images"];
var billiardTableImageIdParamsSchema = createNumericPathParamsSchema("id");
var getAllBilliardTableImagesRoute = createRoute18({
  method: "get",
  path: "/",
  tags: tags13,
  summary: "Get all billiard table images",
  security: protectedSecurity,
  responses: {
    200: jsonResponse(billiardTableImageListResponseSchema, "Billiard table images fetched successfully"),
    401: errorResponses[401],
    403: errorResponses[403],
    500: errorResponses[500]
  }
});
var getBilliardTableImageByIdRoute = createRoute18({
  method: "get",
  path: "/{id}",
  tags: tags13,
  summary: "Get billiard table image by id",
  security: protectedSecurity,
  request: {
    params: billiardTableImageIdParamsSchema
  },
  responses: {
    200: jsonResponse(billiardTableImageDetailResponseSchema, "Billiard table image fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid billiard table image id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Billiard table image not found"),
    500: errorResponses[500]
  }
});
var createBilliardTableImageRoute = createRoute18({
  method: "post",
  path: "/",
  tags: tags13,
  summary: "Create billiard table image",
  security: protectedSecurity,
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createBilliardTableImageRequestSchema
        }
      }
    }
  },
  responses: {
    201: jsonResponse(billiardTableImageMutationResponseSchema, "Billiard table image created successfully"),
    ...errorResponses
  }
});
var updateBilliardTableImageRoute = createRoute18({
  method: "put",
  path: "/{id}",
  tags: tags13,
  summary: "Update billiard table image",
  security: protectedSecurity,
  request: {
    params: billiardTableImageIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateBilliardTableImageRequestSchema
        }
      }
    }
  },
  responses: {
    200: jsonResponse(billiardTableImageMutationResponseSchema, "Billiard table image updated successfully"),
    ...errorResponses,
    404: jsonResponse(apiErrorResponseSchema, "Billiard table image not found")
  }
});
var deleteBilliardTableImageRoute = createRoute18({
  method: "delete",
  path: "/{id}",
  tags: tags13,
  summary: "Delete billiard table image",
  security: protectedSecurity,
  request: {
    params: billiardTableImageIdParamsSchema
  },
  responses: {
    200: jsonResponse(billiardTableImageMutationResponseSchema, "Billiard table image deleted successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid billiard table image id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Billiard table image not found"),
    500: errorResponses[500]
  }
});

// src/app/billiard/billiard_table_image/route/billiard-table-image.route.ts
var router18 = createOpenApiRouter();
registerDefaultSecuritySchemes(router18);
router18.use("*", jwtMiddleware, appTokenMiddleware, requirePermission());
registerOpenApiRoute(router18, getAllBilliardTableImagesRoute, BilliardTableImageController.getAll);
registerOpenApiRoute(router18, getBilliardTableImageByIdRoute, BilliardTableImageController.getById);
registerOpenApiRoute(router18, createBilliardTableImageRoute, BilliardTableImageController.create);
registerOpenApiRoute(router18, updateBilliardTableImageRoute, BilliardTableImageController.update);
registerOpenApiRoute(router18, deleteBilliardTableImageRoute, BilliardTableImageController.delete);
function getBilliardTableImageOpenApiDocument(baseUrl) {
  return createModuleOpenApiDocument(router18, baseUrl, "Billiard Table Image API");
}
var billiard_table_image_route_default = router18;

// src/app/billiard/reservation/repository/reservation-read.repository.ts
import { eq as eq29, desc as desc2 } from "drizzle-orm";
class ReservationReadRepository {
  static async getAll() {
    try {
      return await db.select({
        id: reservations.id,
        billiard_table_id: reservations.billiard_table_id,
        guest_name: reservations.guest_name,
        guest_phone: reservations.guest_phone,
        date: reservations.date,
        schedule_id: reservations.schedule_id,
        guest_count: reservations.guest_count,
        notes: reservations.notes,
        status: reservations.status,
        created_at: reservations.created_at,
        updated_at: reservations.updated_at,
        payment_status: payments.status,
        payment_method: payments.method,
        billiard_table: {
          id: billiard_tables.id,
          name: billiard_tables.name,
          slug: billiard_tables.slug,
          price: billiard_tables.price,
          thumbnail: billiard_tables.thumbnail
        },
        schedule: {
          id: schedules.id,
          start_time: schedules.start_time,
          end_time: schedules.end_time
        }
      }).from(reservations).leftJoin(billiard_tables, eq29(reservations.billiard_table_id, billiard_tables.id)).leftJoin(schedules, eq29(reservations.schedule_id, schedules.id)).leftJoin(payments, eq29(reservations.id, payments.reservation_id)).orderBy(desc2(reservations.created_at));
    } catch (error) {
      throw new Error(`Failed to fetch reservations: ${error}`);
    }
  }
  static async getById(id) {
    try {
      const result = await db.select({
        id: reservations.id,
        billiard_table_id: reservations.billiard_table_id,
        guest_name: reservations.guest_name,
        guest_phone: reservations.guest_phone,
        date: reservations.date,
        schedule_id: reservations.schedule_id,
        guest_count: reservations.guest_count,
        notes: reservations.notes,
        status: reservations.status,
        created_at: reservations.created_at,
        updated_at: reservations.updated_at,
        payment_status: payments.status,
        payment_method: payments.method,
        billiard_table: {
          id: billiard_tables.id,
          name: billiard_tables.name,
          slug: billiard_tables.slug,
          price: billiard_tables.price,
          thumbnail: billiard_tables.thumbnail
        },
        schedule: {
          id: schedules.id,
          start_time: schedules.start_time,
          end_time: schedules.end_time
        }
      }).from(reservations).leftJoin(billiard_tables, eq29(reservations.billiard_table_id, billiard_tables.id)).leftJoin(schedules, eq29(reservations.schedule_id, schedules.id)).leftJoin(payments, eq29(reservations.id, payments.reservation_id)).where(eq29(reservations.id, id)).limit(1);
      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch reservation: ${error}`);
    }
  }
}

// src/app/billiard/reservation/repository/reservation-write.repository.ts
import { eq as eq30 } from "drizzle-orm";
class ReservationWriteRepository {
  static async create(data) {
    try {
      const payload = { ...data };
      if (payload.date)
        payload.date = new Date(payload.date);
      return await db.insert(reservations).values(payload);
    } catch (error) {
      throw new Error(`Failed to create reservation: ${error}`);
    }
  }
  static async update(id, data) {
    try {
      const payload = { ...data };
      if (payload.date)
        payload.date = new Date(payload.date);
      return await db.update(reservations).set({
        ...payload,
        updated_at: new Date
      }).where(eq30(reservations.id, id));
    } catch (error) {
      throw new Error(`Failed to update reservation: ${error}`);
    }
  }
  static async delete(id) {
    try {
      return await db.delete(reservations).where(eq30(reservations.id, id));
    } catch (error) {
      throw new Error(`Failed to delete reservation: ${error}`);
    }
  }
}

// src/app/billiard/reservation/service/reservation.service.ts
class ReservationService {
  static async getAll() {
    return ReservationReadRepository.getAll();
  }
  static async getById(id) {
    return ReservationReadRepository.getById(id);
  }
  static async create(payload) {
    return ReservationWriteRepository.create(payload);
  }
  static async update(id, payload) {
    const reservation = await ReservationReadRepository.getById(id);
    if (!reservation) {
      return null;
    }
    const result = await ReservationWriteRepository.update(id, payload);
    return { reservation, result };
  }
  static async delete(id) {
    const reservation = await ReservationReadRepository.getById(id);
    if (!reservation) {
      return null;
    }
    const result = await ReservationWriteRepository.delete(id);
    return { reservation, result };
  }
}

// src/app/billiard/reservation/controller/reservation.controller.ts
class ReservationController {
  static async getAll(c) {
    const reservations2 = await ReservationService.getAll();
    return c.json({
      success: true,
      data: reservations2,
      message: "Reservations fetched successfully"
    });
  }
  static async getById(c) {
    const id = Number(c.req.param("id"));
    const reservation = await ReservationService.getById(id);
    if (!reservation) {
      return c.json({ success: false, message: "Reservation not found" }, 404);
    }
    return c.json({
      success: true,
      data: reservation,
      message: "Reservation fetched successfully"
    });
  }
  static async create(c) {
    const body = await c.req.json();
    const result = await ReservationService.create(body);
    return c.json({
      success: true,
      data: result,
      message: "Reservation created successfully"
    }, 201);
  }
  static async update(c) {
    const id = Number(c.req.param("id"));
    const body = await c.req.json();
    const updateResult = await ReservationService.update(id, body);
    if (!updateResult) {
      return c.json({ success: false, message: "Reservation not found" }, 404);
    }
    return c.json({
      success: true,
      data: updateResult.result,
      message: "Reservation updated successfully"
    });
  }
  static async delete(c) {
    const id = Number(c.req.param("id"));
    const deleteResult = await ReservationService.delete(id);
    if (!deleteResult) {
      return c.json({ success: false, message: "Reservation not found" }, 404);
    }
    return c.json({
      success: true,
      data: deleteResult.result,
      message: "Reservation deleted successfully"
    });
  }
}

// src/app/billiard/reservation/route/reservation.openapi.ts
import { createRoute as createRoute19 } from "@hono/zod-openapi";

// src/app/billiard/reservation/dto/reservation-request.dto.ts
import { z as z33 } from "@hono/zod-openapi";
var createReservationRequestSchema = z33.object({
  billiard_table_id: z33.number().int().min(1).openapi({ example: 1 }),
  guest_name: z33.string().min(1).openapi({ example: "John Doe" }),
  guest_phone: z33.string().min(1).openapi({ example: "081234567890" }),
  date: z33.string().min(1).openapi({ example: "2024-05-20" }),
  schedule_id: z33.number().int().min(1).openapi({ example: 1 }),
  guest_count: z33.number().int().min(1).openapi({ example: 4 }),
  notes: z33.string().nullable().optional().openapi({ example: "Meja dekat jendela" }),
  status: z33.enum(["pending", "confirmed", "preparing", "completed", "cancelled"]).optional().openapi({ example: "pending" })
}).openapi("CreateReservationRequest");
var updateReservationRequestSchema = z33.object({
  billiard_table_id: z33.number().int().min(1).optional().openapi({ example: 1 }),
  guest_name: z33.string().min(1).optional().openapi({ example: "Jane Doe" }),
  guest_phone: z33.string().min(1).optional().openapi({ example: "089876543210" }),
  date: z33.string().min(1).optional().openapi({ example: "2024-05-21" }),
  schedule_id: z33.number().int().min(1).optional().openapi({ example: 1 }),
  guest_count: z33.number().int().min(1).optional().openapi({ example: 2 }),
  notes: z33.string().nullable().optional().openapi({ example: "Tidak ada" }),
  status: z33.enum(["pending", "confirmed", "preparing", "completed", "cancelled"]).optional().openapi({ example: "confirmed" })
}).openapi("UpdateReservationRequest");

// src/app/billiard/reservation/dto/reservation-response.dto.ts
import { z as z34 } from "@hono/zod-openapi";
var reservationListResponseSchema = createSuccessEnvelopeSchema("ReservationListResponse", z34.array(reservationSchema), "Reservations fetched successfully");
var reservationDetailResponseSchema = createSuccessEnvelopeSchema("ReservationDetailResponse", reservationSchema, "Reservation fetched successfully");
var reservationMutationResponseSchema = createSuccessEnvelopeSchema("ReservationMutationResponse", writeResultSchema, "Reservation created successfully");

// src/app/billiard/reservation/route/reservation.openapi.ts
var tags14 = ["Reservations"];
var reservationIdParamsSchema = createNumericPathParamsSchema("id");
var getAllReservationsRoute = createRoute19({
  method: "get",
  path: "/",
  tags: tags14,
  summary: "Get all reservations",
  security: protectedSecurity,
  responses: {
    200: jsonResponse(reservationListResponseSchema, "Reservations fetched successfully"),
    401: errorResponses[401],
    403: errorResponses[403],
    500: errorResponses[500]
  }
});
var getReservationByIdRoute = createRoute19({
  method: "get",
  path: "/{id}",
  tags: tags14,
  summary: "Get reservation by id",
  security: protectedSecurity,
  request: {
    params: reservationIdParamsSchema
  },
  responses: {
    200: jsonResponse(reservationDetailResponseSchema, "Reservation fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid reservation id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Reservation not found"),
    500: errorResponses[500]
  }
});
var createReservationRoute = createRoute19({
  method: "post",
  path: "/",
  tags: tags14,
  summary: "Create reservation",
  security: protectedSecurity,
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createReservationRequestSchema
        }
      }
    }
  },
  responses: {
    201: jsonResponse(reservationMutationResponseSchema, "Reservation created successfully"),
    ...errorResponses
  }
});
var updateReservationRoute = createRoute19({
  method: "put",
  path: "/{id}",
  tags: tags14,
  summary: "Update reservation",
  security: protectedSecurity,
  request: {
    params: reservationIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateReservationRequestSchema
        }
      }
    }
  },
  responses: {
    200: jsonResponse(reservationMutationResponseSchema, "Reservation updated successfully"),
    ...errorResponses,
    404: jsonResponse(apiErrorResponseSchema, "Reservation not found")
  }
});
var deleteReservationRoute = createRoute19({
  method: "delete",
  path: "/{id}",
  tags: tags14,
  summary: "Delete reservation",
  security: protectedSecurity,
  request: {
    params: reservationIdParamsSchema
  },
  responses: {
    200: jsonResponse(reservationMutationResponseSchema, "Reservation deleted successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid reservation id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Reservation not found"),
    500: errorResponses[500]
  }
});

// src/app/billiard/reservation/route/reservation.route.ts
var router19 = createOpenApiRouter();
registerDefaultSecuritySchemes(router19);
router19.use("*", jwtMiddleware, appTokenMiddleware, requirePermission());
registerOpenApiRoute(router19, getAllReservationsRoute, ReservationController.getAll);
registerOpenApiRoute(router19, getReservationByIdRoute, ReservationController.getById);
registerOpenApiRoute(router19, createReservationRoute, ReservationController.create);
registerOpenApiRoute(router19, updateReservationRoute, ReservationController.update);
registerOpenApiRoute(router19, deleteReservationRoute, ReservationController.delete);
function getReservationOpenApiDocument(baseUrl) {
  return createModuleOpenApiDocument(router19, baseUrl, "Reservation API");
}
var reservation_route_default = router19;

// src/app/billiard/schedule/repository/schedule-read.repository.ts
import { eq as eq31 } from "drizzle-orm";
class ScheduleReadRepository {
  static async getAll() {
    try {
      const results = await db.select().from(schedules);
      return results;
    } catch (error) {
      throw new Error(`Failed to fetch schedules: ${error}`);
    }
  }
  static async getById(id) {
    try {
      const result = await db.select().from(schedules).where(eq31(schedules.id, id)).limit(1);
      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch schedule by id: ${error}`);
    }
  }
}

// src/app/billiard/schedule/repository/schedule-write.repository.ts
import { eq as eq32 } from "drizzle-orm";
class ScheduleWriteRepository {
  static async create(data) {
    try {
      const [result] = await db.insert(schedules).values(data);
      return { id: result.insertId };
    } catch (error) {
      throw new Error(`Failed to create schedule: ${error}`);
    }
  }
  static async update(id, data) {
    try {
      const [result] = await db.update(schedules).set({ ...data, updated_at: new Date }).where(eq32(schedules.id, id));
      return { id, affectedRows: result.affectedRows };
    } catch (error) {
      throw new Error(`Failed to update schedule: ${error}`);
    }
  }
  static async delete(id) {
    try {
      const [result] = await db.delete(schedules).where(eq32(schedules.id, id));
      return { id, affectedRows: result.affectedRows };
    } catch (error) {
      throw new Error(`Failed to delete schedule: ${error}`);
    }
  }
}

// src/app/billiard/schedule/service/schedule.service.ts
class ScheduleService {
  static async getAll() {
    return ScheduleReadRepository.getAll();
  }
  static async getById(id) {
    return ScheduleReadRepository.getById(id);
  }
  static async create(payload) {
    return ScheduleWriteRepository.create(payload);
  }
  static async update(id, payload) {
    const schedule = await ScheduleReadRepository.getById(id);
    if (!schedule)
      return null;
    const result = await ScheduleWriteRepository.update(id, payload);
    return { schedule, result };
  }
  static async delete(id) {
    const schedule = await ScheduleReadRepository.getById(id);
    if (!schedule)
      return null;
    const result = await ScheduleWriteRepository.delete(id);
    return { schedule, result };
  }
}

// src/app/billiard/schedule/controller/schedule.controller.ts
class ScheduleController {
  static async getAll(c) {
    const schedules2 = await ScheduleService.getAll();
    return c.json({
      success: true,
      data: schedules2,
      message: "Schedules fetched successfully"
    });
  }
  static async getById(c) {
    const id = Number(c.req.param("id"));
    const schedule = await ScheduleService.getById(id);
    if (!schedule) {
      return c.json({ success: false, message: "Schedule not found" }, 404);
    }
    return c.json({
      success: true,
      data: schedule,
      message: "Schedule fetched successfully"
    });
  }
  static async create(c) {
    const body = await c.req.json();
    const result = await ScheduleService.create(body);
    return c.json({
      success: true,
      data: result,
      message: "Schedule created successfully"
    }, 201);
  }
  static async update(c) {
    const id = Number(c.req.param("id"));
    const body = await c.req.json();
    const updateResult = await ScheduleService.update(id, body);
    if (!updateResult) {
      return c.json({ success: false, message: "Schedule not found" }, 404);
    }
    return c.json({
      success: true,
      data: updateResult.result,
      message: "Schedule updated successfully"
    });
  }
  static async delete(c) {
    const id = Number(c.req.param("id"));
    const deleteResult = await ScheduleService.delete(id);
    if (!deleteResult) {
      return c.json({ success: false, message: "Schedule not found" }, 404);
    }
    return c.json({
      success: true,
      data: deleteResult.result,
      message: "Schedule deleted successfully"
    });
  }
}

// src/app/billiard/schedule/route/schedule.openapi.ts
import { createRoute as createRoute20 } from "@hono/zod-openapi";

// src/app/billiard/schedule/dto/schedule-request.dto.ts
import { z as z35 } from "@hono/zod-openapi";
var createScheduleRequestSchema = z35.object({
  start_time: z35.string().min(1).openapi({ example: "10:00:00" }),
  end_time: z35.string().min(1).openapi({ example: "11:00:00" })
}).openapi("CreateScheduleRequest");
var updateScheduleRequestSchema = z35.object({
  start_time: z35.string().min(1).optional().openapi({ example: "10:30:00" }),
  end_time: z35.string().min(1).optional().openapi({ example: "11:30:00" })
}).openapi("UpdateScheduleRequest");

// src/app/billiard/schedule/dto/schedule-response.dto.ts
import { z as z36 } from "@hono/zod-openapi";
var scheduleListResponseSchema = createSuccessEnvelopeSchema("ScheduleListResponse", z36.array(scheduleSchema), "Schedules fetched successfully");
var scheduleDetailResponseSchema = createSuccessEnvelopeSchema("ScheduleDetailResponse", scheduleSchema, "Schedule fetched successfully");
var scheduleMutationResponseSchema = createSuccessEnvelopeSchema("ScheduleMutationResponse", writeResultSchema, "Schedule mutation successful");

// src/app/billiard/schedule/route/schedule.openapi.ts
var tags15 = ["Schedules"];
var scheduleIdParamsSchema = createNumericPathParamsSchema("id");
var getAllSchedulesRoute = createRoute20({
  method: "get",
  path: "/",
  tags: tags15,
  summary: "Get all schedules",
  security: protectedSecurity,
  responses: {
    200: jsonResponse(scheduleListResponseSchema, "Schedules fetched successfully"),
    401: errorResponses[401],
    403: errorResponses[403],
    500: errorResponses[500]
  }
});
var getScheduleByIdRoute = createRoute20({
  method: "get",
  path: "/{id}",
  tags: tags15,
  summary: "Get schedule by ID",
  security: protectedSecurity,
  request: {
    params: scheduleIdParamsSchema
  },
  responses: {
    200: jsonResponse(scheduleDetailResponseSchema, "Schedule fetched successfully"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: errorResponses[404],
    500: errorResponses[500]
  }
});
var createScheduleRoute = createRoute20({
  method: "post",
  path: "/",
  tags: tags15,
  summary: "Create schedule",
  security: protectedSecurity,
  request: {
    body: {
      content: {
        "application/json": {
          schema: createScheduleRequestSchema
        }
      }
    }
  },
  responses: {
    201: jsonResponse(scheduleMutationResponseSchema, "Schedule created successfully"),
    400: {
      description: "Validation error",
      content: {
        "application/json": {
          schema: apiErrorResponseSchema
        }
      }
    },
    401: errorResponses[401],
    403: errorResponses[403],
    500: errorResponses[500]
  }
});
var updateScheduleRoute = createRoute20({
  method: "put",
  path: "/{id}",
  tags: tags15,
  summary: "Update schedule",
  security: protectedSecurity,
  request: {
    params: scheduleIdParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: updateScheduleRequestSchema
        }
      }
    }
  },
  responses: {
    200: jsonResponse(scheduleMutationResponseSchema, "Schedule updated successfully"),
    400: {
      description: "Validation error",
      content: {
        "application/json": {
          schema: apiErrorResponseSchema
        }
      }
    },
    401: errorResponses[401],
    403: errorResponses[403],
    404: errorResponses[404],
    500: errorResponses[500]
  }
});
var deleteScheduleRoute = createRoute20({
  method: "delete",
  path: "/{id}",
  tags: tags15,
  summary: "Delete schedule",
  security: protectedSecurity,
  request: {
    params: scheduleIdParamsSchema
  },
  responses: {
    200: jsonResponse(scheduleMutationResponseSchema, "Schedule deleted successfully"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: errorResponses[404],
    500: errorResponses[500]
  }
});

// src/app/billiard/schedule/route/schedule.route.ts
var router20 = createOpenApiRouter();
registerDefaultSecuritySchemes(router20);
router20.use("*", jwtMiddleware, appTokenMiddleware, requirePermission());
registerOpenApiRoute(router20, getAllSchedulesRoute, ScheduleController.getAll);
registerOpenApiRoute(router20, getScheduleByIdRoute, ScheduleController.getById);
registerOpenApiRoute(router20, createScheduleRoute, ScheduleController.create);
registerOpenApiRoute(router20, updateScheduleRoute, ScheduleController.update);
registerOpenApiRoute(router20, deleteScheduleRoute, ScheduleController.delete);
function getScheduleOpenApiDocument(baseUrl) {
  return createModuleOpenApiDocument(router20, baseUrl, "Schedule API");
}
var schedule_route_default = router20;

// src/app/payment/repository/payment-read.repository.ts
import { eq as eq33, and as and2 } from "drizzle-orm";
class PaymentReadRepository {
  static async getAll() {
    try {
      return await db.select({
        id: payments.id,
        type: payments.type,
        dish_order_id: payments.dish_order_id,
        reservation_id: payments.reservation_id,
        method: payments.method,
        provider: payments.provider,
        transaction_id: payments.transaction_id,
        gross_amount: payments.gross_amount,
        status: payments.status,
        url: payments.url,
        snap_token: payments.snap_token,
        paid_at: payments.paid_at,
        expired_at: payments.expired_at,
        created_at: payments.created_at,
        updated_at: payments.updated_at,
        dish_order: {
          id: dish_orders.id,
          guest_name: dish_orders.guest_name,
          guest_phone: dish_orders.guest_phone,
          nett_price: dish_orders.nett_price
        },
        reservation: {
          id: reservations.id,
          guest_name: reservations.guest_name,
          guest_phone: reservations.guest_phone,
          date: reservations.date
        }
      }).from(payments).leftJoin(dish_orders, eq33(payments.dish_order_id, dish_orders.id)).leftJoin(reservations, eq33(payments.reservation_id, reservations.id));
    } catch (error) {
      throw new Error(`Failed to fetch payments: ${error}`);
    }
  }
  static async getById(id) {
    try {
      const result = await db.select({
        id: payments.id,
        type: payments.type,
        dish_order_id: payments.dish_order_id,
        reservation_id: payments.reservation_id,
        method: payments.method,
        provider: payments.provider,
        transaction_id: payments.transaction_id,
        gross_amount: payments.gross_amount,
        status: payments.status,
        url: payments.url,
        snap_token: payments.snap_token,
        paid_at: payments.paid_at,
        expired_at: payments.expired_at,
        created_at: payments.created_at,
        updated_at: payments.updated_at,
        dish_order: {
          id: dish_orders.id,
          guest_name: dish_orders.guest_name,
          guest_phone: dish_orders.guest_phone,
          nett_price: dish_orders.nett_price
        },
        reservation: {
          id: reservations.id,
          guest_name: reservations.guest_name,
          guest_phone: reservations.guest_phone,
          date: reservations.date
        }
      }).from(payments).leftJoin(dish_orders, eq33(payments.dish_order_id, dish_orders.id)).leftJoin(reservations, eq33(payments.reservation_id, reservations.id)).where(eq33(payments.id, id)).limit(1);
      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch payment: ${error}`);
    }
  }
  static async getPendingByDishOrderId(dishOrderId) {
    try {
      const result = await db.select().from(payments).where(and2(eq33(payments.dish_order_id, dishOrderId), eq33(payments.status, "pending"))).limit(1);
      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch pending payment: ${error}`);
    }
  }
}

// src/app/payment/repository/payment-write.repository.ts
import { eq as eq34 } from "drizzle-orm";
class PaymentWriteRepository {
  static async create(data) {
    try {
      const [result] = await db.insert(payments).values(data);
      return { id: result.insertId };
    } catch (error) {
      throw new Error(`Failed to create payment: ${error}`);
    }
  }
  static async update(id, data) {
    try {
      return await db.update(payments).set({
        ...data,
        updated_at: new Date
      }).where(eq34(payments.id, id));
    } catch (error) {
      throw new Error(`Failed to update payment: ${error}`);
    }
  }
  static async delete(id) {
    try {
      return await db.delete(payments).where(eq34(payments.id, id));
    } catch (error) {
      throw new Error(`Failed to delete payment: ${error}`);
    }
  }
}

// src/lib/midtrans.ts
import * as midtransClient from "midtrans-client";
var isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
var snap = new midtransClient.Snap({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY || "",
  clientKey: process.env.MIDTRANS_CLIENT_KEY || ""
});
var coreApi = new midtransClient.CoreApi({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY || "",
  clientKey: process.env.MIDTRANS_CLIENT_KEY || ""
});

// src/lib/fonnte.ts
async function sendWhatsAppMessage(target, message) {
  const token = process.env.FONNTE_API_TOKEN;
  if (!token) {
    console.warn("FONNTE_API_TOKEN is not set. WhatsApp message was not sent.");
    return false;
  }
  try {
    const formData = new FormData;
    formData.append("target", target);
    formData.append("message", message);
    formData.append("countryCode", "62");
    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: token
      },
      body: formData
    });
    const result = await response.json();
    if (result.status === true) {
      console.log(`WhatsApp message sent to ${target}`);
      return true;
    } else {
      console.error(`Failed to send WhatsApp message to ${target}:`, result);
      return false;
    }
  } catch (error) {
    console.error("Error sending WhatsApp message via Fonnte:", error);
    return false;
  }
}

// src/app/notification/service/notification.service.ts
class NotificationService {
  static formatIDR(amount) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(Number(amount));
  }
  static async sendPaymentSuccessNotification(paymentType, referenceId) {
    try {
      if (paymentType === "dish_order") {
        const dishOrder = await DishOrderReadRepository.getById(referenceId);
        if (!dishOrder)
          return;
        const details = await DishOrderReadRepository.getOrderDetailsWithDish(referenceId);
        let itemsList = "";
        details.forEach((item) => {
          itemsList += `- ${item.quantity}x ${item.dish_name || "Unknown Item"}
`;
        });
        const message = `Halo *${dishOrder.guest_name}*,
Pembayaran pesanan kuliner Anda telah kami terima!

*Ringkasan Pesanan:*
${itemsList}
Subtotal: ${this.formatIDR(dishOrder.total)}
Total (inc. Tax & Service): *${this.formatIDR(dishOrder.nett_price)}*

Pesanan Anda segera disiapkan/diantarkan.
Terima kasih telah memesan di *Savoria Cafe*!`;
        await sendWhatsAppMessage(dishOrder.guest_phone, message);
      } else if (paymentType === "reservation") {
        const reservation = await ReservationReadRepository.getById(referenceId);
        if (!reservation)
          return;
        const dateObj = new Date(reservation.date);
        const dateString = dateObj.toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        });
        const startTime = reservation.schedule?.start_time?.slice(0, 5) || "";
        const endTime = reservation.schedule?.end_time?.slice(0, 5) || "";
        const message = `Halo *${reservation.guest_name}*,
Reservasi Anda berhasil dikonfirmasi!

*Detail Reservasi:*
Layanan: Billiard
Meja: ${reservation.billiard_table?.name || "Unknown"}
Tanggal: ${dateString}
Jam: ${startTime} - ${endTime}
Total Pembayaran: *${this.formatIDR(reservation.billiard_table?.price || 0)}*

Harap datang tepat waktu.
Terima kasih telah memesan di *Savoria Cafe*!`;
        await sendWhatsAppMessage(reservation.guest_phone, message);
      }
    } catch (error) {
      console.error("Failed to send payment success notification:", error);
    }
  }
}

// src/app/payment/service/payment.service.ts
class PaymentService {
  static async getAll() {
    return PaymentReadRepository.getAll();
  }
  static async getById(id) {
    return PaymentReadRepository.getById(id);
  }
  static async create(payload) {
    const data = {
      ...payload,
      paid_at: payload.paid_at ? new Date(payload.paid_at) : null,
      expired_at: payload.expired_at ? new Date(payload.expired_at) : null
    };
    if (payload.method === "cash") {
      data.status = "paid";
      data.paid_at = new Date;
    } else {
      if (payload.dish_order_id) {
        const existingPending = await PaymentReadRepository.getPendingByDishOrderId(payload.dish_order_id);
        if (existingPending) {
          if (existingPending.snap_token) {
            return {
              id: existingPending.id,
              snap_token: existingPending.snap_token,
              url: existingPending.url,
              transaction_id: existingPending.transaction_id
            };
          } else {
            await PaymentWriteRepository.delete(existingPending.id);
          }
        }
      }
    }
    const result = await PaymentWriteRepository.create(data);
    if (payload.method === "cash") {
      if (payload.type === "dish_order" && payload.dish_order_id) {
        await DishOrderWriteRepository.update(payload.dish_order_id, { status: "completed" });
        await NotificationService.sendPaymentSuccessNotification("dish_order", payload.dish_order_id);
      } else if (payload.type === "reservation" && payload.reservation_id) {
        await ReservationWriteRepository.update(payload.reservation_id, { status: "completed" });
        await NotificationService.sendPaymentSuccessNotification("reservation", payload.reservation_id);
      }
    }
    if (payload.provider === "midtrans") {
      try {
        const orderId = `PAY-${result.id}-${Date.now()}`;
        const parameter = {
          transaction_details: {
            order_id: orderId,
            gross_amount: Math.round(Number(payload.gross_amount))
          },
          credit_card: {
            secure: true
          }
        };
        const transaction = await snap.createTransaction(parameter);
        await PaymentWriteRepository.update(result.id, {
          snap_token: transaction.token,
          url: transaction.redirect_url,
          transaction_id: orderId
        });
        return {
          id: result.id,
          snap_token: transaction.token,
          url: transaction.redirect_url,
          transaction_id: orderId
        };
      } catch (e) {
        console.error("Midtrans Snap Error:", e);
        await PaymentWriteRepository.delete(result.id);
        throw new Error(e.message?.includes("401") ? "Gagal terhubung ke Midtrans. Pastikan MIDTRANS_SERVER_KEY dan MIDTRANS_CLIENT_KEY sudah diatur di file .env backend." : "Gagal membuat transaksi Midtrans: " + e.message);
      }
    }
    return result;
  }
  static async update(id, payload) {
    const payment = await PaymentReadRepository.getById(id);
    if (!payment) {
      return null;
    }
    const data = { ...payload };
    if (payload.paid_at !== undefined) {
      data.paid_at = payload.paid_at ? new Date(payload.paid_at) : null;
    }
    if (payload.expired_at !== undefined) {
      data.expired_at = payload.expired_at ? new Date(payload.expired_at) : null;
    }
    const result = await PaymentWriteRepository.update(id, data);
    if (data.status === "paid") {
      if (payment.type === "dish_order" && payment.dish_order_id) {
        await DishOrderWriteRepository.update(payment.dish_order_id, { status: "completed" });
        await NotificationService.sendPaymentSuccessNotification("dish_order", payment.dish_order_id);
      } else if (payment.type === "reservation" && payment.reservation_id) {
        await ReservationWriteRepository.update(payment.reservation_id, { status: "completed" });
        await NotificationService.sendPaymentSuccessNotification("reservation", payment.reservation_id);
      }
    }
    return { payment, result };
  }
  static async delete(id) {
    const payment = await PaymentReadRepository.getById(id);
    if (!payment) {
      return null;
    }
    const result = await PaymentWriteRepository.delete(id);
    return { payment, result };
  }
}

// src/app/payment/controller/payment.controller.ts
import * as crypto from "crypto";

class PaymentController {
  static async getAll(c) {
    const payments2 = await PaymentService.getAll();
    return c.json({
      success: true,
      data: payments2,
      message: "Payments fetched successfully"
    });
  }
  static async getById(c) {
    const id = Number(c.req.param("id"));
    const payment = await PaymentService.getById(id);
    if (!payment) {
      return c.json({ success: false, message: "Payment not found" }, 404);
    }
    return c.json({
      success: true,
      data: payment,
      message: "Payment fetched successfully"
    });
  }
  static async create(c) {
    const body = await c.req.json();
    const result = await PaymentService.create(body);
    return c.json({
      success: true,
      data: result,
      message: "Payment created successfully"
    }, 201);
  }
  static async update(c) {
    const id = Number(c.req.param("id"));
    const body = await c.req.json();
    const updateResult = await PaymentService.update(id, body);
    if (!updateResult) {
      return c.json({ success: false, message: "Payment not found" }, 404);
    }
    return c.json({
      success: true,
      data: updateResult.result,
      message: "Payment updated successfully"
    });
  }
  static async delete(c) {
    const id = Number(c.req.param("id"));
    const deleteResult = await PaymentService.delete(id);
    if (!deleteResult) {
      return c.json({ success: false, message: "Payment not found" }, 404);
    }
    return c.json({
      success: true,
      data: deleteResult.result,
      message: "Payment deleted successfully"
    });
  }
  static async midtransWebhook(c) {
    try {
      const body = await c.req.json();
      const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
      const signatureKey = body.signature_key;
      const orderId = body.order_id;
      const statusCode = body.status_code;
      const grossAmount = body.gross_amount;
      const hash2 = crypto.createHash("sha512");
      hash2.update(`${orderId}${statusCode}${grossAmount}${serverKey}`);
      const calculatedSignature = hash2.digest("hex");
      if (signatureKey !== calculatedSignature) {
        return c.json({ success: false, message: "Invalid signature" }, 403);
      }
      const transactionStatus = body.transaction_status;
      const fraudStatus = body.fraud_status;
      let paymentStatus = "pending";
      if (transactionStatus === "capture") {
        if (fraudStatus === "challenge") {
          paymentStatus = "pending";
        } else if (fraudStatus === "accept") {
          paymentStatus = "paid";
        }
      } else if (transactionStatus === "settlement") {
        paymentStatus = "paid";
      } else if (transactionStatus === "cancel" || transactionStatus === "deny" || transactionStatus === "expire") {
        paymentStatus = transactionStatus === "expire" ? "expired" : "failed";
      } else if (transactionStatus === "pending") {
        paymentStatus = "pending";
      }
      const parts = orderId.split("-");
      if (parts.length >= 2 && parts[0] === "PAY") {
        const paymentId = Number(parts[1]);
        const payment = await PaymentReadRepository.getById(paymentId);
        if (payment && payment.status !== "paid") {
          await PaymentService.update(paymentId, {
            status: paymentStatus,
            paid_at: paymentStatus === "paid" ? new Date().toISOString() : undefined
          });
        }
      }
      return c.json({ success: true, message: "Webhook processed" });
    } catch (e) {
      console.error("Webhook error:", e);
      return c.json({ success: false, message: e.message }, 500);
    }
  }
}

// src/app/payment/route/payment.openapi.ts
import { createRoute as createRoute21 } from "@hono/zod-openapi";

// src/app/payment/dto/payment-request.dto.ts
import { z as z37 } from "@hono/zod-openapi";
var createPaymentRequestSchema = z37.object({
  type: z37.enum(["dish_order", "reservation"]).openapi({ example: "dish_order" }),
  dish_order_id: z37.number().int().min(1).nullable().optional().openapi({ example: 1 }),
  reservation_id: z37.number().int().min(1).nullable().optional().openapi({ example: null }),
  method: z37.enum(["qris", "bank_transfer", "cash", "ewallet", "credit_card"]).openapi({ example: "qris" }),
  provider: z37.enum(["midtrans", "xendit", "manual", "cashier"]).openapi({ example: "midtrans" }),
  transaction_id: z37.string().nullable().optional().openapi({ example: "TRX-123456" }),
  gross_amount: z37.string().min(1).openapi({ example: "116000.00" }),
  status: z37.enum(["pending", "paid", "failed", "expired", "cancelled", "refunded"]).optional().openapi({ example: "pending" }),
  url: z37.string().nullable().optional().openapi({ example: "https://midtrans.com/pay/123" }),
  snap_token: z37.string().nullable().optional().openapi({ example: "snap-token-xyz" }),
  paid_at: z37.string().nullable().optional().openapi({ example: "2024-05-20T18:00:00Z" }),
  expired_at: z37.string().nullable().optional().openapi({ example: "2024-05-21T18:00:00Z" })
}).openapi("CreatePaymentRequest");
var updatePaymentRequestSchema = z37.object({
  type: z37.enum(["dish_order", "reservation"]).optional().openapi({ example: "dish_order" }),
  dish_order_id: z37.number().int().min(1).nullable().optional().openapi({ example: 1 }),
  reservation_id: z37.number().int().min(1).nullable().optional().openapi({ example: null }),
  method: z37.enum(["qris", "bank_transfer", "cash", "ewallet", "credit_card"]).optional().openapi({ example: "bank_transfer" }),
  provider: z37.enum(["midtrans", "xendit", "manual", "cashier"]).optional().openapi({ example: "manual" }),
  transaction_id: z37.string().nullable().optional().openapi({ example: "TRX-123456" }),
  gross_amount: z37.string().min(1).optional().openapi({ example: "116000.00" }),
  status: z37.enum(["pending", "paid", "failed", "expired", "cancelled", "refunded"]).optional().openapi({ example: "paid" }),
  url: z37.string().nullable().optional().openapi({ example: null }),
  snap_token: z37.string().nullable().optional().openapi({ example: null }),
  paid_at: z37.string().nullable().optional().openapi({ example: "2024-05-20T18:05:00Z" }),
  expired_at: z37.string().nullable().optional().openapi({ example: "2024-05-21T18:00:00Z" })
}).openapi("UpdatePaymentRequest");

// src/app/payment/dto/payment-response.dto.ts
import { z as z38 } from "@hono/zod-openapi";
var paymentListResponseSchema = createSuccessEnvelopeSchema("PaymentListResponse", z38.array(paymentSchema), "Payments fetched successfully");
var paymentDetailResponseSchema = createSuccessEnvelopeSchema("PaymentDetailResponse", paymentSchema, "Payment fetched successfully");
var paymentMutationResponseSchema = createSuccessEnvelopeSchema("PaymentMutationResponse", writeResultSchema, "Payment created successfully");

// src/app/payment/route/payment.openapi.ts
var tags16 = ["Payments"];
var paymentIdParamsSchema = createNumericPathParamsSchema("id");
var getAllPaymentsRoute = createRoute21({
  method: "get",
  path: "/",
  tags: tags16,
  summary: "Get all payments",
  security: protectedSecurity,
  responses: {
    200: jsonResponse(paymentListResponseSchema, "Payments fetched successfully"),
    401: errorResponses[401],
    403: errorResponses[403],
    500: errorResponses[500]
  }
});
var getPaymentByIdRoute = createRoute21({
  method: "get",
  path: "/{id}",
  tags: tags16,
  summary: "Get payment by id",
  security: protectedSecurity,
  request: {
    params: paymentIdParamsSchema
  },
  responses: {
    200: jsonResponse(paymentDetailResponseSchema, "Payment fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid payment id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Payment not found"),
    500: errorResponses[500]
  }
});
var createPaymentRoute = createRoute21({
  method: "post",
  path: "/",
  tags: tags16,
  summary: "Create payment",
  security: protectedSecurity,
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createPaymentRequestSchema
        }
      }
    }
  },
  responses: {
    201: jsonResponse(paymentMutationResponseSchema, "Payment created successfully"),
    ...errorResponses
  }
});
var updatePaymentRoute = createRoute21({
  method: "put",
  path: "/{id}",
  tags: tags16,
  summary: "Update payment",
  security: protectedSecurity,
  request: {
    params: paymentIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updatePaymentRequestSchema
        }
      }
    }
  },
  responses: {
    200: jsonResponse(paymentMutationResponseSchema, "Payment updated successfully"),
    ...errorResponses,
    404: jsonResponse(apiErrorResponseSchema, "Payment not found")
  }
});
var deletePaymentRoute = createRoute21({
  method: "delete",
  path: "/{id}",
  tags: tags16,
  summary: "Delete payment",
  security: protectedSecurity,
  request: {
    params: paymentIdParamsSchema
  },
  responses: {
    200: jsonResponse(paymentMutationResponseSchema, "Payment deleted successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid payment id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Payment not found"),
    500: errorResponses[500]
  }
});
var midtransWebhookRoute = createRoute21({
  method: "post",
  path: "/webhook/midtrans",
  tags: tags16,
  summary: "Midtrans Notification Webhook",
  request: {
    body: {
      content: {
        "application/json": {
          schema: {}
        }
      }
    }
  },
  responses: {
    200: {
      description: "Webhook processed successfully"
    },
    403: {
      description: "Invalid signature"
    },
    500: {
      description: "Internal server error"
    }
  }
});

// src/app/payment/route/payment.route.ts
var router21 = createOpenApiRouter();
registerDefaultSecuritySchemes(router21);
registerOpenApiRoute(router21, midtransWebhookRoute, PaymentController.midtransWebhook);
router21.use("*", jwtMiddleware, appTokenMiddleware, requirePermission());
registerOpenApiRoute(router21, getAllPaymentsRoute, PaymentController.getAll);
registerOpenApiRoute(router21, getPaymentByIdRoute, PaymentController.getById);
registerOpenApiRoute(router21, createPaymentRoute, PaymentController.create);
registerOpenApiRoute(router21, updatePaymentRoute, PaymentController.update);
registerOpenApiRoute(router21, deletePaymentRoute, PaymentController.delete);
function getPaymentOpenApiDocument(baseUrl) {
  return createModuleOpenApiDocument(router21, baseUrl, "Payment API");
}
var payment_route_default = router21;

// src/index.ts
import { apiReference } from "@scalar/hono-api-reference";

// src/docs/openapi.ts
var protectedSecurity2 = [
  { BearerAuth: [], AppToken: [] }
];
function mergeTagDefinitions(baseTags = [], incomingTags = []) {
  const mergedTags = new Map;
  for (const tag of [...baseTags, ...incomingTags]) {
    const tagName = typeof tag.name === "string" ? tag.name : undefined;
    if (!tagName) {
      continue;
    }
    if (!mergedTags.has(tagName)) {
      mergedTags.set(tagName, tag);
      continue;
    }
    mergedTags.set(tagName, {
      ...tag,
      ...mergedTags.get(tagName)
    });
  }
  return Array.from(mergedTags.values());
}
function mergeOpenApiDocument(baseDocument, incomingDocument) {
  return {
    ...baseDocument,
    tags: mergeTagDefinitions(baseDocument.tags, incomingDocument.tags),
    paths: {
      ...baseDocument.paths ?? {},
      ...incomingDocument.paths ?? {}
    },
    components: {
      ...baseDocument.components ?? {},
      ...incomingDocument.components ?? {},
      schemas: {
        ...baseDocument.components?.schemas ?? {},
        ...incomingDocument.components?.schemas ?? {}
      },
      securitySchemes: {
        ...baseDocument.components?.securitySchemes ?? {},
        ...incomingDocument.components?.securitySchemes ?? {}
      },
      parameters: {
        ...baseDocument.components?.parameters ?? {},
        ...incomingDocument.components?.parameters ?? {}
      },
      responses: {
        ...baseDocument.components?.responses ?? {},
        ...incomingDocument.components?.responses ?? {}
      },
      requestBodies: {
        ...baseDocument.components?.requestBodies ?? {},
        ...incomingDocument.components?.requestBodies ?? {}
      }
    }
  };
}
function mountOpenApiPaths(document, mountPath) {
  const normalizedMountPath = mountPath === "/" ? mountPath : mountPath.replace(/\/+$/, "");
  const mountedPaths = Object.fromEntries(Object.entries(document.paths ?? {}).map(([path, value]) => {
    if (path === "/" || path === "") {
      return [normalizedMountPath, value];
    }
    return [`${normalizedMountPath}${path}`, value];
  }));
  return {
    ...document,
    paths: mountedPaths
  };
}
function createBaseDocument(baseUrl) {
  return {
    openapi: "3.0.3",
    info: {
      title: "Hono Backend Starter API",
      version: "1.0.0",
      description: [
        "OpenAPI reference untuk backend starter berbasis Hono.",
        "",
        "Endpoint protected umumnya membutuhkan dua header:",
        "- `Authorization: Bearer <jwt>`",
        "- `X-App-Token: <APP_TOKEN>`",
        "",
        "Catatan:",
        "- `POST /api/users/login` bersifat public",
        "- Upload memakai satu konfigurasi Cloudinary melalui `POST /api/uploads/signature`"
      ].join(`
`)
    },
    servers: [
      {
        url: baseUrl,
        description: "Current server"
      }
    ],
    tags: [
      { name: "System", description: "Public health and root endpoints" },
      { name: "Users", description: "Authentication and user management" },
      { name: "Roles", description: "Role master data" },
      { name: "Menus", description: "Navigation menu management" },
      {
        name: "Role Permissions",
        description: "Role-based access control permissions"
      },
      {
        name: "Uploads",
        description: "Cloudinary signed upload helpers"
      },
      {
        name: "Dish Categories",
        description: "Dish category management"
      },
      {
        name: "Dishes",
        description: "Dish management"
      },
      {
        name: "Dish Images",
        description: "Dish image management"
      },
      {
        name: "Dish Orders",
        description: "Dish order management"
      },
      {
        name: "Dish Order Details",
        description: "Dish order detail management"
      },
      {
        name: "Billiard Table Types",
        description: "Billiard table type management"
      },
      {
        name: "Billiard Tables",
        description: "Billiard table management"
      },
      {
        name: "Billiard Table Images",
        description: "Billiard table image management"
      },
      {
        name: "Reservations",
        description: "Reservation management"
      },
      {
        name: "Schedules",
        description: "Schedule management"
      },
      {
        name: "Payments",
        description: "Payment management"
      }
    ],
    security: protectedSecurity2,
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT token from POST /api/users/login"
        },
        AppToken: {
          type: "apiKey",
          in: "header",
          name: "X-App-Token",
          description: "Application token defined in APP_TOKEN"
        }
      }
    },
    paths: {
      "/": {
        get: {
          tags: ["System"],
          summary: "Welcome endpoint",
          security: [],
          responses: {
            200: {
              description: "Welcome information",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: {
                        type: "boolean",
                        example: true
                      },
                      message: {
                        type: "string",
                        example: "Welcome to Hono Backend Starter API"
                      },
                      version: {
                        type: "string",
                        example: "1.0.0"
                      },
                      timestamp: {
                        type: "string",
                        format: "date-time",
                        example: "2026-04-27T10:00:00.000Z"
                      }
                    },
                    required: ["success", "message", "version", "timestamp"]
                  }
                }
              }
            }
          }
        }
      },
      "/api/health": {
        get: {
          tags: ["System"],
          summary: "Health check",
          security: [],
          responses: {
            200: {
              description: "Health check response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: {
                        type: "boolean",
                        example: true
                      },
                      message: {
                        type: "string",
                        example: "API is running"
                      },
                      timestamp: {
                        type: "string",
                        format: "date-time",
                        example: "2026-04-27T10:00:00.000Z"
                      }
                    },
                    required: ["success", "message", "timestamp"]
                  }
                }
              }
            }
          }
        }
      }
    }
  };
}
function getServerUrl(requestUrl) {
  return new URL(requestUrl).origin;
}
function createOpenApiDocument(baseUrl) {
  const moduleDocuments = [
    mountOpenApiPaths(getUserOpenApiDocument(baseUrl), "/api/users"),
    mountOpenApiPaths(getRoleOpenApiDocument(baseUrl), "/api/roles"),
    mountOpenApiPaths(getMenuOpenApiDocument(baseUrl), "/api/menus"),
    mountOpenApiPaths(getRolePermissionOpenApiDocument(baseUrl), "/api/role-permissions"),
    mountOpenApiPaths(getUploadOpenApiDocument(baseUrl), "/api/uploads"),
    mountOpenApiPaths(getPublicDishCategoryOpenApiDocument(baseUrl), "/api/public/dish-categories"),
    mountOpenApiPaths(getPublicDishOpenApiDocument(baseUrl), "/api/public/dishes"),
    mountOpenApiPaths(getPublicBilliardTableTypeOpenApiDocument(baseUrl), "/api/public/billiard-table-types"),
    mountOpenApiPaths(getPublicBilliardTableOpenApiDocument(baseUrl), "/api/public/billiard-tables"),
    mountOpenApiPaths(getDishCategoryOpenApiDocument(baseUrl), "/api/dish-categories"),
    mountOpenApiPaths(getDishOpenApiDocument(baseUrl), "/api/dishes"),
    mountOpenApiPaths(getDishImageOpenApiDocument(baseUrl), "/api/dish-images"),
    mountOpenApiPaths(getDishOrderOpenApiDocument(baseUrl), "/api/dish-orders"),
    mountOpenApiPaths(getDishOrderDetailOpenApiDocument(baseUrl), "/api/dish-order-details"),
    mountOpenApiPaths(getBilliardTableTypeOpenApiDocument(baseUrl), "/api/billiard-table-types"),
    mountOpenApiPaths(getBilliardTableOpenApiDocument(baseUrl), "/api/billiard-tables"),
    mountOpenApiPaths(getBilliardTableImageOpenApiDocument(baseUrl), "/api/billiard-table-images"),
    mountOpenApiPaths(getReservationOpenApiDocument(baseUrl), "/api/reservations"),
    mountOpenApiPaths(getScheduleOpenApiDocument(baseUrl), "/api/schedules"),
    mountOpenApiPaths(getPaymentOpenApiDocument(baseUrl), "/api/payments")
  ];
  return moduleDocuments.reduce((document, moduleDocument) => mergeOpenApiDocument(document, moduleDocument), createBaseDocument(baseUrl));
}

// src/index.ts
import { handle } from "hono/vercel";
var app = new Hono;
app.use("*", corsMiddleware);
app.use("*", originGuard);
app.use(logger());
app.use(loggerMiddleware);
app.get("/", (c) => {
  return c.json({
    success: true,
    message: "Welcome to Hono Backend Starter API",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});
app.get("/api/health", (c) => {
  return c.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString()
  });
});
app.get("/openapi.json", (c) => {
  const baseUrl = getServerUrl(c.req.url);
  return c.json(createOpenApiDocument(baseUrl));
});
app.get("/docs", apiReference({
  spec: {
    url: "/openapi.json"
  }
}));
app.route("/api/uploads", upload_route_default);
app.route("/api/users", user_route_default);
app.route("/api/roles", role_route_default);
app.route("/api/menus", menu_route_default);
app.route("/api/role-permissions", role_permission_route_default);
app.route("/api/uploads", upload_route_default);
app.route("/api/public/dish-categories", public_dish_category_route_default);
app.route("/api/public/dishes", public_dish_route_default);
app.route("/api/public/billiard-table-types", public_billiard_table_type_route_default);
app.route("/api/public/billiard-tables", public_billiard_table_route_default);
app.route("/api/public/schedules", public_schedule_route_default);
app.route("/api/dish-categories", dish_category_route_default);
app.route("/api/dishes", dish_route_default);
app.route("/api/dish-images", dish_image_route_default);
app.route("/api/dish-orders", dish_order_route_default);
app.route("/api/dish-order-details", dish_order_detail_route_default);
app.route("/api/billiard-table-types", billiard_table_type_route_default);
app.route("/api/billiard-tables", billiard_table_route_default);
app.route("/api/billiard-table-images", billiard_table_image_route_default);
app.route("/api/reservations", reservation_route_default);
app.route("/api/schedules", schedule_route_default);
app.route("/api/payments", payment_route_default);
app.notFound(notFoundHandler);
app.onError(errorHandler);
var src_default = handle(app);
export {
  src_default as default
};
