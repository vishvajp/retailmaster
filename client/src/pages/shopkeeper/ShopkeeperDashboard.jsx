import { useQuery } from "@tanstack/react-query";
import ShopkeeperSidebar from "@/components/Layout/ShopkeeperSidebar";
import StatsCard from "@/components/ui/stats-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function ShopkeeperDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: recentOrders = [] } = useQuery({
    queryKey: ["/api/orders"],
  });

  const { data: lowStockProducts = [] } = useQuery({
    queryKey: ["/api/stock/low"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen d-flex">
        <ShopkeeperSidebar />
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
      <ShopkeeperSidebar />
      
      <div className="main-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold">Dashboard</h2>
            <p className="text-muted mb-0">Fresh Dairy Shop - Daily Overview</p>
          </div>
          <div>
            <span className="badge bg-success">Online</span>
            <span className="text-muted ms-2">{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Shopkeeper Stats */}
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <StatsCard
              title="Today's Profit"
              value={`₹${stats?.dailyProfit || "0.00"}`}
              icon="fas fa-dollar-sign"
              variant="default"
            />
          </div>
          <div className="col-md-3 mb-3">
            <StatsCard
              title="Orders Today"
              value={stats?.ordersToday || 0}
              icon="fas fa-shopping-cart"
              variant="success"
            />
          </div>
          <div className="col-md-3 mb-3">
            <StatsCard
              title="Total Products"
              value={stats?.totalProducts || 0}
              icon="fas fa-box"
              variant="warning"
            />
          </div>
          <div className="col-md-3 mb-3">
            <StatsCard
              title="Low Stock Items"
              value={stats?.lowStockItems || 0}
              icon="fas fa-exclamation-triangle"
              variant="danger"
            />
          </div>
        </div>

        <div className="row">
          {/* Recent Orders */}
          <div className="col-lg-8 mb-4">
            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold mb-0">Recent Orders</h5>
                  <Link href="/shopkeeper/orders" className="btn btn-outline-primary btn-sm">
                    View All
                  </Link>
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
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.slice(0, 5).map((order) => (
                          <tr key={order.id}>
                            <td><strong>#{order.id}</strong></td>
                            <td>{order.customerName}</td>
                            <td><strong>₹{order.total}</strong></td>
                            <td>
                              <span className={`badge ${
                                order.status === 'completed' ? 'bg-success' :
                                order.status === 'pending' ? 'bg-warning' :
                                'bg-info'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td>
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                            </td>
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

          {/* Stock Alerts & Quick Actions */}
          <div className="col-lg-4">
            <div className="row">
              <div className="col-12 mb-4">
                <Card>
                  <CardHeader>
                    <h5 className="fw-bold mb-0">Stock Alerts</h5>
                  </CardHeader>
                  <CardContent>
                    {lowStockProducts.length > 0 ? (
                      <div>
                        {lowStockProducts.slice(0, 3).map((product) => (
                          <div key={product.id} className="d-flex align-items-center justify-content-between mb-2">
                            <div>
                              <small className="fw-bold">{product.name}</small>
                              <br />
                              <small className="text-muted">Stock: {product.stock}</small>
                            </div>
                            <span className="badge bg-warning">Low</span>
                          </div>
                        ))}
                        <Link href="/shopkeeper/stock" className="btn btn-outline-warning btn-sm w-100">
                          View All Alerts
                        </Link>
                      </div>
                    ) : (
                      <div className="text-center text-muted py-3">
                        <i className="fas fa-check-circle text-success fs-2 mb-2"></i>
                        <p className="small mb-0">All items in stock</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="col-12 mb-4">
                <Card>
                  <CardHeader>
                    <h5 className="fw-bold mb-0">Quick Actions</h5>
                  </CardHeader>
                  <CardContent>
                    <div className="d-grid gap-2">
                      <Link href="/shopkeeper/add-product" className="btn btn-outline-primary">
                        <i className="fas fa-plus me-2"></i>Add Product
                      </Link>
                      <Link href="/shopkeeper/orders" className="btn btn-outline-success">
                        <i className="fas fa-eye me-2"></i>View Orders
                      </Link>
                      <Link href="/shopkeeper/reports" className="btn btn-outline-info">
                        <i className="fas fa-chart-line me-2"></i>Sales Report
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}