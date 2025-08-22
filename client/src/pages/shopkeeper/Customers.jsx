import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import ShopkeeperSidebar from "@/components/Layout/ShopkeeperSidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: customers = [], isLoading } = useQuery({
    queryKey: searchQuery 
      ? ["/api/customers/search?q=" + encodeURIComponent(searchQuery)]
      : ["/api/customers"],
  });

  const { data: customerPurchases = {} } = useQuery({
    queryKey: ["/api/customers/purchases"],
  });

  return (
    <div className="min-h-screen d-flex">
      <ShopkeeperSidebar />
      
      <div className="main-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold">Customer Management</h2>
            <p className="text-muted mb-0">View and manage your customers</p>
          </div>
          <Link href="/shopkeeper/add-customer" className="btn btn-primary">
            <i className="fas fa-user-plus me-2"></i>Add Customer
          </Link>
        </div>

        <Card className="mb-4">
          <CardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">Search Customers</h5>
            </div>
          </CardHeader>
          <CardContent>
            <div className="row">
              <div className="col-md-6">
                <Input
                  type="text"
                  placeholder="Search by name, phone, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-customers"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h5 className="fw-bold mb-0">Customer List ({customers.length})</h5>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : customers.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Customer Details</th>
                      <th>Contact Info</th>
                      <th>Total Bills</th>
                      <th>Total Spent</th>
                      <th>Last Purchase</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => {
                      const purchases = customerPurchases[customer.id] || { bills: 0, total: 0, lastPurchase: null };
                      return (
                        <tr key={customer.id} data-testid={`row-customer-${customer.id}`}>
                          <td>
                            <div>
                              <div className="fw-bold">{customer.name}</div>
                              {customer.address && (
                                <small className="text-muted">{customer.address}</small>
                              )}
                            </div>
                          </td>
                          <td>
                            <div>
                              <div><i className="fas fa-phone me-1"></i>{customer.phone}</div>
                              {customer.email && (
                                <div><i className="fas fa-envelope me-1"></i>{customer.email}</div>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-info">{purchases.bills} bills</span>
                          </td>
                          <td>
                            <span className="fw-bold text-success">${purchases.total.toFixed(2)}</span>
                          </td>
                          <td>
                            {purchases.lastPurchase ? (
                              <span className="text-muted">
                                {new Date(purchases.lastPurchase).toLocaleDateString()}
                              </span>
                            ) : (
                              <span className="text-muted">No purchases</span>
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button
                                size="sm"
                                variant="outline-info"
                                className="btn btn-outline-info btn-sm"
                                onClick={() => {
                                  // View customer details functionality
                                  alert(`Customer Details:\nName: ${customer.name}\nPhone: ${customer.phone}\nEmail: ${customer.email || 'N/A'}\nAddress: ${customer.address || 'N/A'}`);
                                }}
                                data-testid={`button-view-customer-${customer.id}`}
                              >
                                <i className="fas fa-eye"></i>
                              </Button>
                              <Link 
                                href={`/shopkeeper/billing?customer=${customer.id}`} 
                                className="btn btn-outline-primary btn-sm"
                                data-testid={`button-bill-customer-${customer.id}`}
                              >
                                <i className="fas fa-file-invoice"></i>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-muted py-5">
                <i className="fas fa-users fs-1 mb-3"></i>
                <p>No customers found</p>
                {searchQuery ? (
                  <div>
                    <small>No customers match your search criteria</small>
                    <br />
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => setSearchQuery("")}
                      className="btn btn-outline-secondary btn-sm mt-2"
                    >
                      Clear Search
                    </Button>
                  </div>
                ) : (
                  <div>
                    <small>Add your first customer to get started</small>
                    <br />
                    <Link href="/shopkeeper/add-customer" className="btn btn-primary btn-sm mt-2">
                      <i className="fas fa-user-plus me-1"></i>Add Customer
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}