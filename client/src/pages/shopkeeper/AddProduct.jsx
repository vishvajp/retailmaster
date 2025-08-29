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
    // Basic Product Info
    name: "",
    sku: "",
    categoryId: "",
    brand: "",
    description: "",
    
    // Stock & Unit
    stock: "",
    unit: "Piece",
    reorderLevel: "5",
    
    // Pricing
    purchasePrice: "",
    sellingPrice: "",
    tax: "0",
    discount: "0",
    flatDiscount: "0",
    
    // Optional Fields
    imageUrl: "",
    barcode: "",
    qrCode: "",
    expiryDate: "",
    manufacturingDate: "",
    supplierName: "",
    supplierContact: "",
    
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

  const createProductMutation = useMutation({
    mutationFn: async (productData) => {
      return apiRequest("POST", "/api/products", {
        ...productData,
        purchasePrice: productData.purchasePrice ? parseFloat(productData.purchasePrice).toString() : null,
        sellingPrice: parseFloat(productData.sellingPrice).toString(),
        price: parseFloat(productData.sellingPrice).toString(), // Legacy compatibility
        tax: parseFloat(productData.tax || 0).toString(),
        discount: parseFloat(productData.discount || 0).toString(),
        flatDiscount: parseFloat(productData.flatDiscount || 0).toString(),
        stock: parseInt(productData.stock),
        reorderLevel: parseInt(productData.reorderLevel),
        minStock: parseInt(productData.reorderLevel), // Legacy compatibility
        categoryId: parseInt(productData.categoryId) || null,
        shopId: parseInt(productData.shopId),
        expiryDate: productData.expiryDate || null,
        manufacturingDate: productData.manufacturingDate || null,
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
    if (!formData.sellingPrice) {
      toast({
        title: "Error",
        description: "Selling price is required",
        variant: "destructive",
      });
      return;
    }
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
            <p className="text-muted mb-0">Create a comprehensive product listing with all details</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setLocation("/shopkeeper/products")}
            data-testid="button-back-to-products"
          >
            <i className="fas fa-arrow-left me-2"></i>Back to Products
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row">
            {/* Basic Product Info Section */}
            <div className="col-lg-6 mb-4">
              <Card>
                <CardHeader className="bg-primary text-white">
                  <h5 className="fw-bold mb-0">
                    <i className="fas fa-info-circle me-2"></i>
                    🔹 Basic Product Info
                  </h5>
                </CardHeader>
                <CardContent className="pt-3">
                  <div className="mb-3">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="e.g., Aachi Chicken Masala 100g"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      data-testid="input-product-name"
                    />
                  </div>

                  <div className="mb-3">
                    <Label htmlFor="sku">SKU (Stock Keeping Unit) *</Label>
                    <Input
                      id="sku"
                      type="text"
                      placeholder="Unique code to identify the product"
                      value={formData.sku}
                      onChange={(e) => handleInputChange('sku', e.target.value)}
                      required
                      data-testid="input-sku"
                    />
                  </div>

                  <div className="mb-3">
                    <Label htmlFor="categoryId">Category *</Label>
                    <div className="d-flex gap-2">
                      <select
                        id="categoryId"
                        className="form-select"
                        value={formData.categoryId}
                        onChange={(e) => handleInputChange('categoryId', e.target.value)}
                        required
                        data-testid="select-category"
                      >
                        <option value="">Select a category (e.g., Spices, Groceries, Beverages)</option>
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
                  </div>

                  <div className="mb-3">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      type="text"
                      placeholder="e.g., Aachi, Nescafe (optional)"
                      value={formData.brand}
                      onChange={(e) => handleInputChange('brand', e.target.value)}
                      data-testid="input-brand"
                    />
                  </div>

                  <div className="mb-3">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Short details about the product (optional)"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                      data-testid="input-description"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stock & Unit Section */}
            <div className="col-lg-6 mb-4">
              <Card>
                <CardHeader className="bg-success text-white">
                  <h5 className="fw-bold mb-0">
                    <i className="fas fa-boxes me-2"></i>
                    🔹 Stock & Unit
                  </h5>
                </CardHeader>
                <CardContent className="pt-3">
                  <div className="mb-3">
                    <Label htmlFor="stock">Stock Quantity *</Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="How much is available (e.g., 10)"
                      value={formData.stock}
                      onChange={(e) => handleInputChange('stock', e.target.value)}
                      required
                      data-testid="input-stock"
                    />
                  </div>

                  <div className="mb-3">
                    <Label htmlFor="unit">Unit *</Label>
                    <select 
                      id="unit"
                      className="form-select"
                      value={formData.unit}
                      onChange={(e) => handleInputChange('unit', e.target.value)}
                      data-testid="select-unit"
                    >
                      {unitOptions.map((unit) => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <Label htmlFor="reorderLevel">Reorder Level (Minimum Stock Alert) *</Label>
                    <Input
                      id="reorderLevel"
                      type="number"
                      placeholder="System alerts when stock falls below this"
                      value={formData.reorderLevel}
                      onChange={(e) => handleInputChange('reorderLevel', e.target.value)}
                      required
                      data-testid="input-reorder-level"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pricing Section */}
            <div className="col-lg-6 mb-4">
              <Card>
                <CardHeader className="bg-warning text-dark">
                  <h5 className="fw-bold mb-0">
                    <i className="fas fa-rupee-sign me-2"></i>
                    🔹 Pricing
                  </h5>
                </CardHeader>
                <CardContent className="pt-3">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <Label htmlFor="purchasePrice">Purchase Price (Cost Price)</Label>
                      <Input
                        id="purchasePrice"
                        type="number"
                        step="0.01"
                        placeholder="What you bought it for"
                        value={formData.purchasePrice}
                        onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                        data-testid="input-purchase-price"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <Label htmlFor="sellingPrice">Selling Price (MRP) *</Label>
                      <Input
                        id="sellingPrice"
                        type="number"
                        step="0.01"
                        placeholder="What you sell it for"
                        value={formData.sellingPrice}
                        onChange={(e) => handleInputChange('sellingPrice', e.target.value)}
                        required
                        data-testid="input-selling-price"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <Label htmlFor="tax">Tax (GST/VAT %)</Label>
                      <Input
                        id="tax"
                        type="number"
                        step="0.01"
                        placeholder="0"
                        value={formData.tax}
                        onChange={(e) => handleInputChange('tax', e.target.value)}
                        data-testid="input-tax"
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <Label htmlFor="discount">Discount (%)</Label>
                      <Input
                        id="discount"
                        type="number"
                        step="0.01"
                        placeholder="0"
                        value={formData.discount}
                        onChange={(e) => handleInputChange('discount', e.target.value)}
                        data-testid="input-discount"
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <Label htmlFor="flatDiscount">Flat Discount (₹)</Label>
                      <Input
                        id="flatDiscount"
                        type="number"
                        step="0.01"
                        placeholder="0"
                        value={formData.flatDiscount}
                        onChange={(e) => handleInputChange('flatDiscount', e.target.value)}
                        data-testid="input-flat-discount"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Optional but Useful Section */}
            <div className="col-lg-6 mb-4">
              <Card>
                <CardHeader className="bg-info text-white">
                  <h5 className="fw-bold mb-0">
                    <i className="fas fa-star me-2"></i>
                    🔹 Optional
                  </h5>
                </CardHeader>
                <CardContent className="pt-3">
                  <div className="mb-3">
                    <Label htmlFor="imageUrl">Product Image URL</Label>
                    <Input
                      id="imageUrl"
                      type="url"
                      placeholder="For easy identification in POS screen"
                      value={formData.imageUrl}
                      onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                      data-testid="input-image-url"
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <Label htmlFor="barcode">Barcode</Label>
                      <Input
                        id="barcode"
                        type="text"
                        placeholder="For barcode scanning support"
                        value={formData.barcode}
                        onChange={(e) => handleInputChange('barcode', e.target.value)}
                        data-testid="input-barcode"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <Label htmlFor="qrCode">QR Code</Label>
                      <Input
                        id="qrCode"
                        type="text"
                        placeholder="QR code for quick access"
                        value={formData.qrCode}
                        onChange={(e) => handleInputChange('qrCode', e.target.value)}
                        data-testid="input-qr-code"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        type="date"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        data-testid="input-expiry-date"
                      />
                      <small className="text-muted">Important for food/medicines</small>
                    </div>
                    <div className="col-md-6 mb-3">
                      <Label htmlFor="manufacturingDate">Manufacturing Date</Label>
                      <Input
                        id="manufacturingDate"
                        type="date"
                        value={formData.manufacturingDate}
                        onChange={(e) => handleInputChange('manufacturingDate', e.target.value)}
                        data-testid="input-manufacturing-date"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <Label htmlFor="supplierName">Supplier/Vendor Name</Label>
                      <Input
                        id="supplierName"
                        type="text"
                        placeholder="Who you buy from"
                        value={formData.supplierName}
                        onChange={(e) => handleInputChange('supplierName', e.target.value)}
                        data-testid="input-supplier-name"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <Label htmlFor="supplierContact">Supplier Contact</Label>
                      <Input
                        id="supplierContact"
                        type="text"
                        placeholder="Phone/Email of supplier"
                        value={formData.supplierContact}
                        onChange={(e) => handleInputChange('supplierContact', e.target.value)}
                        data-testid="input-supplier-contact"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Submit Section */}
          <div className="row">
            <div className="col-12">
              <Card>
                <CardContent className="text-center">
                  <div className="d-flex gap-3 justify-content-center">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={createProductMutation.isPending}
                      className="btn-primary"
                      data-testid="button-save-product"
                    >
                      {createProductMutation.isPending ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Adding Product...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>Add Product to Inventory
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => setLocation("/shopkeeper/products")}
                      data-testid="button-cancel"
                    >
                      <i className="fas fa-times me-2"></i>Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}