import { 
  users, shops, categories, products, orders, orderItems,
  type User, type InsertUser, type Shop, type InsertShop,
  type Category, type InsertCategory, type Product, type InsertProduct,
  type Order, type InsertOrder, type OrderItem, type InsertOrderItem
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Shop operations
  getShop(id: number): Promise<Shop | undefined>;
  createShop(shop: InsertShop): Promise<Shop>;
  updateShop(id: number, shop: Partial<InsertShop>): Promise<Shop | undefined>;
  deleteShop(id: number): Promise<boolean>;
  getAllShops(): Promise<Shop[]>;
  getShopsByOwner(ownerId: number): Promise<Shop[]>;

  // Category operations
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  getAllCategories(): Promise<Category[]>;
  getCategoriesByShopType(shopType: string): Promise<Category[]>;

  // Product operations
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  getAllProducts(): Promise<Product[]>;
  getProductsByShop(shopId: number): Promise<Product[]>;
  getLowStockProducts(shopId?: number): Promise<Product[]>;
  getOutOfStockProducts(shopId?: number): Promise<Product[]>;

  // Order operations
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order | undefined>;
  deleteOrder(id: number): Promise<boolean>;
  getAllOrders(): Promise<Order[]>;
  getOrdersByShop(shopId: number): Promise<Order[]>;
  getOrdersByStatus(status: string, shopId?: number): Promise<Order[]>;

  // Order item operations
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private shops: Map<number, Shop>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private currentIds: {
    users: number;
    shops: number;
    categories: number;
    products: number;
    orders: number;
    orderItems: number;
  };

  constructor() {
    this.users = new Map();
    this.shops = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.currentIds = {
      users: 1,
      shops: 1,
      categories: 1,
      products: 1,
      orders: 1,
      orderItems: 1,
    };

    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Create admin user
    const admin: User = {
      id: this.currentIds.users++,
      username: "admin",
      email: "admin@shopmanager.com",
      password: "admin123", // In real app, this would be hashed
      role: "admin",
      name: "Admin User",
      phone: "+1-234-567-8900",
      isActive: true,
      createdAt: new Date(),
    };
    this.users.set(admin.id, admin);

    // Create shopkeeper users
    const shopkeeper1: User = {
      id: this.currentIds.users++,
      username: "shopkeeper1",
      email: "shop@dairy.com",
      password: "shop123",
      role: "shopkeeper",
      name: "John Smith",
      phone: "+1-234-567-8901",
      isActive: true,
      createdAt: new Date(),
    };
    this.users.set(shopkeeper1.id, shopkeeper1);

    // Create shops
    const dairyShop: Shop = {
      id: this.currentIds.shops++,
      name: "Fresh Dairy Shop",
      type: "dairy",
      ownerId: shopkeeper1.id,
      address: "123 Main St, City",
      phone: "+1-234-567-8901",
      email: "shop@dairy.com",
      isActive: true,
      createdAt: new Date(),
    };
    this.shops.set(dairyShop.id, dairyShop);

    // Create categories
    const dairyCategory: Category = {
      id: this.currentIds.categories++,
      name: "Dairy Products",
      shopType: "dairy",
      description: "Fresh dairy products",
      isActive: true,
    };
    this.categories.set(dairyCategory.id, dairyCategory);

    // Create sample products
    const milk: Product = {
      id: this.currentIds.products++,
      name: "Fresh Milk 1L",
      sku: "MILK001",
      description: "Fresh organic milk",
      price: "4.99",
      stock: 25,
      minStock: 10,
      unit: "liters",
      brand: "FreshFarm",
      imageUrl: null,
      categoryId: dairyCategory.id,
      shopId: dairyShop.id,
      isActive: true,
      createdAt: new Date(),
    };
    this.products.set(milk.id, milk);

    // Create sample orders
    const order1: Order = {
      id: this.currentIds.orders++,
      orderNumber: "ORD-001",
      customerId: null,
      shopId: dairyShop.id,
      status: "completed",
      totalAmount: "24.95",
      itemCount: 5,
      customerName: "Alice Johnson",
      customerPhone: "+1-234-567-8902",
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.set(order1.id, order1);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentIds.users++,
      phone: insertUser.phone || null,
      isActive: insertUser.isActive ?? true,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Shop operations
  async getShop(id: number): Promise<Shop | undefined> {
    return this.shops.get(id);
  }

  async createShop(insertShop: InsertShop): Promise<Shop> {
    const shop: Shop = {
      ...insertShop,
      id: this.currentIds.shops++,
      address: insertShop.address || null,
      phone: insertShop.phone || null,
      email: insertShop.email || null,
      isActive: insertShop.isActive ?? true,
      ownerId: insertShop.ownerId || null,
      createdAt: new Date(),
    };
    this.shops.set(shop.id, shop);
    return shop;
  }

  async updateShop(id: number, shopData: Partial<InsertShop>): Promise<Shop | undefined> {
    const shop = this.shops.get(id);
    if (!shop) return undefined;
    
    const updatedShop = { ...shop, ...shopData };
    this.shops.set(id, updatedShop);
    return updatedShop;
  }

  async deleteShop(id: number): Promise<boolean> {
    return this.shops.delete(id);
  }

  async getAllShops(): Promise<Shop[]> {
    return Array.from(this.shops.values());
  }

  async getShopsByOwner(ownerId: number): Promise<Shop[]> {
    return Array.from(this.shops.values()).filter(shop => shop.ownerId === ownerId);
  }

  // Category operations
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const category: Category = {
      ...insertCategory,
      id: this.currentIds.categories++,
      description: insertCategory.description || null,
      isActive: insertCategory.isActive ?? true,
    };
    this.categories.set(category.id, category);
    return category;
  }

  async updateCategory(id: number, categoryData: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updatedCategory = { ...category, ...categoryData };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoriesByShopType(shopType: string): Promise<Category[]> {
    return Array.from(this.categories.values()).filter(cat => cat.shopType === shopType);
  }

  // Product operations
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const product: Product = {
      ...insertProduct,
      id: this.currentIds.products++,
      description: insertProduct.description || null,
      brand: insertProduct.brand || null,
      imageUrl: insertProduct.imageUrl || null,
      shopId: insertProduct.shopId || null,
      categoryId: insertProduct.categoryId || null,
      isActive: insertProduct.isActive ?? true,
      createdAt: new Date(),
    };
    this.products.set(product.id, product);
    return product;
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...productData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsByShop(shopId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.shopId === shopId);
  }

  async getLowStockProducts(shopId?: number): Promise<Product[]> {
    let products = Array.from(this.products.values());
    if (shopId) {
      products = products.filter(product => product.shopId === shopId);
    }
    return products.filter(product => product.stock <= product.minStock && product.stock > 0);
  }

  async getOutOfStockProducts(shopId?: number): Promise<Product[]> {
    let products = Array.from(this.products.values());
    if (shopId) {
      products = products.filter(product => product.shopId === shopId);
    }
    return products.filter(product => product.stock === 0);
  }

  // Order operations
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const order: Order = {
      ...insertOrder,
      id: this.currentIds.orders++,
      status: insertOrder.status || "pending",
      shopId: insertOrder.shopId || null,
      customerId: insertOrder.customerId || null,
      customerPhone: insertOrder.customerPhone || null,
      notes: insertOrder.notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.set(order.id, order);
    return order;
  }

  async updateOrder(id: number, orderData: Partial<InsertOrder>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, ...orderData, updatedAt: new Date() };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async deleteOrder(id: number): Promise<boolean> {
    return this.orders.delete(id);
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrdersByShop(shopId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.shopId === shopId);
  }

  async getOrdersByStatus(status: string, shopId?: number): Promise<Order[]> {
    let orders = Array.from(this.orders.values()).filter(order => order.status === status);
    if (shopId) {
      orders = orders.filter(order => order.shopId === shopId);
    }
    return orders;
  }

  // Order item operations
  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const orderItem: OrderItem = {
      ...insertOrderItem,
      id: this.currentIds.orderItems++,
      orderId: insertOrderItem.orderId || null,
      productId: insertOrderItem.productId || null,
    };
    this.orderItems.set(orderItem.id, orderItem);
    return orderItem;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
  }
}

export const storage = new MemStorage();
