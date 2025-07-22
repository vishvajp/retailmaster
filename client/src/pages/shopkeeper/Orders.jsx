import { useQuery } from "@tanstack/react-query";
import ShopkeeperSidebar from "@/components/Layout/ShopkeeperSidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ShopkeeperOrders() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["/api/orders"],
  });

  return (
    <div className="min-h-screen d-flex">
      <ShopkeeperSidebar />
      
      <div className="main-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold">My Orders</h2>
            <p className="text-muted mb-0">Track and manage your shop orders</p>
          </div>
          <div>
            <select className="form-select form-select-sm">
              <option>All Orders</option>
              <option>Pending</option>
              <option>Processing</option>
              <option>Completed</option>
            </select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <h5 className="fw-bold mb-0">Order History</h5>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : orders.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td><strong>#{order.id}</strong></td>
                        <td>
                          <div>
                            <div className="fw-semibold">{order.customerName}</div>
                            {order.customerPhone && (
                              <small className="text-muted">{order.customerPhone}</small>
                            )}
                          </div>
                        </td>
                        <td>{order.itemCount || 1} items</td>
                        <td><strong>${order.total}</strong></td>
                        <td>
                          <span className={`badge ${
                            order.status === 'completed' ? 'bg-success' :
                            order.status === 'pending' ? 'bg-warning' :
                            order.status === 'processing' ? 'bg-info' :
                            'bg-danger'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <div>
                            <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                            <small className="text-muted">
                              {new Date(order.createdAt).toLocaleTimeString()}
                            </small>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button size="sm" variant="outline">
                              <i className="fas fa-eye"></i>
                            </Button>
                            {order.status === 'pending' && (
                              <Button size="sm" className="btn-success">
                                <i className="fas fa-check"></i>
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-muted py-5">
                <i className="fas fa-shopping-cart fs-1 mb-3"></i>
                <p>No orders received yet</p>
                <small>Orders from customers will appear here</small>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}