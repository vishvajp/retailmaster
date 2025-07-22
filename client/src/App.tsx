import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ManageShops from "@/pages/admin/ManageShops";
import StockManagement from "@/pages/admin/StockManagement";
import ShopkeeperDashboard from "@/pages/shopkeeper/ShopkeeperDashboard";
import AddProduct from "@/pages/shopkeeper/AddProduct";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/login" component={Login} />
      
      {/* Admin routes */}
      <Route path="/admin">
        <ProtectedRoute requireRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/shops">
        <ProtectedRoute requireRole="admin">
          <ManageShops />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/stock">
        <ProtectedRoute requireRole="admin">
          <StockManagement />
        </ProtectedRoute>
      </Route>
      
      {/* Shopkeeper routes */}
      <Route path="/shopkeeper">
        <ProtectedRoute requireRole="shopkeeper">
          <ShopkeeperDashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/shopkeeper/add-product">
        <ProtectedRoute requireRole="shopkeeper">
          <AddProduct />
        </ProtectedRoute>
      </Route>
      
      {/* Default route - redirect to login */}
      <Route path="/">
        <ProtectedRoute>
          <div></div>
        </ProtectedRoute>
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
