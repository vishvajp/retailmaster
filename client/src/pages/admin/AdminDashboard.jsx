import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminSidebar from "@/components/Layout/AdminSidebar";
import StatsCard from "@/components/ui/stats-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AdminDashboard() {
  const [selectedShopId, setSelectedShopId] = useState("all");

  // Fetch all shops for the dropdown
  const { data: shops = [] } = useQuery({
    queryKey: ["/api/shops"],
  });

  // Build query URLs based on selected shop
  const statsUrl = selectedShopId === "all" 
    ? "/api/dashboard/stats" 
    : `/api/dashboard/stats?shopId=${selectedShopId}`;
    
  const ordersUrl = selectedShopId === "all"
    ? "/api/orders"
    : `/api/orders/shop/${selectedShopId}`;

  const { data: stats, isLoading } = useQuery({
    queryKey: [statsUrl],
  });

  const { data: recentOrders = [] } = useQuery({
    queryKey: [ordersUrl],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen d-flex">
        <AdminSidebar />
        <div className="main-content">
          <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen d-flex">
      <AdminSidebar />
      
      <div className="main-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold">
              Admin Dashboard
              {selectedShopId !== "all" && stats?.shopName && (
                <span className="text-muted fs-6 ms-2">
                  - {stats.shopName} ({stats.shopType})
                </span>
              )}
            </h2>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center">
              <label htmlFor="shopSelect" className="form-label me-2 mb-0">View Shop:</label>
              <select 
                id="shopSelect"
                className="form-select form-select-sm"
                value={selectedShopId}
                onChange={(e) => setSelectedShopId(e.target.value)}
                style={{ minWidth: "200px" }}
              >
                <option value="all">All Shops</option>
                {shops.map((shop) => (
                  <option key={shop.id} value={shop.id}>
                    {shop.name} ({shop.type})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span className="badge bg-success">Online</span>
              <span className="text-muted ms-2">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <StatsCard
              title="Total Shops"
              value={stats?.totalShops || 0}
              icon="fas fa-store"
              variant="default"
            />
          </div>
          <div className="col-md-3 mb-3">
            <StatsCard
              title="Total Revenue"
              value={`$${stats?.totalRevenue || "0.00"}`}
              icon="fas fa-dollar-sign"
              variant="success"
            />
          </div>
          <div className="col-md-3 mb-3">
            <StatsCard
              title="Total Orders"
              value={stats?.totalOrders || 0}
              icon="fas fa-shopping-cart"
              variant="warning"
            />
          </div>
          <div className="col-md-3 mb-3">
            <StatsCard
              title="Low Stock Alert"
              value={stats?.lowStockCount || 0}
              icon="fas fa-exclamation-triangle"
              variant="danger"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="row">
          <div className="col-lg-8 mb-4">
            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold mb-0">Recent Orders</h5>
                  <a href="/admin/orders" className="btn btn-outline-primary btn-sm">
                    View All
                  </a>
                </div>
              </CardHeader>
              <CardContent>
                {recentOrders.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Shop</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.slice(0, 5).map((order) => (
                          <tr key={order.id}>
                            <td><strong>#{order.id}</strong></td>
                            <td>{order.customerName}</td>
                            <td>
                              <span className="badge bg-secondary">{order.shopName}</span>
                            </td>
                            <td><strong>${order.total}</strong></td>
                            <td>
                              <span className={`badge ${
                                order.status === 'completed' ? 'bg-success' :
                                order.status === 'pending' ? 'bg-warning' :
                                'bg-info'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center text-muted py-4">
                    <i className="fas fa-shopping-cart fs-1 mb-3"></i>
                    <p>No recent orders</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="col-lg-4 mb-4">
            <Card>
              <CardHeader>
                <h5 className="fw-bold mb-0">Quick Actions</h5>
              </CardHeader>
              <CardContent>
                <div className="d-grid gap-2">
                  <a href="/admin/shops" className="btn btn-outline-primary">
                    <i className="fas fa-plus me-2"></i>Add New Shop
                  </a>
                  <a href="/admin/stock" className="btn btn-outline-warning">
                    <i className="fas fa-exclamation-triangle me-2"></i>Check Stock Alerts
                  </a>
                  <a href="/admin/reports" className="btn btn-outline-info">
                    <i className="fas fa-chart-bar me-2"></i>View Reports
                  </a>
                  <a href="/admin/users" className="btn btn-outline-secondary">
                    <i className="fas fa-users me-2"></i>Manage Users
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}