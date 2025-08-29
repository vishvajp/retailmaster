import Sidebar from "./Sidebar";
import { useQuery } from "@tanstack/react-query";

export default function ShopkeeperSidebar() {
  // Fetch shopkeeper's shops to get the correct shop name
  const { data: shops = [] } = useQuery({
    queryKey: ["/api/shops"],
  });
  
  // Get the first shop (shopkeeper should only have one shop)
  const shopInfo = shops.length > 0 ? shops[0] : null;
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
      subtitle={shopInfo ? shopInfo.name : "My Shop"}
      items={sidebarItems}
    />
  );
}
