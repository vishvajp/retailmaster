import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

export default function ShopkeeperSidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location === path;

  return (
    <div className="sidebar">
      <div className="p-3 border-bottom border-secondary">
        <h4 className="text-white mb-0">
          <i className="fas fa-store me-2"></i>
          ShopManager Pro
        </h4>
        <small className="text-muted">Shopkeeper Panel</small>
      </div>
      
      <nav className="nav flex-column p-3">
        <Link href="/shopkeeper/dashboard" className={`nav-link ${isActive('/shopkeeper/dashboard') ? 'active' : ''}`}>
          <i className="fas fa-tachometer-alt me-2"></i>
          Dashboard
        </Link>
        
        <Link href="/shopkeeper/products" className={`nav-link ${isActive('/shopkeeper/products') ? 'active' : ''}`}>
          <i className="fas fa-box me-2"></i>
          My Products
        </Link>
        
        <Link href="/shopkeeper/add-product" className={`nav-link ${isActive('/shopkeeper/add-product') ? 'active' : ''}`}>
          <i className="fas fa-plus me-2"></i>
          Add Product
        </Link>
        
        <Link href="/shopkeeper/orders" className={`nav-link ${isActive('/shopkeeper/orders') ? 'active' : ''}`}>
          <i className="fas fa-shopping-cart me-2"></i>
          Orders
        </Link>
        
        <Link href="/shopkeeper/stock" className={`nav-link ${isActive('/shopkeeper/stock') ? 'active' : ''}`}>
          <i className="fas fa-exclamation-triangle me-2"></i>
          Stock Alerts
        </Link>
        
        <Link href="/shopkeeper/billing" className={`nav-link ${isActive('/shopkeeper/billing') ? 'active' : ''}`}>
          <i className="fas fa-file-invoice-dollar me-2"></i>
          Billing
        </Link>
        
        <Link href="/shopkeeper/reports" className={`nav-link ${isActive('/shopkeeper/reports') ? 'active' : ''}`}>
          <i className="fas fa-chart-line me-2"></i>
          Sales Report
        </Link>
      </nav>

      <div className="mt-auto p-3 border-top border-secondary">
        <div className="d-flex align-items-center mb-3">
          <div className="bg-success rounded-circle d-flex align-items-center justify-content-center me-3" 
               style={{ width: "40px", height: "40px" }}>
            <i className="fas fa-user text-white"></i>
          </div>
          <div>
            <div className="text-white fw-semibold">{user?.name}</div>
            <small className="text-muted">{user?.email}</small>
          </div>
        </div>
        <button 
          onClick={logout}
          className="btn btn-outline-light btn-sm w-100"
        >
          <i className="fas fa-sign-out-alt me-2"></i>
          Logout
        </button>
      </div>
    </div>
  );
}