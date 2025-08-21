import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminSidebar from "@/components/Layout/AdminSidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StockManagement() {
  const [selectedShopId, setSelectedShopId] = useState("all");

  // Fetch all shops for the dropdown
  const { data: shops = [] } = useQuery({
    queryKey: ["/api/shops"],
  });

  // Build query URLs based on selected shop
  const lowStockUrl = selectedShopId === "all" 
    ? "/api/stock/low" 
    : `/api/stock/low?shopId=${selectedShopId}`;
    
  const outOfStockUrl = selectedShopId === "all"
    ? "/api/stock/out"
    : `/api/stock/out?shopId=${selectedShopId}`;
    
  const productsUrl = selectedShopId === "all"
    ? "/api/products"
    : `/api/products/shop/${selectedShopId}`;

  const { data: lowStockProducts = [], isLoading: lowStockLoading } = useQuery({
    queryKey: [lowStockUrl],
  });

  const { data: outOfStockProducts = [], isLoading: outOfStockLoading } = useQuery({
    queryKey: [outOfStockUrl],
  });

  const { data: allProducts = [], isLoading: allProductsLoading } = useQuery({
    queryKey: [productsUrl],
  });

  const healthyStockCount = allProducts.filter(p => p.stock > p.minStock).length;

  return (
    <div className="min-h-screen d-flex">
      <AdminSidebar />
      
      <div className="main-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold">
              Stock Management
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
            <div>
              <Button variant="outline" className="me-2 btn-warning">
                <i className="fas fa-exclamation-triangle me-2"></i>
                Low Stock Alert ({lowStockProducts.length})
              </Button>
              <Button variant="outline" className="btn-danger">
                <i className="fas fa-times-circle me-2"></i>
                Out of Stock ({outOfStockProducts.length})
              </Button>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-4">
            <Card className="border-warning stock-low">
              <CardContent className="p-4">
                <h6 className="fw-bold text-warning">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  Low Stock Items
                </h6>
                <h3 className="text-warning">{lowStockProducts.length}</h3>
                <p className="mb-0 text-muted">Items below minimum threshold</p>
              </CardContent>
            </Card>
          </div>
          <div className="col-md-4">
            <Card className="border-danger stock-out">
              <CardContent className="p-4">
                <h6 className="fw-bold text-danger">
                  <i className="fas fa-times-circle me-2"></i>
                  Out of Stock
                </h6>
                <h3 className="text-danger">{outOfStockProducts.length}</h3>
                <p className="mb-0 text-muted">Items completely out of stock</p>
              </CardContent>
            </Card>
          </div>
          <div className="col-md-4">
            <Card className="border-success">
              <CardContent className="p-4">
                <h6 className="fw-bold text-success">
                  <i className="fas fa-check-circle me-2"></i>
                  Healthy Stock
                </h6>
                <h3 className="text-success">{healthyStockCount}</h3>
                <p className="mb-0 text-muted">Items with adequate stock</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="row align-items-center">
              <div className="col">
                <h5 className="fw-bold mb-0">Stock Levels</h5>
                {selectedShopId !== "all" && (
                  <small className="text-muted">
                    Showing products for {shops.find(s => s.id.toString() === selectedShopId)?.name}
                  </small>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {allProductsLoading ? (
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
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Current Stock</th>
                      <th>Min. Required</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allProducts.map((product) => {
                      const isOutOfStock = product.stock === 0;
                      const isLowStock = product.stock <= product.minStock && product.stock > 0;
                      
                      return (
                        <tr 
                          key={product.id} 
                          className={
                            isOutOfStock ? "stock-out" : 
                            isLowStock ? "stock-low" : ""
                          }
                        >
                          <td>
                            <div className="d-flex align-items-center">
                              {product.imageUrl ? (
                                <img 
                                  src={product.imageUrl} 
                                  alt={product.name}
                                  className="me-2 rounded" 
                                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                />
                              ) : (
                                <div 
                                  className="me-2 rounded bg-light d-flex align-items-center justify-content-center"
                                  style={{ width: "40px", height: "40px" }}
                                >
                                  <i className="fas fa-box text-muted"></i>
                                </div>
                              )}
                              <div>
                                <strong>{product.name}</strong>
                                <br />
                                <small className="text-muted">{product.brand}</small>
                              </div>
                            </div>
                          </td>
                          <td><small className="text-muted">{product.sku}</small></td>
                          <td>
                            <span className={
                              isOutOfStock ? "text-danger fw-bold" :
                              isLowStock ? "text-warning fw-bold" :
                              "text-success fw-bold"
                            }>
                              {product.stock}
                            </span>
                          </td>
                          <td>{product.minStock}</td>
                          <td>
                            <span className={`badge ${
                              isOutOfStock ? "bg-danger" :
                              isLowStock ? "bg-warning" :
                              "bg-success"
                            }`}>
                              {isOutOfStock ? "Out of Stock" :
                               isLowStock ? "Low Stock" :
                               "In Stock"}
                            </span>
                          </td>
                          <td>
                            {(isOutOfStock || isLowStock) ? (
                              <Button size="sm" variant="outline" className="btn-action">
                                <i className="fas fa-plus me-1"></i>Restock
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" className="btn-action">
                                <i className="fas fa-edit me-1"></i>Edit
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {allProducts.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center text-muted py-4">
                          No products found
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