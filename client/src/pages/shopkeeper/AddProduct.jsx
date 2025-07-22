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
    mutationFn: async (productData) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    createProductMutation.mutate(formData);
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
            <h2 className="fw-bold">Add New Product</h2>
            <p className="text-muted mb-0">Add a new product to your shop inventory</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setLocation("/shopkeeper/products")}
          >
            <i className="fas fa-arrow-left me-2"></i>Back to Products
          </Button>
        </div>

        <div className="row">
          <div className="col-lg-8 mx-auto">
            <Card>
              <CardHeader>
                <h5 className="fw-bold mb-0">Product Information</h5>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter product name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <Label htmlFor="sku">SKU *</Label>
                      <Input
                        id="sku"
                        type="text"
                        placeholder="Product SKU"
                        value={formData.sku}
                        onChange={(e) => handleInputChange('sku', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Product description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <Label htmlFor="price">Price * ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <Label htmlFor="stock">Stock Quantity *</Label>
                      <Input
                        id="stock"
                        type="number"
                        placeholder="0"
                        value={formData.stock}
                        onChange={(e) => handleInputChange('stock', e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <Label htmlFor="minStock">Minimum Stock</Label>
                      <Input
                        id="minStock"
                        type="number"
                        placeholder="5"
                        value={formData.minStock}
                        onChange={(e) => handleInputChange('minStock', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <Label htmlFor="unit">Unit</Label>
                      <select 
                        id="unit"
                        className="form-select"
                        value={formData.unit}
                        onChange={(e) => handleInputChange('unit', e.target.value)}
                      >
                        <option value="pieces">Pieces</option>
                        <option value="kg">Kilograms</option>
                        <option value="liter">Liters</option>
                        <option value="pack">Packs</option>
                        <option value="dozen">Dozen</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <Label htmlFor="brand">Brand</Label>
                      <Input
                        id="brand"
                        type="text"
                        placeholder="Brand name"
                        value={formData.brand}
                        onChange={(e) => handleInputChange('brand', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <Label htmlFor="categoryId">Category</Label>
                    <select
                      id="categoryId"
                      className="form-select"
                      value={formData.categoryId}
                      onChange={(e) => handleInputChange('categoryId', e.target.value)}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="d-flex gap-2">
                    <Button
                      type="submit"
                      disabled={createProductMutation.isPending}
                      className="btn-primary"
                    >
                      {createProductMutation.isPending ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Adding...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-plus me-2"></i>Add Product
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
        </div>
      </div>
    </div>
  );
}