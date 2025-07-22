import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminSidebar() {
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
        <small className="text-muted">Admin Panel</small>
      </div>
      
      <nav className="nav flex-column p-3">
        <Link href="/admin/dashboard" className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}>
          <i className="fas fa-tachometer-alt me-2"></i>
          Dashboard
        </Link>
        
        <Link href="/admin/shops" className={`nav-link ${isActive('/admin/shops') ? 'active' : ''}`}>
          <i className="fas fa-building me-2"></i>
          Manage Shops
        </Link>
        
        <Link href="/admin/stock" className={`nav-link ${isActive('/admin/stock') ? 'active' : ''}`}>
          <i className="fas fa-boxes me-2"></i>
          Stock Management
        </Link>
        
        <Link href="/admin/orders" className={`nav-link ${isActive('/admin/orders') ? 'active' : ''}`}>
          <i className="fas fa-shopping-cart me-2"></i>
          Orders
        </Link>
        
        <Link href="/admin/users" className={`nav-link ${isActive('/admin/users') ? 'active' : ''}`}>
          <i className="fas fa-users me-2"></i>
          User Management
        </Link>
        
        <Link href="/admin/reports" className={`nav-link ${isActive('/admin/reports') ? 'active' : ''}`}>
          <i className="fas fa-chart-bar me-2"></i>
          Reports
        </Link>
      </nav>

      <div className="mt-auto p-3 border-top border-secondary">
        <div className="d-flex align-items-center mb-3">
          <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
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