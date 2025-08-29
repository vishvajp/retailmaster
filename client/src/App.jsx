import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext.jsx";
import ProtectedRoute from "@/components/ProtectedRoute.jsx";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login.jsx";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard.jsx";
import ManageShops from "@/pages/admin/ManageShops.jsx";
import StockManagement from "@/pages/admin/StockManagement.jsx";
import Orders from "@/pages/admin/Orders.jsx";
import UserManagement from "@/pages/admin/UserManagement.jsx";
import Reports from "@/pages/admin/Reports.jsx";

// Shopkeeper pages
import ShopkeeperDashboard from "@/pages/shopkeeper/ShopkeeperDashboard.jsx";
import Products from "@/pages/shopkeeper/Products.jsx";
import AddProduct from "@/pages/shopkeeper/AddProduct.jsx";
import ShopkeeperOrders from "@/pages/shopkeeper/Orders.jsx";
import StockAlerts from "@/pages/shopkeeper/StockAlerts.jsx";
import ShopkeeperReports from "@/pages/shopkeeper/Reports.jsx";
import Billing from "@/pages/shopkeeper/Billing.jsx";
import BillHistory from "@/pages/shopkeeper/BillHistory.jsx";
import Customers from "@/pages/shopkeeper/Customers.jsx";
import AddCustomer from "@/pages/shopkeeper/AddCustomer.jsx";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/login">
        <Login />
      </Route>
      
      {/* Admin routes */}
      <Route path="/admin">
        <ProtectedRoute requiredRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/dashboard">
        <ProtectedRoute requiredRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/shops">
        <ProtectedRoute requiredRole="admin">
          <ManageShops />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/stock">
        <ProtectedRoute requiredRole="admin">
          <StockManagement />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/orders">
        <ProtectedRoute requiredRole="admin">
          <Orders />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/users">
        <ProtectedRoute requiredRole="admin">
          <UserManagement />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/reports">
        <ProtectedRoute requiredRole="admin">
          <Reports />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/products">
        <ProtectedRoute requiredRole="admin">
          <StockManagement />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/categories">
        <ProtectedRoute requiredRole="admin">
          <ManageShops />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/settings">
        <ProtectedRoute requiredRole="admin">
          <UserManagement />
        </ProtectedRoute>
      </Route>
      
      {/* Shopkeeper routes */}
      <Route path="/shopkeeper">
        <ProtectedRoute requiredRole="shopkeeper">
          <ShopkeeperDashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/shopkeeper/dashboard">
        <ProtectedRoute requiredRole="shopkeeper">
          <ShopkeeperDashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/shopkeeper/products">
        <ProtectedRoute requiredRole="shopkeeper">
          <Products />
        </ProtectedRoute>
      </Route>
      
      <Route path="/shopkeeper/add-product">
        <ProtectedRoute requiredRole="shopkeeper">
          <AddProduct />
        </ProtectedRoute>
      </Route>
      
      <Route path="/shopkeeper/orders">
        <ProtectedRoute requiredRole="shopkeeper">
          <ShopkeeperOrders />
        </ProtectedRoute>
      </Route>
      
      <Route path="/shopkeeper/stock">
        <ProtectedRoute requiredRole="shopkeeper">
          <StockAlerts />
        </ProtectedRoute>
      </Route>
      
      <Route path="/shopkeeper/billing">
        <ProtectedRoute requiredRole="shopkeeper">
          <Billing />
        </ProtectedRoute>
      </Route>
      
      <Route path="/shopkeeper/bill-history">
        <ProtectedRoute requiredRole="shopkeeper">
          <BillHistory />
        </ProtectedRoute>
      </Route>
      
      <Route path="/shopkeeper/customers">
        <ProtectedRoute requiredRole="shopkeeper">
          <Customers />
        </ProtectedRoute>
      </Route>
      
      <Route path="/shopkeeper/add-customer">
        <ProtectedRoute requiredRole="shopkeeper">
          <AddCustomer />
        </ProtectedRoute>
      </Route>
      
      <Route path="/shopkeeper/reports">
        <ProtectedRoute requiredRole="shopkeeper">
          <ShopkeeperReports />
        </ProtectedRoute>
      </Route>
      
      <Route path="/shopkeeper/categories">
        <ProtectedRoute requiredRole="shopkeeper">
          <StockAlerts />
        </ProtectedRoute>
      </Route>
      
      <Route path="/shopkeeper/sales">
        <ProtectedRoute requiredRole="shopkeeper">
          <ShopkeeperReports />
        </ProtectedRoute>
      </Route>
      
      <Route path="/shopkeeper/settings">
        <ProtectedRoute requiredRole="shopkeeper">
          <ShopkeeperDashboard />
        </ProtectedRoute>
      </Route>
      
      {/* Default route - redirect based on role */}
      <Route path="/">
        <Login />
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;