import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminSidebar from "@/components/Layout/AdminSidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Orders() {
  const [selectedShopId, setSelectedShopId] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Fetch all shops for the dropdown
  const { data: shops = [] } = useQuery({
    queryKey: ["/api/shops"],
  });

  // Build query URL based on selected shop
  const ordersUrl = selectedShopId === "all"
    ? "/api/orders"
    : `/api/orders/shop/${selectedShopId}`;

  const { data: orders = [], isLoading } = useQuery({
    queryKey: [ordersUrl],
  });

  // Filter orders by status if selected
  const filteredOrders = selectedStatus === "all" 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  return (
    <div className="min-h-screen d-flex">
      <AdminSidebar />
      
      <div className="main-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold">
              All Orders
              {selectedShopId !== "all" && shops.length > 0 && (
                <span className="text-muted fs-6 ms-2">
                  - {shops.find(s => s.id.toString() === selectedShopId)?.name}
                </span>
              )}
            </h2>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center">
              <label htmlFor="shopSelect" className="form-label me-2 mb-0">Shop:</label>
              <select 
                id="shopSelect"
                className="form-select form-select-sm"
                value={selectedShopId}
                onChange={(e) => setSelectedShopId(e.target.value)}
                style={{ minWidth: "180px" }}
              >
                <option value="all">All Shops</option>
                {shops.map((shop) => (
                  <option key={shop.id} value={shop.id}>
                    {shop.name} ({shop.type})
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex align-items-center">
              <label htmlFor="statusSelect" className="form-label me-2 mb-0">Status:</label>
              <select 
                id="statusSelect"
                className="form-select form-select-sm"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold mb-0">Order Management</h5>
                {(selectedShopId !== "all" || selectedStatus !== "all") && (
                  <small className="text-muted">
                    {selectedShopId !== "all" && `Shop: ${shops.find(s => s.id.toString() === selectedShopId)?.name}`}
                    {selectedShopId !== "all" && selectedStatus !== "all" && " | "}
                    {selectedStatus !== "all" && `Status: ${selectedStatus}`}
                  </small>
                )}
              </div>
              <div className="text-muted">
                {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
              </div>
            </div>
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
                    {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                      <tr key={order.id}>
                        <td><strong>#{order.id}</strong></td>
                        <td>{order.customerName}</td>
                        <td>
                          <span className="badge bg-secondary">{order.shopName}</span>
                        </td>
                        <td>{order.itemCount || 1}</td>
                        <td><strong>₹{order.total}</strong></td>
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
                          {selectedShopId !== "all" || selectedStatus !== "all" ? "No orders match the selected filters" : "No orders found"}
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