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
    unit: "Piece",
    quantity: "",
    brand: "",
    categoryId: "",
    shopId: 1, // This should be dynamically set based on the shopkeeper's shop
  });

  const { data: categories = [], refetch: refetchCategories } = useQuery({
    queryKey: ["/api/categories"],
    staleTime: 0, // Always fetch fresh data
    cacheTime: 0, // Don't cache the data
  });

  const { data: shops = [] } = useQuery({
    queryKey: ["/api/shops"],
  });
  
  const shopInfo = shops.length > 0 ? shops[0] : null;
  
  // Filter categories by shop type
  const filteredCategories = categories.filter(category => 
    category.shopType === shopInfo?.type
  );

  // Define unit options
  const unitOptions = ["Gram", "Kg", "Packet", "Box", "Litre", "ml", "Piece"];

  // Define quantity options based on unit
  const getQuantityOptions = (unit) => {
    switch (unit) {
      case "Gram":
        return ["50g", "100g", "200g", "250g", "500g", "750g"];
      case "Kg":
        return ["0.5kg", "1kg", "1.5kg", "2kg", "5kg", "10kg"];
      case "Packet":
        return ["1 packet", "2 packets", "5 packets", "10 packets"];
      case "Box":
        return ["1 box", "2 boxes", "5 boxes", "10 boxes"];
      case "Litre":
        return ["0.5L", "1L", "1.5L", "2L", "5L"];
      case "ml":
        return ["100ml", "200ml", "250ml", "500ml", "750ml", "1000ml"];
      case "Piece":
        return ["1 piece", "2 pieces", "5 pieces", "10 pieces", "12 pieces", "24 pieces"];
      default:
        return [];
    }
  };

  const createProductMutation = useMutation({
    mutationFn: async (productData) => {
      return apiRequest("POST", "/api/products", {
        ...productData,
        price: parseFloat(productData.price).toString(),
        stock: parseInt(productData.stock),
        minStock: parseInt(productData.minStock),
        categoryId: parseInt(productData.categoryId) || null,
        shopId: parseInt(productData.shopId),
        quantity: productData.quantity,
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
                      <Label htmlFor="price">Price * (₹)</Label>
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
                    <div className="col-md-4 mb-3">
                      <Label htmlFor="unit">Unit *</Label>
                      <select 
                        id="unit"
                        className="form-select"
                        value={formData.unit}
                        onChange={(e) => {
                          handleInputChange('unit', e.target.value);
                          handleInputChange('quantity', ''); // Reset quantity when unit changes
                        }}
                        data-testid="select-unit"
                      >
                        {unitOptions.map((unit) => (
                          <option key={unit} value={unit}>{unit}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <Label htmlFor="quantity">Quantity *</Label>
                      <select 
                        id="quantity"
                        className="form-select"
                        value={formData.quantity}
                        onChange={(e) => handleInputChange('quantity', e.target.value)}
                        data-testid="select-quantity"
                        required
                      >
                        <option value="">Select quantity</option>
                        {getQuantityOptions(formData.unit).map((qty) => (
                          <option key={qty} value={qty}>{qty}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <Label htmlFor="brand">Brand</Label>
                      <Input
                        id="brand"
                        type="text"
                        placeholder="Brand name"
                        value={formData.brand}
                        onChange={(e) => handleInputChange('brand', e.target.value)}
                        data-testid="input-brand"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <Label htmlFor="categoryId">Category</Label>
                    <div className="d-flex gap-2">
                      <select
                        id="categoryId"
                        className="form-select"
                        value={formData.categoryId}
                        onChange={(e) => handleInputChange('categoryId', e.target.value)}
                        data-testid="select-category"
                      >
                        <option value="">Select a category</option>
                        {filteredCategories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          refetchCategories();
                          toast({
                            title: "Categories refreshed",
                            description: "Category list has been updated",
                          });
                        }}
                        data-testid="button-refresh-categories"
                      >
                        <i className="fas fa-refresh"></i>
                      </Button>
                    </div>
                    <small className="text-muted">Showing categories for {shopInfo?.type || 'your'} shop type</small>
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