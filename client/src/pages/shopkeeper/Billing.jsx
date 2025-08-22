import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import ShopkeeperSidebar from "@/components/Layout/ShopkeeperSidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Billing() {
  const { toast } = useToast();
  const [billItems, setBillItems] = useState([{ productId: "", quantity: 1, price: 0 }]);
  const [customerInfo, setCustomerInfo] = useState({
    id: "",
    name: "",
    phone: "",
    email: "",
    address: ""
  });
  const [customerSearch, setCustomerSearch] = useState("");
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
  const [generatedBill, setGeneratedBill] = useState(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["/api/customers/search?q=" + encodeURIComponent(customerSearch)],
    enabled: customerSearch.length > 0
  });

  // Fetch shop information for logo display
  const { data: shops = [] } = useQuery({
    queryKey: ["/api/shops"],
  });

  // Get the shopkeeper's shop (assuming first shop for now)
  const shopInfo = shops.length > 0 ? shops[0] : null;

  const createBillMutation = useMutation({
    mutationFn: async (billData) => {
      return apiRequest("POST", "/api/bills", billData);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bills"] });
      // Ensure proper data structure for the generated bill
      const billWithCalculatedValues = {
        ...result,
        subtotal: getTotalAmount(),
        tax: getTotalAmount() * 0.1,
        total: getTotalAmount() * 1.1,
        customer: customerInfo,
        createdAt: new Date().toISOString()
      };
      setGeneratedBill(billWithCalculatedValues);
      toast({
        title: "Bill Created",
        description: `Bill ${result.billNumber} created successfully`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create bill",
        variant: "destructive",
      });
    },
  });

  const addBillItem = () => {
    setBillItems([...billItems, { productId: "", quantity: 1, price: 0 }]);
  };

  const removeBillItem = (index) => {
    setBillItems(billItems.filter((_, i) => i !== index));
  };

  const updateBillItem = (index, field, value) => {
    const updatedItems = billItems.map((item, i) => {
      if (i === index) {
        if (field === 'productId') {
          const selectedProduct = products.find(p => p.id === parseInt(value));
          return { 
            ...item, 
            productId: value,
            price: selectedProduct ? parseFloat(selectedProduct.price) : 0
          };
        }
        return { ...item, [field]: field === 'quantity' ? parseInt(value) || 1 : value };
      }
      return item;
    });
    setBillItems(updatedItems);
  };

  const selectCustomer = (customer) => {
    setCustomerInfo({
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email || "",
      address: customer.address || ""
    });
    setCustomerSearch(customer.name);
    setShowCustomerSuggestions(false);
  };

  const handleCustomerSearchChange = (value) => {
    setCustomerSearch(value);
    setCustomerInfo({
      ...customerInfo,
      name: value
    });
    setShowCustomerSuggestions(value.length > 0);
  };

  const getTotalAmount = () => {
    return billItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const generateBill = () => {
    if (!customerInfo.name || !customerInfo.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in customer name and phone",
        variant: "destructive"
      });
      return;
    }

    const validItems = billItems.filter(item => item.productId && item.quantity > 0);
    if (validItems.length === 0) {
      toast({
        title: "No Items",
        description: "Please add at least one product to the bill",
        variant: "destructive"
      });
      return;
    }

    const subtotal = getTotalAmount();
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    const billData = {
      customer: customerInfo,
      items: validItems.map(item => {
        const product = products.find(p => p.id === parseInt(item.productId));
        return {
          productId: item.productId,
          productName: product?.name || 'Unknown Product',
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        };
      }),
      subtotal,
      tax,
      total
    };

    createBillMutation.mutate(billData);
  };

  const printBill = () => {
    window.print();
  };

  const resetForm = () => {
    setBillItems([{ productId: "", quantity: 1, price: 0 }]);
    setCustomerInfo({ id: "", name: "", phone: "", email: "", address: "" });
    setCustomerSearch("");
    setGeneratedBill(null);
  };

  return (
    <div className="min-h-screen d-flex">
      <ShopkeeperSidebar />
      
      <div className="main-content">
        {!generatedBill ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="fw-bold">Create Bill</h2>
                <p className="text-muted mb-0">Generate customer bills and invoices</p>
              </div>
              <div className="d-flex gap-2">
                <span className="badge bg-primary fs-6">
                  Total: ₹{getTotalAmount().toFixed(2)}
                </span>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Card className="mb-4">
                  <CardHeader>
                    <h5 className="fw-bold mb-0">Customer Information</h5>
                  </CardHeader>
                  <CardContent>
                    <div className="row">
                      <div className="col-md-12 mb-3 position-relative">
                        <Label htmlFor="customerSearch">Customer Name *</Label>
                        <Input
                          id="customerSearch"
                          type="text"
                          value={customerSearch}
                          onChange={(e) => handleCustomerSearchChange(e.target.value)}
                          placeholder="Search existing customer or enter new name"
                          data-testid="input-customer-search"
                        />
                        {showCustomerSuggestions && customers.length > 0 && (
                          <div className="position-absolute w-100 bg-white border rounded shadow-sm mt-1" style={{zIndex: 1000}}>
                            {customers.slice(0, 5).map((customer) => (
                              <div
                                key={customer.id}
                                className="p-2 cursor-pointer hover:bg-light"
                                onClick={() => selectCustomer(customer)}
                                data-testid={`suggestion-customer-${customer.id}`}
                              >
                                <div className="fw-bold">{customer.name}</div>
                                <div className="small text-muted">{customer.phone} • {customer.email}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <Label htmlFor="customerPhone">Phone *</Label>
                        <Input
                          id="customerPhone"
                          type="tel"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                          placeholder="Phone number"
                          required
                          data-testid="input-customer-phone"
                        />
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <Label htmlFor="customerEmail">Email</Label>
                        <Input
                          id="customerEmail"
                          type="email"
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                          placeholder="Email (optional)"
                          data-testid="input-customer-email"
                        />
                      </div>
                      
                      <div className="col-md-12 mb-3">
                        <Label htmlFor="customerAddress">Address</Label>
                        <Input
                          id="customerAddress"
                          type="text"
                          value={customerInfo.address}
                          onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                          placeholder="Address (optional)"
                          data-testid="input-customer-address"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="col-md-6">
                <Card className="mb-4">
                  <CardHeader>
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="fw-bold mb-0">Bill Items</h5>
                      <Button
                        onClick={addBillItem}
                        size="sm"
                        className="btn btn-outline-primary btn-sm"
                        data-testid="button-add-item"
                      >
                        <i className="fas fa-plus me-1"></i>Add Item
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {billItems.map((item, index) => (
                      <div key={index} className="row align-items-end mb-3 p-2 border rounded" data-testid={`item-row-${index}`}>
                        <div className="col-md-5">
                          <Label>Product</Label>
                          <Select 
                            value={item.productId} 
                            onValueChange={(value) => updateBillItem(index, 'productId', value)}
                            data-testid={`select-product-${index}`}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((product) => (
                                <SelectItem key={product.id} value={product.id.toString()}>
                                  {product.name} - ₹{product.price}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="col-md-3">
                          <Label>Qty</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateBillItem(index, 'quantity', e.target.value)}
                            data-testid={`input-quantity-${index}`}
                          />
                        </div>
                        
                        <div className="col-md-3">
                          <Label>Total</Label>
                          <div className="fw-bold fs-6 pt-2">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                        
                        <div className="col-md-1">
                          {billItems.length > 1 && (
                            <Button
                              onClick={() => removeBillItem(index)}
                              variant="outline-danger"
                              size="sm"
                              className="btn btn-outline-danger btn-sm"
                              data-testid={`button-remove-item-${index}`}
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-top pt-3 mt-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Subtotal:</span>
                        <span className="fw-bold">₹{getTotalAmount().toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Tax (10%):</span>
                        <span className="fw-bold">₹{(getTotalAmount() * 0.1).toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="fw-bold fs-5">Total:</span>
                        <span className="fw-bold fs-5 text-primary">
                          ₹{(getTotalAmount() * 1.1).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="d-flex gap-3">
                  <Button
                    onClick={generateBill}
                    className="btn btn-primary flex-fill"
                    disabled={createBillMutation.isPending}
                    data-testid="button-generate-bill"
                  >
                    {createBillMutation.isPending ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Creating Bill...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-file-invoice me-2"></i>
                        Generate Bill
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={resetForm}
                    variant="outline-secondary"
                    className="btn btn-outline-secondary"
                    data-testid="button-reset-form"
                  >
                    <i className="fas fa-redo me-2"></i>
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            {/* Bill Display */}
            <div className="d-print-block d-none">
              <div className="bill-container mx-auto p-4 bg-white" style={{maxWidth: '800px', fontFamily: 'Arial, sans-serif'}}>
                {/* Header Section */}
                <div className="text-center mb-4 border-bottom pb-3">
                  {shopInfo && shopInfo.logoUrl && (
                    <div className="mb-3">
                      <img 
                        src={shopInfo.logoUrl} 
                        alt={`${shopInfo.name} logo`}
                        className="mx-auto d-block"
                        style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "contain" }}
                      />
                    </div>
                  )}
                  <h2 className="fw-bold mb-2" style={{color: '#2c3e50'}}>{shopInfo ? shopInfo.name : 'Fresh Dairy Shop'}</h2>
                  {shopInfo && shopInfo.address && <p className="mb-1 text-muted">{shopInfo.address}</p>}
                  {shopInfo && shopInfo.phone && <p className="mb-1 text-muted">Phone: {shopInfo.phone}</p>}
                  {shopInfo && shopInfo.email && <p className="mb-1 text-muted">Email: {shopInfo.email}</p>}
                </div>
                
                {/* Bill Info Section */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h5 className="fw-bold mb-2">Bill To:</h5>
                    <div className="border-start border-3 border-primary ps-3">
                      <p className="mb-1 fw-semibold">{generatedBill.customer?.name || 'N/A'}</p>
                      <p className="mb-1 text-muted">{generatedBill.customer?.phone || 'N/A'}</p>
                      {generatedBill.customer?.email && <p className="mb-1 text-muted">{generatedBill.customer.email}</p>}
                      {generatedBill.customer?.address && <p className="mb-1 text-muted">{generatedBill.customer.address}</p>}
                    </div>
                  </div>
                  <div className="col-md-6 text-end">
                    <div className="border border-primary rounded p-3">
                      <p className="mb-2"><strong>Bill #:</strong> <span className="text-primary">{generatedBill.billNumber || 'N/A'}</span></p>
                      <p className="mb-0"><strong>Date:</strong> {generatedBill.createdAt ? new Date(generatedBill.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <table className="table table-bordered table-striped mb-4">
                  <thead className="table-dark">
                    <tr>
                      <th>Product</th>
                      <th width="80">Qty</th>
                      <th width="100">Price</th>
                      <th width="100">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generatedBill.items && generatedBill.items.length > 0 ? 
                      generatedBill.items.map((item, index) => (
                        <tr key={index}>
                          <td className="fw-semibold">{item.productName || 'Unknown Product'}</td>
                          <td className="text-center">{item.quantity || 0}</td>
                          <td className="text-end">₹{(parseFloat(item.price) || 0).toFixed(2)}</td>
                          <td className="text-end fw-bold">₹{(parseFloat(item.total) || 0).toFixed(2)}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="4" className="text-center text-muted">No items found</td>
                        </tr>
                      )
                    }
                  </tbody>
                </table>
                
                {/* Totals Section */}
                <div className="row justify-content-end">
                  <div className="col-md-6">
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td className="text-end fw-semibold">Subtotal:</td>
                          <td className="text-end fw-bold">₹{(generatedBill.subtotal || 0).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td className="text-end fw-semibold">Tax (10%):</td>
                          <td className="text-end fw-bold">₹{(generatedBill.tax || 0).toFixed(2)}</td>
                        </tr>
                        <tr className="border-top border-2">
                          <td className="text-end fw-bold fs-5">Total:</td>
                          <td className="text-end fw-bold fs-5 text-primary">₹{(generatedBill.total || 0).toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Footer */}
                <div className="text-center mt-4 pt-3 border-top">
                  <p className="small text-muted mb-0">Thank you for your business!</p>
                  <p className="small text-muted">Generated on {new Date().toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="d-print-none">
              <Card className="mx-auto" style={{maxWidth: '800px'}}>
                <CardHeader className="text-center">
                  <h3 className="fw-bold text-success">
                    <i className="fas fa-check-circle me-2"></i>
                    Bill Generated Successfully!
                  </h3>
                  <p className="text-muted">Bill #{generatedBill.billNumber}</p>
                </CardHeader>
                <CardContent>
                  <div className="d-flex gap-3 justify-content-center">
                    <Button
                      onClick={printBill}
                      className="btn btn-primary"
                      data-testid="button-print-bill"
                    >
                      <i className="fas fa-print me-2"></i>
                      Print Bill
                    </Button>
                    
                    <Button
                      onClick={resetForm}
                      variant="outline-secondary"
                      className="btn btn-outline-secondary"
                      data-testid="button-new-bill"
                    >
                      <i className="fas fa-plus me-2"></i>
                      New Bill
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}