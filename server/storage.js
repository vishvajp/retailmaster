import { 
  users, shops, categories, products, orders, orderItems, customers, bills, billItems
} from "../shared/schema.js";

export class MemStorage {
  constructor() {
    this.users = new Map();
    this.shops = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.customers = new Map();
    this.bills = new Map();
    this.billItems = new Map();
    this.currentIds = {
      users: 0,
      shops: 0,
      categories: 0,
      products: 0,
      orders: 0,
      orderItems: 0,
      customers: 0,
      bills: 0,
      billItems: 0,
    };

    // Initialize with demo data
    this.initializeDemoData();
  }

  initializeDemoData() {
    // Create admin user
    const admin = {
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
    const shopkeeper1 = {
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
    const dairyShop = {
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
    const dairyCategory = {
      id: this.currentIds.categories++,
      name: "Dairy Products",
      shopType: "dairy",
      description: "Fresh dairy products",
      isActive: true,
    };
    this.categories.set(dairyCategory.id, dairyCategory);

    // Create sample products
    const milk = {
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
    const order1 = {
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

    // Create demo customers
    const customer1 = {
      id: this.currentIds.customers++,
      name: "Alice Johnson",
      phone: "+1-234-567-8910",
      email: "alice.johnson@email.com",
      address: "456 Oak Street, City",
      shopId: dairyShop.id,
      isActive: true,
      createdAt: new Date(),
    };
    this.customers.set(customer1.id, customer1);

    const customer2 = {
      id: this.currentIds.customers++,
      name: "Bob Smith",
      phone: "+1-234-567-8911",
      email: "bob.smith@email.com",
      address: "789 Pine Avenue, City",
      shopId: dairyShop.id,
      isActive: true,
      createdAt: new Date(),
    };
    this.customers.set(customer2.id, customer2);

    const customer3 = {
      id: this.currentIds.customers++,
      name: "Carol Davis",
      phone: "+1-234-567-8912",
      email: "carol.davis@email.com",
      address: "321 Elm Street, City",
      shopId: dairyShop.id,
      isActive: true,
      createdAt: new Date(),
    };
    this.customers.set(customer3.id, customer3);
  }

  // User operations
  async getUser(id) {
    return this.users.get(id);
  }

  async getUserByEmail(email) {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser) {
    const user = {
      ...insertUser,
      id: this.currentIds.users++,
      phone: insertUser.phone || null,
      isActive: insertUser.isActive ?? true,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id, userData) {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers() {
    return Array.from(this.users.values());
  }

  // Shop operations
  async getShop(id) {
    return this.shops.get(id);
  }

  async createShop(insertShop) {
    const shop = {
      ...insertShop,
      id: this.currentIds.shops++,
      isActive: insertShop.isActive ?? true,
      createdAt: new Date(),
    };
    this.shops.set(shop.id, shop);
    return shop;
  }

  async updateShop(id, shopData) {
    const shop = this.shops.get(id);
    if (!shop) return undefined;
    
    const updatedShop = { ...shop, ...shopData };
    this.shops.set(id, updatedShop);
    return updatedShop;
  }

  async deleteShop(id) {
    return this.shops.delete(id);
  }

  async getAllShops() {
    return Array.from(this.shops.values());
  }

  async getShopsByOwner(ownerId) {
    return Array.from(this.shops.values()).filter(shop => shop.ownerId === ownerId);
  }

  // Category operations
  async getCategory(id) {
    return this.categories.get(id);
  }

  async createCategory(insertCategory) {
    const category = {
      ...insertCategory,
      id: this.currentIds.categories++,
      isActive: insertCategory.isActive ?? true,
    };
    this.categories.set(category.id, category);
    return category;
  }

  async updateCategory(id, categoryData) {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updatedCategory = { ...category, ...categoryData };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id) {
    return this.categories.delete(id);
  }

  async getAllCategories() {
    return Array.from(this.categories.values());
  }

  async getCategoriesByShopType(shopType) {
    return Array.from(this.categories.values()).filter(category => category.shopType === shopType);
  }

  // Product operations
  async getProduct(id) {
    return this.products.get(id);
  }

  async createProduct(insertProduct) {
    const product = {
      ...insertProduct,
      id: this.currentIds.products++,
      isActive: insertProduct.isActive ?? true,
      createdAt: new Date(),
    };
    this.products.set(product.id, product);
    return product;
  }

  async updateProduct(id, productData) {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...productData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id) {
    return this.products.delete(id);
  }

  async getAllProducts() {
    return Array.from(this.products.values());
  }

  async getProductsByShop(shopId) {
    return Array.from(this.products.values()).filter(product => product.shopId === shopId);
  }

  async getLowStockProducts(shopId) {
    let products = Array.from(this.products.values());
    if (shopId) {
      products = products.filter(product => product.shopId === shopId);
    }
    return products.filter(product => product.stock <= product.minStock && product.stock > 0);
  }

  async getOutOfStockProducts(shopId) {
    let products = Array.from(this.products.values());
    if (shopId) {
      products = products.filter(product => product.shopId === shopId);
    }
    return products.filter(product => product.stock === 0);
  }

  // Order operations
  async getOrder(id) {
    return this.orders.get(id);
  }

  async createOrder(insertOrder) {
    const order = {
      ...insertOrder,
      id: this.currentIds.orders++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.set(order.id, order);
    return order;
  }

  async updateOrder(id, orderData) {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, ...orderData, updatedAt: new Date() };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async deleteOrder(id) {
    return this.orders.delete(id);
  }

  async getAllOrders() {
    return Array.from(this.orders.values());
  }

  async getOrdersByShop(shopId) {
    return Array.from(this.orders.values()).filter(order => order.shopId === shopId);
  }

  async getOrdersByStatus(status, shopId) {
    let orders = Array.from(this.orders.values()).filter(order => order.status === status);
    if (shopId) {
      orders = orders.filter(order => order.shopId === shopId);
    }
    return orders;
  }

  // Order item operations
  async createOrderItem(insertOrderItem) {
    const orderItem = {
      ...insertOrderItem,
      id: this.currentIds.orderItems++,
    };
    this.orderItems.set(orderItem.id, orderItem);
    return orderItem;
  }

  async getOrderItems(orderId) {
    return Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
  }

  // Customer operations
  async createCustomer(insertCustomer) {
    const customer = {
      ...insertCustomer,
      id: this.currentIds.customers++,
      createdAt: new Date(),
    };
    this.customers.set(customer.id, customer);
    return customer;
  }

  async getCustomer(id) {
    return this.customers.get(id);
  }

  async getAllCustomers() {
    return Array.from(this.customers.values());
  }

  async getCustomersByShop(shopId) {
    return Array.from(this.customers.values()).filter(customer => customer.shopId === shopId);
  }

  async searchCustomers(query, shopId) {
    const customers = await this.getCustomersByShop(shopId);
    if (!query) return customers;
    
    const lowerQuery = query.toLowerCase();
    return customers.filter(customer => 
      customer.name.toLowerCase().includes(lowerQuery) ||
      customer.phone.includes(query) ||
      (customer.email && customer.email.toLowerCase().includes(lowerQuery))
    );
  }

  async updateCustomer(id, updates) {
    const customer = this.customers.get(id);
    if (!customer) return undefined;
    
    const updatedCustomer = { ...customer, ...updates };
    this.customers.set(id, updatedCustomer);
    return updatedCustomer;
  }

  async deleteCustomer(id) {
    return this.customers.delete(id);
  }

  // Bill operations
  async createBill(insertBill) {
    const bill = {
      ...insertBill,
      id: this.currentIds.bills++,
      createdAt: new Date(),
    };
    this.bills.set(bill.id, bill);
    return bill;
  }

  async getBill(id) {
    return this.bills.get(id);
  }

  async getAllBills() {
    return Array.from(this.bills.values());
  }

  async getBillsByShop(shopId) {
    return Array.from(this.bills.values()).filter(bill => bill.shopId === shopId);
  }

  async getBillsByCustomer(customerId) {
    return Array.from(this.bills.values()).filter(bill => bill.customerId === customerId);
  }

  // Bill item operations
  async createBillItem(insertBillItem) {
    const billItem = {
      ...insertBillItem,
      id: this.currentIds.billItems++,
    };
    this.billItems.set(billItem.id, billItem);
    return billItem;
  }

  async getBillItemsByBill(billId) {
    return Array.from(this.billItems.values()).filter(item => item.billId === billId);
  }

  async getCustomerPurchaseHistory(customerId) {
    const customerBills = await this.getBillsByCustomer(customerId);
    const billsWithItems = await Promise.all(
      customerBills.map(async (bill) => ({
        ...bill,
        items: await this.getBillItemsByBill(bill.id),
      }))
    );
    return billsWithItems;
  }
}

export const storage = new MemStorage();