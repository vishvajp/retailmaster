import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Remove TypeScript-specific type exports and keep only runtime schemas
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(), // 'admin' or 'shopkeeper'
  name: text("name").notNull(),
  phone: text("phone"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const shops = pgTable("shops", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'dairy', 'meat', 'grocery'
  ownerId: integer("owner_id").references(() => users.id),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  shopType: text("shop_type").notNull(), // 'dairy', 'meat', 'grocery'
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sku: text("sku").notNull().unique(),
  description: text("description"),
  // Pricing
  purchasePrice: decimal("purchase_price", { precision: 10, scale: 2 }), // Cost price
  sellingPrice: decimal("selling_price", { precision: 10, scale: 2 }).notNull(), // MRP/Sale price
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // Legacy field for compatibility
  tax: decimal("tax", { precision: 5, scale: 2 }).default("0"), // GST/VAT percentage
  discount: decimal("discount", { precision: 5, scale: 2 }).default("0"), // Discount percentage
  flatDiscount: decimal("flat_discount", { precision: 10, scale: 2 }).default("0"), // Flat discount amount
  // Stock & Unit
  stock: integer("stock").notNull().default(0),
  reorderLevel: integer("reorder_level").notNull().default(5), // Minimum stock alert
  minStock: integer("min_stock").notNull().default(5), // Legacy field for compatibility
  unit: text("unit").notNull(), // 'Gram', 'Kg', 'Packet', 'Box', 'Litre', 'ml', 'Piece'
  quantity: text("quantity"), // '100g', '200g', '1kg', '500ml', etc.
  // Product Details
  brand: text("brand"),
  imageUrl: text("image_url"),
  barcode: text("barcode"),
  qrCode: text("qr_code"),
  // Dates
  expiryDate: timestamp("expiry_date"),
  manufacturingDate: timestamp("manufacturing_date"),
  // Supplier
  supplierName: text("supplier_name"),
  supplierContact: text("supplier_contact"),
  // Relations
  categoryId: integer("category_id").references(() => categories.id),
  shopId: integer("shop_id").references(() => shops.id),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerId: integer("customer_id").references(() => users.id),
  shopId: integer("shop_id").references(() => shops.id),
  status: text("status").notNull().default("pending"), // 'pending', 'processing', 'completed', 'cancelled'
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  itemCount: integer("item_count").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  productId: integer("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  address: text("address"),
  shopId: integer("shop_id").references(() => shops.id),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const bills = pgTable("bills", {
  id: serial("id").primaryKey(),
  billNumber: text("bill_number").notNull().unique(),
  customerId: integer("customer_id").references(() => customers.id),
  shopId: integer("shop_id").references(() => shops.id),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const billItems = pgTable("bill_items", {
  id: serial("id").primaryKey(),
  billId: integer("bill_id").references(() => bills.id),
  productId: integer("product_id").references(() => products.id),
  productName: text("product_name").notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertShopSchema = createInsertSchema(shops).omit({
  id: true,
  createdAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
});

export const insertBillSchema = createInsertSchema(bills).omit({
  id: true,
  createdAt: true,
});

export const insertBillItemSchema = createInsertSchema(billItems).omit({
  id: true,
});

// Type definitions - Keep for runtime schemas only (remove TypeScript types)

// Login schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// LoginCredentials type removed - use runtime validation only