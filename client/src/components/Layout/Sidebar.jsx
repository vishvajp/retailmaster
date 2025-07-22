import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export default function Sidebar({ title, subtitle, items, className }) {
  const [location] = useLocation();
  const { logout } = useAuth();

  return (
    <nav className={cn("sidebar", className)}>
      <div className="p-3">
        <h4 className="text-white fw-bold">
          <i className="fas fa-store me-2"></i>
          {title}
        </h4>
        <small className="text-white-50">{subtitle}</small>
      </div>
      
      <ul className="nav flex-column">
        {items.map((item) => (
          <li key={item.href} className="nav-item">
            {item.onClick ? (
              <button
                onClick={item.onClick}
                className={cn(
                  "nav-link w-100 text-start",
                  location === item.href && "active"
                )}
              >
                <i className={`${item.icon} me-2`}></i>
                {item.label}
              </button>
            ) : (
              <Link
                href={item.href}
                className={cn(
                  "nav-link",
                  location === item.href && "active"
                )}
              >
                <i className={`${item.icon} me-2`}></i>
                {item.label}
              </Link>
            )}
          </li>
        ))}
        
        <li className="nav-item mt-3">
          <button
            onClick={logout}
            className="nav-link w-100 text-start"
          >
            <i className="fas fa-sign-out-alt me-2"></i>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}