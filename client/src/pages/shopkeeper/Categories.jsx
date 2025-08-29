import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import ShopkeeperSidebar from "@/components/Layout/ShopkeeperSidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function Categories() {
  const { toast } = useToast();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: shops = [] } = useQuery({
    queryKey: ["/api/shops"],
  });

  const shopInfo = shops.length > 0 ? shops[0] : null;

  // Filter categories by shop type
  const shopCategories = categories.filter(category => 
    category.shopType === shopInfo?.type
  );

  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId) => {
      return apiRequest("DELETE", `/api/categories/${categoryId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({
        title: "Success",
        description: "Category deleted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    },
  });

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteCategoryMutation.mutate(categoryId);
    }
  };

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
            <h2 className="fw-bold">Category Management</h2>
            <p className="text-muted mb-0">Manage product categories for your {shopInfo?.type || 'shop'}</p>
          </div>
          <Link href="/shopkeeper/add-category">
            <Button data-testid="button-add-category">
              <i className="fas fa-plus me-2"></i>Add New Category
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <h5 className="fw-bold mb-0">
              <i className="fas fa-tags me-2"></i>
              Your Categories ({shopCategories.length})
            </h5>
          </CardHeader>
          <CardContent>
            {shopCategories.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Category Name</th>
                      <th>Description</th>
                      <th>Shop Type</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shopCategories.map((category) => (
                      <tr key={category.id} data-testid={`row-category-${category.id}`}>
                        <td>
                          <div className="d-flex align-items-center">
                            <i className="fas fa-tag text-primary me-2"></i>
                            <strong>{category.name}</strong>
                          </div>
                        </td>
                        <td>
                          <span className="text-muted">
                            {category.description || "No description"}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-info text-capitalize">
                            {category.shopType}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${category.isActive ? 'bg-success' : 'bg-secondary'}`}>
                            {category.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              data-testid={`button-edit-${category.id}`}
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-danger border-danger"
                              onClick={() => handleDeleteCategory(category.id)}
                              data-testid={`button-delete-${category.id}`}
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-muted py-5">
                <i className="fas fa-tags fs-1 mb-3"></i>
                <h5>No Categories Found</h5>
                <p className="mb-3">You haven't created any categories for your {shopInfo?.type || 'shop'} yet.</p>
                <Link href="/shopkeeper/add-category">
                  <Button data-testid="button-create-first-category">
                    <i className="fas fa-plus me-2"></i>Create Your First Category
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}