import { useQuery } from "@tanstack/react-query";
import ShopkeeperSidebar from "@/components/Layout/ShopkeeperSidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import StatsCard from "@/components/ui/stats-card";

export default function ShopkeeperReports() {
  const { data: orders = [] } = useQuery({
    queryKey: ["/api/orders"],
  });

  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
  });

  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;

  return (
    <div className="min-h-screen d-flex">
      <ShopkeeperSidebar />
      
      <div className="main-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold">Sales Reports</h2>
            <p className="text-muted mb-0">Track your shop performance</p>
          </div>
          <div>
            <select className="form-select form-select-sm">
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>Today</option>
            </select>
          </div>
        </div>

        {/* Sales Overview */}
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
              title="Total Products"
              value={products.length}
              icon="fas fa-box"
              variant="default"
            />
          </div>
        </div>

        <div className="row">
          {/* Best Selling Products */}
          <div className="col-lg-8 mb-4">
            <Card>
              <CardHeader>
                <h5 className="fw-bold mb-0">Best Selling Products</h5>
              </CardHeader>
              <CardContent>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Units Sold</th>
                        <th>Revenue</th>
                        <th>Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.slice(0, 5).map((product, index) => (
                        <tr key={product.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <span className="badge bg-primary me-2">{index + 1}</span>
                              <div>
                                <div className="fw-semibold">{product.name}</div>
                                <small className="text-muted">{product.brand}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="fw-bold">25</span> units
                          </td>
                          <td>
                            <span className="fw-bold text-success">₹125.00</span>
                          </td>
                          <td>
                            <span className="text-success">
                              <i className="fas fa-arrow-up me-1"></i>+12%
                            </span>
                          </td>
                        </tr>
                      ))}
                      {products.length === 0 && (
                        <tr>
                          <td colSpan={4} className="text-center text-muted py-4">
                            No products data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="col-lg-4 mb-4">
            <Card className="mb-3">
              <CardHeader>
                <h6 className="fw-bold mb-0">Daily Performance</h6>
              </CardHeader>
              <CardContent>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Today's Sales</span>
                  <strong className="text-success">₹85.50</strong>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Orders Today</span>
                  <strong>8</strong>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Avg. Order Value</span>
                  <strong>₹10.69</strong>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span>Customer Return Rate</span>
                  <strong className="text-success">78%</strong>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h6 className="fw-bold mb-0">Inventory Status</h6>
              </CardHeader>
              <CardContent>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Total Products</span>
                  <strong>{products.length}</strong>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Low Stock Items</span>
                  <strong className="text-warning">3</strong>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Out of Stock</span>
                  <strong className="text-danger">1</strong>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span>Inventory Value</span>
                  <strong className="text-success">₹2,340</strong>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Monthly Overview */}
        <Card>
          <CardHeader>
            <h5 className="fw-bold mb-0">Monthly Overview</h5>
          </CardHeader>
          <CardContent>
            <div className="table-responsive">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>This Month</th>
                    <th>Last Month</th>
                    <th>Change</th>
                    <th>Goal</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Revenue</td>
                    <td>₹1,250.00</td>
                    <td>₹1,100.00</td>
                    <td><span className="text-success">+13.6%</span></td>
                    <td>₹1,500.00</td>
                    <td>
                      <div className="progress" style={{ height: "6px" }}>
                        <div className="progress-bar bg-success" style={{ width: "83%" }}></div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Orders</td>
                    <td>89</td>
                    <td>76</td>
                    <td><span className="text-success">+17.1%</span></td>
                    <td>100</td>
                    <td>
                      <div className="progress" style={{ height: "6px" }}>
                        <div className="progress-bar bg-info" style={{ width: "89%" }}></div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>New Products</td>
                    <td>5</td>
                    <td>3</td>
                    <td><span className="text-success">+66.7%</span></td>
                    <td>8</td>
                    <td>
                      <div className="progress" style={{ height: "6px" }}>
                        <div className="progress-bar bg-warning" style={{ width: "62%" }}></div>
                      </div>
                    </td>
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