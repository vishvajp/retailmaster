import { useQuery } from "@tanstack/react-query";
import ShopkeeperSidebar from "@/components/Layout/ShopkeeperSidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StockAlerts() {
  const { data: lowStockProducts = [], isLoading: lowStockLoading } = useQuery({
    queryKey: ["/api/stock/low"],
  });

  const { data: outOfStockProducts = [], isLoading: outOfStockLoading } = useQuery({
    queryKey: ["/api/stock/out"],
  });

  const isLoading = lowStockLoading || outOfStockLoading;

  return (
    <div className="min-h-screen d-flex">
      <ShopkeeperSidebar />
      
      <div className="main-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold">Stock Alerts</h2>
            <p className="text-muted mb-0">Monitor your inventory levels</p>
          </div>
          <div className="d-flex gap-2">
            <span className="badge bg-danger fs-6">
              Out of Stock: {outOfStockProducts.length}
            </span>
            <span className="badge bg-warning fs-6">
              Low Stock: {lowStockProducts.length}
            </span>
          </div>
        </div>

        {/* Out of Stock Items */}
        <Card className="mb-4">
          <CardHeader className="border-danger">
            <h5 className="fw-bold mb-0 text-danger">
              <i className="fas fa-times-circle me-2"></i>
              Out of Stock Items ({outOfStockProducts.length})
            </h5>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : outOfStockProducts.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Last Stock</th>
                      <th>Min Required</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outOfStockProducts.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            {product.imageUrl ? (
                              <img 
                                src={product.imageUrl} 
                                alt={product.name}
                                className="me-3 rounded" 
                                style={{ width: "40px", height: "40px", objectFit: "cover" }}
                              />
                            ) : (
                              <div 
                                className="me-3 rounded bg-light d-flex align-items-center justify-content-center"
                                style={{ width: "40px", height: "40px" }}
                              >
                                <i className="fas fa-box text-muted"></i>
                              </div>
                            )}
                            <div>
                              <div className="fw-semibold">{product.name}</div>
                              {product.brand && (
                                <small className="text-muted">{product.brand}</small>
                              )}
                            </div>
                          </div>
                        </td>
                        <td><code className="small">{product.sku}</code></td>
                        <td>
                          <span className="text-danger fw-bold">0</span>
                          <small className="text-muted"> {product.unit}</small>
                        </td>
                        <td>{product.minStock || 5} {product.unit}</td>
                        <td>
                          <Button size="sm" className="btn-danger">
                            <i className="fas fa-plus me-1"></i>Restock Urgently
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-muted py-4">
                <i className="fas fa-check-circle text-success fs-1 mb-3"></i>
                <p>No items are out of stock!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Items */}
        <Card>
          <CardHeader className="border-warning">
            <h5 className="fw-bold mb-0 text-warning">
              <i className="fas fa-exclamation-triangle me-2"></i>
              Low Stock Items ({lowStockProducts.length})
            </h5>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Current Stock</th>
                      <th>Min Required</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockProducts.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            {product.imageUrl ? (
                              <img 
                                src={product.imageUrl} 
                                alt={product.name}
                                className="me-3 rounded" 
                                style={{ width: "40px", height: "40px", objectFit: "cover" }}
                              />
                            ) : (
                              <div 
                                className="me-3 rounded bg-light d-flex align-items-center justify-content-center"
                                style={{ width: "40px", height: "40px" }}
                              >
                                <i className="fas fa-box text-muted"></i>
                              </div>
                            )}
                            <div>
                              <div className="fw-semibold">{product.name}</div>
                              {product.brand && (
                                <small className="text-muted">{product.brand}</small>
                              )}
                            </div>
                          </div>
                        </td>
                        <td><code className="small">{product.sku}</code></td>
                        <td>
                          <span className="text-warning fw-bold">{product.stock}</span>
                          <small className="text-muted"> {product.unit}</small>
                        </td>
                        <td>{product.minStock || 5} {product.unit}</td>
                        <td>
                          <span className="badge bg-warning">Low Stock</span>
                        </td>
                        <td>
                          <Button size="sm" className="btn-warning">
                            <i className="fas fa-plus me-1"></i>Restock
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-muted py-4">
                <i className="fas fa-check-circle text-success fs-1 mb-3"></i>
                <p>All items have healthy stock levels!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}