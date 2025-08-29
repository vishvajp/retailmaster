import Sidebar from "./Sidebar";

export default function ShopkeeperSidebar() {
  const sidebarItems = [
    {
      href: "/shopkeeper",
      icon: "fas fa-tachometer-alt",
      label: "Dashboard",
    },
    {
      href: "/shopkeeper/products",
      icon: "fas fa-box",
      label: "My Products",
    },
    {
      href: "/shopkeeper/add-product",
      icon: "fas fa-plus",
      label: "Add New Product",
    },
    {
      href: "/shopkeeper/categories",
      icon: "fas fa-tags",
      label: "Category Management",
    },
    {
      href: "/shopkeeper/stock",
      icon: "fas fa-warehouse",
      label: "Stock Management",
    },
    {
      href: "/shopkeeper/billing",
      icon: "fas fa-receipt",
      label: "Billing",
    },
    {
      href: "/shopkeeper/bill-history",
      icon: "fas fa-history",
      label: "Bill History",
    },
    {
      href: "/shopkeeper/sales",
      icon: "fas fa-chart-line",
      label: "Sales Summary",
    },
    {
      href: "/shopkeeper/settings",
      icon: "fas fa-cog",
      label: "Settings",
    },
  ];

  return (
    <Sidebar
      title="My Shop"
      subtitle="Fresh Dairy Shop"
      items={sidebarItems}
    />
  );
}
