import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import ShopkeeperSidebar from "@/components/Layout/ShopkeeperSidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function AddCategory() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shopType: "grocery"
  });

  // Get shop info to determine shop type
  const { data: shops = [] } = useQuery({
    queryKey: ["/api/shops"],
  });
  
  const shopInfo = shops.length > 0 ? shops[0] : null;

  const createCategoryMutation = useMutation({
    mutationFn: async (categoryData) => {
      return apiRequest("POST", "/api/categories", categoryData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({
        title: "Success",
        description: "Category added successfully!",
      });
      setLocation("/shopkeeper/categories");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    createCategoryMutation.mutate({
      ...formData,
      shopType: shopInfo?.type || "grocery"
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen d-flex">
      <ShopkeeperSidebar />
      
      <div className="main-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold">Add New Category</h2>
            <p className="text-muted mb-0">Create a new product category for your shop</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setLocation("/shopkeeper/categories")}
          >
            <i className="fas fa-arrow-left me-2"></i>Back to Categories
          </Button>
        </div>

        <div className="row">
          <div className="col-lg-6 mx-auto">
            <Card>
              <CardHeader>
                <h5 className="fw-bold mb-0">Category Information</h5>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <Label htmlFor="name">Category Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter category name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      data-testid="input-category-name"
                    />
                  </div>

                  <div className="mb-3">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      className="form-control"
                      rows="3"
                      placeholder="Enter category description (optional)"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      data-testid="input-category-description"
                    />
                  </div>

                  <div className="mb-3">
                    <Label htmlFor="shopType">Shop Type</Label>
                    <Input
                      id="shopType"
                      type="text"
                      value={shopInfo?.type || "grocery"}
                      disabled
                      className="bg-light"
                      data-testid="input-shop-type"
                    />
                    <small className="text-muted">Category will be created for your {shopInfo?.type || "grocery"} shop type</small>
                  </div>

                  <div className="d-flex gap-2">
                    <Button 
                      type="submit" 
                      disabled={createCategoryMutation.isPending}
                      data-testid="button-save-category"
                    >
                      {createCategoryMutation.isPending ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Adding...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>Add Category
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setLocation("/shopkeeper/categories")}
                      data-testid="button-cancel"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}