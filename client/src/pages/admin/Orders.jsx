import { useQuery } from "@tanstack/react-query";
import AdminSidebar from "@/components/Layout/AdminSidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Orders() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["/api/orders"],
  });

  return (
    <div className="min-h-screen d-flex">
      <AdminSidebar />
      
      <div className="main-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">All Orders</h2>
          <div>
            <select className="form-select form-select-sm me-2">
              <option>All Status</option>
              <option>Pending</option>
              <option>Processing</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <h5 className="fw-bold mb-0">Order Management</h5>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Shop</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? orders.map((order) => (
                      <tr key={order.id}>
                        <td><strong>#{order.id}</strong></td>
                        <td>{order.customerName}</td>
                        <td>
                          <span className="badge bg-secondary">{order.shopName}</span>
                        </td>
                        <td>{order.itemCount || 1}</td>
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
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>
                          <Button size="sm" variant="outline" className="me-2">
                            <i className="fas fa-eye"></i>
                          </Button>
                          <Button size="sm" variant="outline">
                            <i className="fas fa-edit"></i>
                          </Button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={8} className="text-center text-muted py-4">
                          No orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}