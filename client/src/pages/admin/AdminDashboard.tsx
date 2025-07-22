import { useQuery } from "@tanstack/react-query";
import AdminSidebar from "@/components/Layout/AdminSidebar";
import StatsCard from "@/components/ui/stats-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface DashboardStats {
  totalShops: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: string;
  lowStockCount: number;
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: recentOrders = [] } = useQuery({
    queryKey: ["/api/orders"],
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
          <h2 className="fw-bold">Admin Dashboard</h2>
          <div>
            <span className="badge bg-success">Online</span>
            <span className="text-muted ms-2">{new Date().toLocaleDateString()}</span>
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
              title="Total Products"
              value={stats?.totalProducts || 0}
              icon="fas fa-box"
              variant="info"
            />
          </div>
        </div>

        {/* Charts and Recent Activity */}
        <div className="row">
          <div className="col-md-8 mb-4">
            <Card>
              <CardHeader>
                <h5 className="fw-bold mb-0">Sales Overview</h5>
              </CardHeader>
              <CardContent>
                <div className="chart-container">
                  <div className="text-center text-muted">
                    <i className="fas fa-chart-line fa-3x mb-3"></i>
                    <p>Sales Chart Placeholder</p>
                    <small>Integration with Chart.js required</small>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="col-md-4 mb-4">
            <Card>
              <CardHeader>
                <h5 className="fw-bold mb-0">Recent Orders</h5>
              </CardHeader>
              <CardContent>
                {recentOrders.slice(0, 3).map((order: any) => (
                  <div key={order.id} className="d-flex justify-content-between align-items-center border-bottom py-2">
                    <div>
                      <strong>#{order.orderNumber}</strong>
                      <br />
                      <small className="text-muted">{order.customerName}</small>
                    </div>
                    <span className={`badge ${
                      order.status === 'completed' ? 'bg-success' : 
                      order.status === 'pending' ? 'bg-warning' : 'bg-primary'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                ))}
                {recentOrders.length === 0 && (
                  <p className="text-muted text-center">No recent orders</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
