import { createServer } from "http";
import jwt from "jsonwebtoken";
import { storage } from "./storage.js";
import { loginSchema, insertUserSchema, insertShopSchema, insertProductSchema, insertOrderSchema } from "../shared/schema.js";

const JWT_SECRET = process.env.JWT_SECRET || "shop-management-secret-key";

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Middleware to check shopkeeper role or ownership
const requireShopkeeperOrOwner = async (req, res, next) => {
  if (req.user.role === 'admin') {
    return next(); // Admin can access everything
  }
  
  if (req.user.role === 'shopkeeper') {
    // Check if shopkeeper owns the shop being accessed
    const shopId = req.params.shopId || req.body.shopId;
    if (shopId) {
      const shop = await storage.getShop(parseInt(shopId));
      if (!shop || shop.ownerId !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }
    return next();
  }
  
  return res.status(403).json({ message: 'Access denied' });
};

export async function registerRoutes(app) {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (!user.isActive) {
        return res.status(401).json({ message: "Account is deactivated" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
      
      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req, res) => {
    res.json({
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
    });
  });

  // User management routes (Admin only)
  app.get("/api/users", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const sanitizedUsers = users.map(({ password, ...user }) => user);
      res.json(sanitizedUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/users", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      const { password, ...sanitizedUser } = user;
      res.status(201).json(sanitizedUser);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  // Shop management routes
  app.get("/api/shops", authenticateToken, async (req, res) => {
    try {
      let shops;
      if (req.user.role === 'admin') {
        shops = await storage.getAllShops();
      } else {
        shops = await storage.getShopsByOwner(req.user.id);
      }
      res.json(shops);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch shops" });
    }
  });

  app.post("/api/shops", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const shopData = insertShopSchema.parse(req.body);
      const shop = await storage.createShop(shopData);
      res.status(201).json(shop);
    } catch (error) {
      res.status(400).json({ message: "Invalid shop data" });
    }
  });

  app.put("/api/shops/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const shopData = insertShopSchema.partial().parse(req.body);
      const shop = await storage.updateShop(id, shopData);
      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }
      res.json(shop);
    } catch (error) {
      res.status(400).json({ message: "Invalid shop data" });
    }
  });

  app.delete("/api/shops/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteShop(id);
      if (!deleted) {
        return res.status(404).json({ message: "Shop not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete shop" });
    }
  });

  // Category routes
  app.get("/api/categories", authenticateToken, async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Product management routes
  app.get("/api/products", authenticateToken, async (req, res) => {
    try {
      let products;
      if (req.user.role === 'admin') {
        products = await storage.getAllProducts();
      } else {
        const shops = await storage.getShopsByOwner(req.user.id);
        const shopIds = shops.map(shop => shop.id);
        products = [];
        for (const shopId of shopIds) {
          const shopProducts = await storage.getProductsByShop(shopId);
          products.push(...shopProducts);
        }
      }
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/shop/:shopId", authenticateToken, requireShopkeeperOrOwner, async (req, res) => {
    try {
      const shopId = parseInt(req.params.shopId);
      const products = await storage.getProductsByShop(shopId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.post("/api/products", authenticateToken, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      
      // Check if shopkeeper owns the shop
      if (req.user.role === 'shopkeeper') {
        const shop = await storage.getShop(productData.shopId);
        if (!shop || shop.ownerId !== req.user.id) {
          return res.status(403).json({ message: "Access denied" });
        }
      }
      
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  app.put("/api/products/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const productData = insertProductSchema.partial().parse(req.body);
      
      // Check ownership for shopkeepers
      if (req.user.role === 'shopkeeper') {
        const existingProduct = await storage.getProduct(id);
        if (!existingProduct) {
          return res.status(404).json({ message: "Product not found" });
        }
        const shop = await storage.getShop(existingProduct.shopId);
        if (!shop || shop.ownerId !== req.user.id) {
          return res.status(403).json({ message: "Access denied" });
        }
      }
      
      const product = await storage.updateProduct(id, productData);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  app.delete("/api/products/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Check ownership for shopkeepers
      if (req.user.role === 'shopkeeper') {
        const existingProduct = await storage.getProduct(id);
        if (!existingProduct) {
          return res.status(404).json({ message: "Product not found" });
        }
        const shop = await storage.getShop(existingProduct.shopId);
        if (!shop || shop.ownerId !== req.user.id) {
          return res.status(403).json({ message: "Access denied" });
        }
      }
      
      const deleted = await storage.deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Stock management routes
  app.get("/api/stock/low", authenticateToken, async (req, res) => {
    try {
      const shopId = req.query.shopId;
      let products;
      
      if (req.user.role === 'admin') {
        if (shopId) {
          // Admin viewing specific shop
          const targetShopId = parseInt(shopId);
          products = await storage.getLowStockProducts(targetShopId);
        } else {
          // Admin viewing all shops
          products = await storage.getLowStockProducts();
        }
      } else {
        const shops = await storage.getShopsByOwner(req.user.id);
        products = [];
        for (const shop of shops) {
          const shopProducts = await storage.getLowStockProducts(shop.id);
          products.push(...shopProducts);
        }
      }
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch low stock products" });
    }
  });

  app.get("/api/stock/out", authenticateToken, async (req, res) => {
    try {
      const shopId = req.query.shopId;
      let products;
      
      if (req.user.role === 'admin') {
        if (shopId) {
          // Admin viewing specific shop
          const targetShopId = parseInt(shopId);
          products = await storage.getOutOfStockProducts(targetShopId);
        } else {
          // Admin viewing all shops
          products = await storage.getOutOfStockProducts();
        }
      } else {
        const shops = await storage.getShopsByOwner(req.user.id);
        products = [];
        for (const shop of shops) {
          const shopProducts = await storage.getOutOfStockProducts(shop.id);
          products.push(...shopProducts);
        }
      }
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch out of stock products" });
    }
  });

  // Order management routes
  app.get("/api/orders", authenticateToken, async (req, res) => {
    try {
      let orders;
      if (req.user.role === 'admin') {
        orders = await storage.getAllOrders();
      } else {
        const shops = await storage.getShopsByOwner(req.user.id);
        orders = [];
        for (const shop of shops) {
          const shopOrders = await storage.getOrdersByShop(shop.id);
          orders.push(...shopOrders);
        }
      }
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/shop/:shopId", authenticateToken, requireShopkeeperOrOwner, async (req, res) => {
    try {
      const shopId = parseInt(req.params.shopId);
      const orders = await storage.getOrdersByShop(shopId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.post("/api/orders", authenticateToken, async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      
      // Check if shopkeeper owns the shop
      if (req.user.role === 'shopkeeper') {
        const shop = await storage.getShop(orderData.shopId);
        if (!shop || shop.ownerId !== req.user.id) {
          return res.status(403).json({ message: "Access denied" });
        }
      }
      
      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid order data" });
    }
  });

  app.put("/api/orders/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const orderData = insertOrderSchema.partial().parse(req.body);
      
      // Check ownership for shopkeepers
      if (req.user.role === 'shopkeeper') {
        const existingOrder = await storage.getOrder(id);
        if (!existingOrder) {
          return res.status(404).json({ message: "Order not found" });
        }
        const shop = await storage.getShop(existingOrder.shopId);
        if (!shop || shop.ownerId !== req.user.id) {
          return res.status(403).json({ message: "Access denied" });
        }
      }
      
      const order = await storage.updateOrder(id, orderData);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid order data" });
    }
  });

  // Dashboard statistics
  app.get("/api/dashboard/stats", authenticateToken, async (req, res) => {
    try {
      const shopId = req.query.shopId;
      
      if (req.user.role === 'admin') {
        if (shopId && shopId !== 'all') {
          // Admin viewing specific shop
          const targetShopId = parseInt(shopId);
          const shop = await storage.getShop(targetShopId);
          if (!shop) {
            return res.status(404).json({ message: "Shop not found" });
          }
          
          const products = await storage.getProductsByShop(targetShopId);
          const orders = await storage.getOrdersByShop(targetShopId);
          const lowStockProducts = await storage.getLowStockProducts(targetShopId);
          
          const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
          
          res.json({
            totalShops: 1,
            totalProducts: products.length,
            totalOrders: orders.length,
            totalRevenue: totalRevenue.toFixed(2),
            lowStockCount: lowStockProducts.length,
            shopName: shop.name,
            shopType: shop.type,
          });
        } else {
          // Admin viewing all shops
          const shops = await storage.getAllShops();
          const products = await storage.getAllProducts();
          const orders = await storage.getAllOrders();
          const lowStockProducts = await storage.getLowStockProducts();
          
          const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
          
          res.json({
            totalShops: shops.length,
            totalProducts: products.length,
            totalOrders: orders.length,
            totalRevenue: totalRevenue.toFixed(2),
            lowStockCount: lowStockProducts.length,
          });
        }
      } else {
        const shops = await storage.getShopsByOwner(req.user.id);
        let products = [];
        let orders = [];
        let lowStockProducts = [];
        
        for (const shop of shops) {
          const shopProducts = await storage.getProductsByShop(shop.id);
          const shopOrders = await storage.getOrdersByShop(shop.id);
          const shopLowStock = await storage.getLowStockProducts(shop.id);
          
          products.push(...shopProducts);
          orders.push(...shopOrders);
          lowStockProducts.push(...shopLowStock);
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayOrders = orders.filter(order => 
          new Date(order.createdAt).getTime() >= today.getTime()
        );
        const dailyProfit = todayOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
        
        res.json({
          dailyProfit: dailyProfit.toFixed(2),
          ordersToday: todayOrders.length,
          totalProducts: products.length,
          lowStockItems: lowStockProducts.length,
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}