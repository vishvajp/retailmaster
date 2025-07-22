import { useQuery } from "@tanstack/react-query";
import ShopkeeperSidebar from "@/components/Layout/ShopkeeperSidebar";
import StatsCard from "@/components/ui/stats-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface ShopkeeperStats {
  dailyProfit: string;
  ordersToday: number;
  totalProducts: number;
  lowStockItems: number;
}

export default function ShopkeeperDashboard() {
  const { data: stats, isLoading } = useQuery<ShopkeeperStats>({
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
              value={`$${stats?.dailyProfit || "0.00"}`}
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
              title="Low Stock Alert"
              value={stats?.lowStockItems || 0}
              icon="fas fa-exclamation-triangle"
              variant="info"
            />
          </div>
        </div>

        {/* Quick Actions and Recent Orders */}
        <div className="row">
          <div className="col-md-8 mb-4">
            <Card>
              <CardHeader>
                <h5 className="fw-bold mb-0">Recent Orders</h5>
              </CardHeader>
              <CardContent>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead className="table-light">
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.slice(0, 5).map((order: any) => (
                        <tr key={order.id}>
                          <td><strong>#{order.orderNumber}</strong></td>
                          <td>{order.customerName}</td>
                          <td>{order.itemCount}</td>
                          <td>${order.totalAmount}</td>
                          <td>
                            <span className={`badge ${
                              order.status === 'completed' ? 'bg-success' :
                              order.status === 'pending' ? 'bg-warning' :
                              'bg-primary'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <Button size="sm" variant="outline" className="btn-action">
                              {order.status === 'pending' ? (
                                <i className="fas fa-check"></i>
                              ) : order.status === 'completed' ? (
                                <i className="fas fa-eye"></i>
                              ) : (
                                <i className="fas fa-truck"></i>
                              )}
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {recentOrders.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center text-muted py-4">
                            No recent orders
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="col-md-4 mb-4">
            <Card>
              <CardHeader>
                <h5 className="fw-bold mb-0">Quick Actions</h5>
              </CardHeader>
              <CardContent>
                <div className="d-grid gap-2">
                  <Link href="/shopkeeper/add-product">
                    <Button className="w-100">
                      <i className="fas fa-plus me-2"></i>Add New Product
                    </Button>
                  </Link>
                  <Link href="/shopkeeper/stock">
                    <Button variant="outline" className="w-100 btn-warning">
                      <i className="fas fa-warehouse me-2"></i>Update Stock
                    </Button>
                  </Link>
                  <Link href="/shopkeeper/orders">
                    <Button variant="outline" className="w-100 btn-info">
                      <i className="fas fa-shopping-cart me-2"></i>View All Orders
                    </Button>
                  </Link>
                  <Link href="/shopkeeper/sales">
                    <Button variant="outline" className="w-100 btn-success">
                      <i className="fas fa-chart-line me-2"></i>Sales Report
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-3">
              <CardHeader className="bg-warning text-dark">
                <h6 className="fw-bold mb-0">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  Stock Alerts
                </h6>
              </CardHeader>
              <CardContent>
                {lowStockProducts.slice(0, 3).map((product: any) => (
                  <div key={product.id} className="d-flex justify-content-between align-items-center border-bottom py-2">
                    <div>
                      <strong>{product.name}</strong>
                      <br />
                      <small className="text-muted">
                        Stock: <span className="text-danger">{product.stock}</span>
                      </small>
                    </div>
                    <Button size="sm" variant="outline" className="btn-warning">
                      <i className="fas fa-plus"></i>
                    </Button>
                  </div>
                ))}
                {lowStockProducts.length === 0 && (
                  <p className="text-muted text-center">No low stock alerts</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
