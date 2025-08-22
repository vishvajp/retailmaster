import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ShopkeeperSidebar from "@/components/Layout/ShopkeeperSidebar";
import { Badge } from "@/components/ui/badge";

export default function BillHistory() {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch bills for the shop
  const { data: bills = [], isLoading } = useQuery({
    queryKey: ["/api/bills"],
  });

  // Filter bills based on search term
  const filteredBills = bills.filter(bill => 
    bill.billNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.customer?.phone?.includes(searchTerm)
  );

  const printBill = (bill) => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    const shopInfo = { name: 'Fresh Dairy Shop', address: '123 Main St, City', phone: '+1-234-567-8901', email: 'shop@dairy.com' };
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bill ${bill.billNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
          .bill-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .total-section { text-align: right; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>${shopInfo.name}</h2>
          <p>${shopInfo.address}</p>
          <p>Phone: ${shopInfo.phone} | Email: ${shopInfo.email}</p>
        </div>
        
        <div class="bill-info">
          <div>
            <h4>Bill To:</h4>
            <p><strong>${bill.customer?.name || 'N/A'}</strong></p>
            <p>${bill.customer?.phone || 'N/A'}</p>
            ${bill.customer?.email ? `<p>${bill.customer.email}</p>` : ''}
          </div>
          <div style="text-align: right;">
            <p><strong>Bill #:</strong> ${bill.billNumber}</p>
            <p><strong>Date:</strong> ${new Date(bill.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${bill.items?.map(item => `
              <tr>
                <td>${item.productName}</td>
                <td>${item.quantity}</td>
                <td>₹${parseFloat(item.price || 0).toFixed(2)}</td>
                <td>₹${parseFloat(item.total || 0).toFixed(2)}</td>
              </tr>
            `).join('') || '<tr><td colspan="4">No items</td></tr>'}
          </tbody>
        </table>
        
        <div class="total-section">
          <p><strong>Subtotal: ₹${parseFloat(bill.subtotal || 0).toFixed(2)}</strong></p>
          <p><strong>Tax (10%): ₹${parseFloat(bill.tax || 0).toFixed(2)}</strong></p>
          <p style="font-size: 18px;"><strong>Total: ₹${parseFloat(bill.total || 0).toFixed(2)}</strong></p>
        </div>
        
        <div class="footer">
          <p>Thank you for your business!</p>
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="min-h-screen d-flex">
      <ShopkeeperSidebar />
      
      <div className="main-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold">Bill History</h2>
            <p className="text-muted mb-0">View and manage all generated bills</p>
          </div>
          <Badge variant="secondary" className="fs-6">
            Total Bills: {filteredBills.length}
          </Badge>
        </div>

        {/* Search Section */}
        <Card className="mb-4">
          <CardHeader>
            <h5 className="fw-bold mb-0">Search Bills</h5>
          </CardHeader>
          <CardContent>
            <div className="row">
              <div className="col-md-6">
                <Label htmlFor="searchBill">Search by Bill Number, Customer Name or Phone</Label>
                <Input
                  id="searchBill"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter bill number, customer name or phone..."
                  data-testid="input-search-bills"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bills List */}
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading bills...</p>
          </div>
        ) : filteredBills.length === 0 ? (
          <Card>
            <CardContent className="text-center py-5">
              <i className="fas fa-receipt fs-1 text-muted mb-3 d-block"></i>
              <h5 className="text-muted">No Bills Found</h5>
              <p className="text-muted">
                {searchTerm ? "No bills match your search criteria." : "No bills have been generated yet."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="row">
            {filteredBills.map((bill) => (
              <div key={bill.id} className="col-md-6 col-lg-4 mb-4">
                <Card className="h-100">
                  <CardHeader>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="fw-bold mb-1">{bill.billNumber}</h6>
                        <small className="text-muted">
                          {new Date(bill.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      <Badge variant="success">
                        ₹{parseFloat(bill.total || 0).toFixed(2)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3">
                      <h6 className="fw-bold mb-1">Customer:</h6>
                      <p className="mb-1">{bill.customer?.name || 'N/A'}</p>
                      <small className="text-muted">{bill.customer?.phone || 'N/A'}</small>
                    </div>
                    
                    <div className="mb-3">
                      <h6 className="fw-bold mb-1">Items:</h6>
                      <small className="text-muted">
                        {bill.items?.length || 0} item(s)
                      </small>
                    </div>
                    
                    <div className="mb-3">
                      <div className="d-flex justify-content-between small">
                        <span>Subtotal:</span>
                        <span>₹{parseFloat(bill.subtotal || 0).toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between small">
                        <span>Tax:</span>
                        <span>₹{parseFloat(bill.tax || 0).toFixed(2)}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="d-flex justify-content-between fw-bold">
                        <span>Total:</span>
                        <span>₹{parseFloat(bill.total || 0).toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="d-flex gap-2">
                      <Button
                        onClick={() => printBill(bill)}
                        size="sm"
                        variant="outline-primary"
                        className="flex-1"
                        data-testid={`button-print-${bill.id}`}
                      >
                        <i className="fas fa-print me-1"></i>
                        Print
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}