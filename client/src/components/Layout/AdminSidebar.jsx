import Sidebar from "./Sidebar";

export default function AdminSidebar() {
  const sidebarItems = [
    {
      href: "/admin",
      icon: "fas fa-tachometer-alt",
      label: "Dashboard",
    },
    {
      href: "/admin/shops",
      icon: "fas fa-store",
      label: "Manage Shops",
    },
    {
      href: "/admin/products",
      icon: "fas fa-box",
      label: "All Products",
    },
    {
      href: "/admin/categories",
      icon: "fas fa-tags",
      label: "Categories",
    },
    {
      href: "/admin/stock",
      icon: "fas fa-warehouse",
      label: "Stock Management",
    },
    {
      href: "/admin/orders",
      icon: "fas fa-shopping-cart",
      label: "Orders",
    },
    {
      href: "/admin/users",
      icon: "fas fa-users",
      label: "User Management",
    },
    {
      href: "/admin/reports",
      icon: "fas fa-chart-line",
      label: "Sales Reports",
    },
    {
      href: "/admin/settings",
      icon: "fas fa-cog",
      label: "Settings",
    },
  ];

  return (
    <Sidebar
      title="Admin Panel"
      subtitle="Welcome, Admin"
      items={sidebarItems}
    />
  );
}
