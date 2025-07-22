import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import ShopkeeperSidebar from "@/components/Layout/ShopkeeperSidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AddProduct() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
    stock: "",
    minStock: "5",
    unit: "pieces",
    brand: "",
    categoryId: "",
    shopId: 1, // This should be dynamically set based on the shopkeeper's shop
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const createProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      return apiRequest("POST", "/api/products", {
        ...productData,
        price: parseFloat(productData.price).toString(),
        stock: parseInt(productData.stock),
        minStock: parseInt(productData.minStock),
        categoryId: parseInt(productData.categoryId) || null,
        shopId: parseInt(productData.shopId),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success",
        description: "Product added successfully!",
      });
      setLocation("/shopkeeper/products");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProductMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen d-flex">
      <ShopkeeperSidebar />
      
      <div className="main-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Add New Product</h2>
          <Button variant="outline" onClick={() => setLocation("/shopkeeper/products")}>
            <i className="fas fa-arrow-left me-2"></i>Back to Products
          </Button>
        </div>

        <div className="row">
          <div className="col-md-8">
            <Card>
              <CardHeader>
                <h5 className="fw-bold mb-0">Product Information</h5>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <Label htmlFor="productName">Product Name</Label>
                      <Input
                        id="productName"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <Label htmlFor="productSKU">SKU</Label>
                      <Input
                        id="productSKU"
                        value={formData.sku}
                        onChange={(e) => handleInputChange("sku", e.target.value)}
                        placeholder="e.g., MILK001"
                      />
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <Label htmlFor="productCategory">Category</Label>
                      <select
                        className="form-select"
                        id="productCategory"
                        value={formData.categoryId}
                        onChange={(e) => handleInputChange("categoryId", e.target.value)}
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map((category: any) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <Label htmlFor="productBrand">Brand</Label>
                      <Input
                        id="productBrand"
                        value={formData.brand}
                        onChange={(e) => handleInputChange("brand", e.target.value)}
                        placeholder="Product brand"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <Label htmlFor="productDescription">Description</Label>
                    <Textarea
                      id="productDescription"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Enter product description"
                      rows={3}
                    />
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <Label htmlFor="productPrice">Price ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        id="productPrice"
                        value={formData.price}
                        onChange={(e) => handleInputChange("price", e.target.value)}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <Label htmlFor="productStock">Initial Stock</Label>
                      <Input
                        type="number"
                        min="0"
                        id="productStock"
                        value={formData.stock}
                        onChange={(e) => handleInputChange("stock", e.target.value)}
                        placeholder="0"
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <Label htmlFor="productMinStock">Minimum Stock Alert</Label>
                      <Input
                        type="number"
                        min="0"
                        id="productMinStock"
                        value={formData.minStock}
                        onChange={(e) => handleInputChange("minStock", e.target.value)}
                        placeholder="5"
                      />
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <Label htmlFor="productUnit">Unit</Label>
                      <select
                        className="form-select"
                        id="productUnit"
                        value={formData.unit}
                        onChange={(e) => handleInputChange("unit", e.target.value)}
                      >
                        <option value="pieces">Pieces</option>
                        <option value="kg">Kilograms</option>
                        <option value="liters">Liters</option>
                        <option value="grams">Grams</option>
                        <option value="ml">Milliliters</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="d-flex gap-2">
                    <Button type="submit" disabled={createProductMutation.isPending}>
                      {createProductMutation.isPending ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>Save Product
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setLocation("/shopkeeper/products")}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div className="col-md-4">
            <Card>
              <CardHeader>
                <h5 className="fw-bold mb-0">Product Image</h5>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-3">
                  <div className="border rounded-3 p-4" style={{ minHeight: "200px", backgroundColor: "#f8f9fa" }}>
                    <i className="fas fa-image fa-3x text-muted mb-3"></i>
                    <p className="text-muted">Click to upload product image</p>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => {
                        // TODO: Implement image upload
                        console.log("Image upload:", e.target.files);
                      }}
                    />
                  </div>
                </div>
                <small className="text-muted">
                  Supported formats: JPG, PNG, WebP<br />
                  Max size: 5MB
                </small>
              </CardContent>
            </Card>
            
            <Card className="mt-3">
              <CardHeader>
                <h6 className="fw-bold mb-0">Quick Tips</h6>
              </CardHeader>
              <CardContent>
                <ul className="list-unstyled mb-0">
                  <li className="mb-2">
                    <i className="fas fa-lightbulb text-warning me-2"></i>
                    <small>Use clear, high-quality product images</small>
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-lightbulb text-warning me-2"></i>
                    <small>Set minimum stock alerts to avoid running out</small>
                  </li>
                  <li className="mb-0">
                    <i className="fas fa-lightbulb text-warning me-2"></i>
                    <small>Include detailed product descriptions</small>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
