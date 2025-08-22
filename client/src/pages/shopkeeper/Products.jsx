import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import ShopkeeperSidebar from "@/components/Layout/ShopkeeperSidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Products() {
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id) => apiRequest("DELETE", `/api/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Success", description: "Product deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete product", variant: "destructive" });
    },
  });

  const handleDelete = (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      deleteProductMutation.mutate(product.id);
    }
  };

  return (
    <div className="min-h-screen d-flex">
      <ShopkeeperSidebar />
      
      <div className="main-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold">My Products</h2>
            <p className="text-muted mb-0">Manage your shop inventory</p>
          </div>
          <Link href="/shopkeeper/add-product" className="btn btn-primary">
            <i className="fas fa-plus me-2"></i>Add Product
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">Product Inventory ({products.length})</h5>
              <div>
                <select className="form-select form-select-sm">
                  <option>All Categories</option>
                  <option>Dairy</option>
                  <option>Beverages</option>
                  <option>Snacks</option>
                </select>
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
            ) : products.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => {
                      const isOutOfStock = product.stock === 0;
                      const isLowStock = product.stock <= (product.minStock || 5) && product.stock > 0;
                      
                      return (
                        <tr key={product.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              {product.imageUrl ? (
                                <img 
                                  src={product.imageUrl} 
                                  alt={product.name}
                                  className="me-3 rounded" 
                                  style={{ width: "48px", height: "48px", objectFit: "cover" }}
                                />
                              ) : (
                                <div 
                                  className="me-3 rounded bg-light d-flex align-items-center justify-content-center"
                                  style={{ width: "48px", height: "48px" }}
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
                          <td>
                            <code className="small">{product.sku}</code>
                          </td>
                          <td>
                            <span className="fw-bold">₹{product.price}</span>
                            <small className="text-muted">/{product.unit}</small>
                          </td>
                          <td>
                            <span className={`fw-bold ${
                              isOutOfStock ? 'text-danger' :
                              isLowStock ? 'text-warning' :
                              'text-success'
                            }`}>
                              {product.stock}
                            </span>
                            <small className="text-muted"> {product.unit}</small>
                          </td>
                          <td>
                            <span className={`badge ${
                              isOutOfStock ? 'bg-danger' :
                              isLowStock ? 'bg-warning' :
                              product.isActive ? 'bg-success' : 'bg-secondary'
                            }`}>
                              {isOutOfStock ? 'Out of Stock' :
                               isLowStock ? 'Low Stock' :
                               product.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button size="sm" variant="outline" className="btn-action">
                                <i className="fas fa-edit"></i>
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-danger"
                                onClick={() => handleDelete(product)}
                              >
                                <i className="fas fa-trash"></i>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-muted py-5">
                <i className="fas fa-box fs-1 mb-3"></i>
                <p className="mb-3">No products found in your inventory</p>
                <Link href="/shopkeeper/add-product" className="btn btn-primary">
                  <i className="fas fa-plus me-2"></i>Add Your First Product
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}