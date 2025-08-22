import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ShopkeeperSidebar from "@/components/Layout/ShopkeeperSidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Billing() {
  const { toast } = useToast();
  const [cart, setCart] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: ""
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    toast({
      title: "Product Added",
      description: `${product.name} added to cart`,
    });
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, quantity: quantity }
        : item
    ));
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before checkout",
        variant: "destructive"
      });
      return;
    }

    if (!customerInfo.name || !customerInfo.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in customer name and phone",
        variant: "destructive"
      });
      return;
    }

    // Create invoice/order
    const invoice = {
      customer: customerInfo,
      items: cart,
      total: getTotalAmount(),
      date: new Date().toISOString(),
      invoiceNumber: `INV-${Date.now()}`
    };

    console.log("Invoice created:", invoice);
    toast({
      title: "Invoice Generated",
      description: `Invoice ${invoice.invoiceNumber} created successfully`,
    });

    // Reset form
    setCart([]);
    setCustomerInfo({ name: "", phone: "", email: "" });
  };

  const clearCart = () => {
    setCart([]);
    toast({
      title: "Cart Cleared",
      description: "All items removed from cart",
    });
  };

  return (
    <div className="min-h-screen d-flex">
      <ShopkeeperSidebar />
      
      <div className="main-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold">Product Billing</h2>
            <p className="text-muted mb-0">Create bills and invoices for customers</p>
          </div>
          <div className="d-flex gap-2">
            <span className="badge bg-primary fs-6">
              Cart Items: {cart.length}
            </span>
            <span className="badge bg-success fs-6">
              Total: ${getTotalAmount().toFixed(2)}
            </span>
          </div>
        </div>

        <div className="row">
          {/* Products List */}
          <div className="col-md-6 mb-4">
            <Card>
              <CardHeader>
                <h5 className="fw-bold mb-0">Available Products</h5>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : products.length > 0 ? (
                  <div className="row">
                    {products.map((product) => (
                      <div key={product.id} className="col-12 mb-3">
                        <div className="border rounded p-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="fw-bold mb-1">{product.name}</h6>
                              <p className="text-muted small mb-1">SKU: {product.sku}</p>
                              <p className="fw-bold text-success mb-0">${product.price}</p>
                              <small className="text-muted">Stock: {product.stock}</small>
                            </div>
                            <Button 
                              size="sm" 
                              onClick={() => addToCart(product)}
                              disabled={product.stock <= 0}
                              className="btn btn-primary btn-sm"
                            >
                              <i className="fas fa-plus me-1"></i>
                              Add
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted py-4">
                    <i className="fas fa-box fs-1 mb-3"></i>
                    <p>No products available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Cart and Customer Info */}
          <div className="col-md-6">
            {/* Customer Information */}
            <Card className="mb-4">
              <CardHeader>
                <h5 className="fw-bold mb-0">Customer Information</h5>
              </CardHeader>
              <CardContent>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Label htmlFor="customerName">Customer Name *</Label>
                    <Input
                      id="customerName"
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <Label htmlFor="customerPhone">Phone Number *</Label>
                    <Input
                      id="customerPhone"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <Label htmlFor="customerEmail">Email (Optional)</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      placeholder="Enter email address"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shopping Cart */}
            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold mb-0">Shopping Cart ({cart.length})</h5>
                  {cart.length > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearCart}
                      className="btn btn-outline-danger btn-sm"
                    >
                      Clear Cart
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {cart.length > 0 ? (
                  <>
                    <div className="mb-3">
                      {cart.map((item) => (
                        <div key={item.id} className="border-bottom pb-3 mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                              <h6 className="fw-bold mb-1">{item.name}</h6>
                              <p className="text-muted small mb-0">
                                ${item.price} each
                              </p>
                            </div>
                            <button 
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-2">
                              <button 
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                -
                              </button>
                              <span className="fw-bold">{item.quantity}</span>
                              <button 
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                            <div className="fw-bold text-success">
                              ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-top pt-3">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold mb-0">Total Amount</h5>
                        <h4 className="fw-bold text-success mb-0">
                          ${getTotalAmount().toFixed(2)}
                        </h4>
                      </div>
                      <Button 
                        onClick={handleCheckout}
                        className="btn btn-success w-100"
                        size="lg"
                      >
                        <i className="fas fa-file-invoice-dollar me-2"></i>
                        Generate Invoice
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-muted py-4">
                    <i className="fas fa-shopping-cart fs-1 mb-3"></i>
                    <p>Your cart is empty</p>
                    <small>Add products to create a bill</small>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}