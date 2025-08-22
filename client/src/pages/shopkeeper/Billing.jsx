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
  const [billItems, setBillItems] = useState([{ productId: "", quantity: 1, price: 0 }]);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
  });
  const [generatedBill, setGeneratedBill] = useState(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/products"],
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

    const billNumber = `BILL-${Date.now()}`;
    const bill = {
      billNumber,
      date: new Date(),
      customer: customerInfo,
      items: validItems.map(item => {
        const product = products.find(p => p.id === parseInt(item.productId));
        return {
          ...item,
          productName: product?.name || 'Unknown Product',
          total: item.price * item.quantity
        };
      }),
      subtotal: getTotalAmount(),
      tax: getTotalAmount() * 0.1, // 10% tax
      total: getTotalAmount() * 1.1
    };

    setGeneratedBill(bill);
    toast({
      title: "Bill Generated",
      description: `Bill ${billNumber} created successfully`,
    });
  };

  const printBill = () => {
    window.print();
  };

  const resetForm = () => {
    setBillItems([{ productId: "", quantity: 1, price: 0 }]);
    setCustomerInfo({ name: "", phone: "", email: "", address: "" });
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
                  Items: {billItems.length}
                </span>
                <span className="badge bg-success fs-6">
                  Total: ${getTotalAmount().toFixed(2)}
                </span>
              </div>
            </div>

            <div className="row">
              {/* Customer Information */}
              <div className="col-md-4 mb-4">
                <Card>
                  <CardHeader>
                    <h5 className="fw-bold mb-0">Customer Information</h5>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3">
                      <Label htmlFor="customerName">Customer Name *</Label>
                      <Input
                        id="customerName"
                        type="text"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                        placeholder="Enter customer name"
                        data-testid="input-customer-name"
                      />
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="customerPhone">Phone Number *</Label>
                      <Input
                        id="customerPhone"
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                        placeholder="Enter phone number"
                        data-testid="input-customer-phone"
                      />
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="customerEmail">Email</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                        placeholder="Enter email address"
                        data-testid="input-customer-email"
                      />
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="customerAddress">Address</Label>
                      <Input
                        id="customerAddress"
                        type="text"
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                        placeholder="Enter customer address"
                        data-testid="input-customer-address"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bill Items */}
              <div className="col-md-8">
                <Card>
                  <CardHeader>
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="fw-bold mb-0">Bill Items</h5>
                      <Button 
                        onClick={addBillItem}
                        className="btn btn-primary btn-sm"
                        data-testid="button-add-item"
                      >
                        <i className="fas fa-plus me-1"></i>
                        Add Item
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        {billItems.map((item, index) => (
                          <div key={index} className="border rounded p-3 mb-3">
                            <div className="row align-items-center">
                              <div className="col-md-5 mb-2">
                                <Label>Product</Label>
                                <select 
                                  className="form-select"
                                  value={item.productId}
                                  onChange={(e) => updateBillItem(index, 'productId', e.target.value)}
                                  data-testid={`select-product-${index}`}
                                >
                                  <option value="">Select Product</option>
                                  {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                      {product.name} - ${product.price}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="col-md-3 mb-2">
                                <Label>Quantity</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => updateBillItem(index, 'quantity', e.target.value)}
                                  data-testid={`input-quantity-${index}`}
                                />
                              </div>
                              <div className="col-md-2 mb-2">
                                <Label>Price</Label>
                                <div className="fw-bold text-success">
                                  ${item.price.toFixed(2)}
                                </div>
                              </div>
                              <div className="col-md-2 mb-2 d-flex align-items-end">
                                <Button 
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => removeBillItem(index)}
                                  disabled={billItems.length === 1}
                                  className="btn btn-outline-danger btn-sm"
                                  data-testid={`button-remove-item-${index}`}
                                >
                                  <i className="fas fa-trash"></i>
                                </Button>
                              </div>
                            </div>
                            <div className="mt-2 text-end">
                              <strong>Subtotal: ${(item.price * item.quantity).toFixed(2)}</strong>
                            </div>
                          </div>
                        ))}
                        
                        <div className="border-top pt-3 mt-4">
                          <div className="row">
                            <div className="col-md-8">
                              <div className="d-flex gap-2">
                                <Button 
                                  onClick={generateBill}
                                  className="btn btn-success"
                                  data-testid="button-generate-bill"
                                >
                                  <i className="fas fa-file-invoice me-2"></i>
                                  Generate Bill
                                </Button>
                                <Button 
                                  onClick={resetForm}
                                  variant="outline-secondary"
                                  className="btn btn-outline-secondary"
                                  data-testid="button-reset-form"
                                >
                                  Reset
                                </Button>
                              </div>
                            </div>
                            <div className="col-md-4 text-end">
                              <h4 className="fw-bold text-success mb-0">
                                Total: ${getTotalAmount().toFixed(2)}
                              </h4>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        ) : (
          /* Generated Bill Preview */
          <div className="bill-preview">
            <div className="d-flex justify-content-between align-items-center mb-4 no-print">
              <h2 className="fw-bold">Bill Generated</h2>
              <div className="d-flex gap-2">
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
                  Create New Bill
                </Button>
              </div>
            </div>

            <Card className="printable-bill">
              <CardContent className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary mb-1">ShopManager Pro</h2>
                  <p className="text-muted mb-1">Your Shop Address Here</p>
                  <p className="text-muted">Contact: +1-234-567-8900</p>
                </div>

                <div className="row mb-4">
                  <div className="col-6">
                    <h5 className="fw-bold mb-2">Bill To:</h5>
                    <p className="mb-1"><strong>{generatedBill.customer.name}</strong></p>
                    <p className="mb-1">{generatedBill.customer.phone}</p>
                    {generatedBill.customer.email && <p className="mb-1">{generatedBill.customer.email}</p>}
                    {generatedBill.customer.address && <p className="mb-1">{generatedBill.customer.address}</p>}
                  </div>
                  <div className="col-6 text-end">
                    <h5 className="fw-bold mb-2">Bill Details:</h5>
                    <p className="mb-1"><strong>Bill #:</strong> {generatedBill.billNumber}</p>
                    <p className="mb-1"><strong>Date:</strong> {generatedBill.date.toLocaleDateString()}</p>
                    <p className="mb-1"><strong>Time:</strong> {generatedBill.date.toLocaleTimeString()}</p>
                  </div>
                </div>

                <div className="table-responsive mb-4">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generatedBill.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.productName}</td>
                          <td>{item.quantity}</td>
                          <td>${item.price.toFixed(2)}</td>
                          <td>${item.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="row">
                  <div className="col-6"></div>
                  <div className="col-6">
                    <div className="border-top pt-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Subtotal:</span>
                        <span>${generatedBill.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Tax (10%):</span>
                        <span>${generatedBill.tax.toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between border-top pt-2">
                        <strong>Total Amount:</strong>
                        <strong className="text-success">${generatedBill.total.toFixed(2)}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-5 pt-4 border-top">
                  <p className="text-muted mb-0">Thank you for your business!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

    </div>
  );
}