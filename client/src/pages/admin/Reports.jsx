import { useQuery } from "@tanstack/react-query";
import AdminSidebar from "@/components/Layout/AdminSidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import StatsCard from "@/components/ui/stats-card";

export default function Reports() {
  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["/api/orders"],
  });

  const { data: shops = [] } = useQuery({
    queryKey: ["/api/shops"],
  });

  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;

  return (
    <div className="min-h-screen d-flex">
      <AdminSidebar />
      
      <div className="main-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Reports & Analytics</h2>
          <div>
            <select className="form-select form-select-sm">
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>Today</option>
              <option>Custom range</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <StatsCard
              title="Total Revenue"
              value={`₹${totalRevenue.toFixed(2)}`}
              icon="fas fa-dollar-sign"
              variant="success"
            />
          </div>
          <div className="col-md-3 mb-3">
            <StatsCard
              title="Completed Orders"
              value={completedOrders}
              icon="fas fa-check-circle"
              variant="default"
            />
          </div>
          <div className="col-md-3 mb-3">
            <StatsCard
              title="Pending Orders"
              value={pendingOrders}
              icon="fas fa-clock"
              variant="warning"
            />
          </div>
          <div className="col-md-3 mb-3">
            <StatsCard
              title="Active Shops"
              value={shops.filter(shop => shop.isActive).length}
              icon="fas fa-store"
              variant="default"
            />
          </div>
        </div>

        <div className="row">
          {/* Sales by Shop Type */}
          <div className="col-lg-6 mb-4">
            <Card>
              <CardHeader>
                <h5 className="fw-bold mb-0">Sales by Shop Type</h5>
              </CardHeader>
              <CardContent>
                <div className="py-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-cheese text-info me-3"></i>
                      <span>Dairy Shops</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="me-3">₹1,250.00</span>
                      <span className="badge bg-info">45%</span>
                    </div>
                  </div>
                  <div className="progress mb-3" style={{ height: "8px" }}>
                    <div className="progress-bar bg-info" style={{ width: "45%" }}></div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-shopping-basket text-success me-3"></i>
                      <span>Grocery Stores</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="me-3">₹950.00</span>
                      <span className="badge bg-success">35%</span>
                    </div>
                  </div>
                  <div className="progress mb-3" style={{ height: "8px" }}>
                    <div className="progress-bar bg-success" style={{ width: "35%" }}></div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-drumstick-bite text-danger me-3"></i>
                      <span>Meat Markets</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="me-3">₹540.00</span>
                      <span className="badge bg-danger">20%</span>
                    </div>
                  </div>
                  <div className="progress" style={{ height: "8px" }}>
                    <div className="progress-bar bg-danger" style={{ width: "20%" }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Shops */}
          <div className="col-lg-6 mb-4">
            <Card>
              <CardHeader>
                <h5 className="fw-bold mb-0">Top Performing Shops</h5>
              </CardHeader>
              <CardContent>
                <div className="py-2">
                  {shops.slice(0, 5).map((shop, index) => (
                    <div key={shop.id} className="d-flex align-items-center justify-content-between py-2 border-bottom">
                      <div className="d-flex align-items-center">
                        <span className="badge bg-primary me-3">{index + 1}</span>
                        <div>
                          <div className="fw-semibold">{shop.name}</div>
                          <small className="text-muted">{shop.type}</small>
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold text-success">₹850.00</div>
                        <small className="text-muted">25 orders</small>
                      </div>
                    </div>
                  ))}
                  {shops.length === 0 && (
                    <div className="text-center text-muted py-4">
                      <i className="fas fa-chart-bar fs-1 mb-3"></i>
                      <p>No shop data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity Summary */}
        <Card>
          <CardHeader>
            <h5 className="fw-bold mb-0">Activity Summary</h5>
          </CardHeader>
          <CardContent>
            <div className="table-responsive">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Today</th>
                    <th>Yesterday</th>
                    <th>This Week</th>
                    <th>Change</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Orders</td>
                    <td>15</td>
                    <td>12</td>
                    <td>89</td>
                    <td><span className="text-success">+25%</span></td>
                  </tr>
                  <tr>
                    <td>Revenue</td>
                    <td>₹340.50</td>
                    <td>₹285.00</td>
                    <td>₹2,150.00</td>
                    <td><span className="text-success">+19%</span></td>
                  </tr>
                  <tr>
                    <td>New Users</td>
                    <td>3</td>
                    <td>1</td>
                    <td>8</td>
                    <td><span className="text-success">+200%</span></td>
                  </tr>
                  <tr>
                    <td>Products Added</td>
                    <td>5</td>
                    <td>7</td>
                    <td>28</td>
                    <td><span className="text-danger">-29%</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}