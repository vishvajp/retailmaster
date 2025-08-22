import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import ShopkeeperSidebar from "@/components/Layout/ShopkeeperSidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AddCustomer() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    shopId: 1, // This should be dynamically set based on the shopkeeper's shop
  });

  const createCustomerMutation = useMutation({
    mutationFn: async (customerData) => {
      return apiRequest("POST", "/api/customers", customerData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({
        title: "Success",
        description: "Customer added successfully!",
      });
      setLocation("/shopkeeper/customers");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add customer",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in customer name and phone number",
        variant: "destructive",
      });
      return;
    }

    createCustomerMutation.mutate(formData);
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
            <h2 className="fw-bold">Add New Customer</h2>
            <p className="text-muted mb-0">Add a new customer to your database</p>
          </div>
        </div>

        <div className="row">
          <div className="col-md-8">
            <Card>
              <CardHeader>
                <h5 className="fw-bold mb-0">Customer Information</h5>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <Label htmlFor="customerName">Customer Name *</Label>
                      <Input
                        id="customerName"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter customer name"
                        required
                        data-testid="input-customer-name"
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <Label htmlFor="customerPhone">Phone Number *</Label>
                      <Input
                        id="customerPhone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter phone number"
                        required
                        data-testid="input-customer-phone"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <Label htmlFor="customerEmail">Email Address</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter email address (optional)"
                        data-testid="input-customer-email"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <Label htmlFor="customerAddress">Address</Label>
                      <Textarea
                        id="customerAddress"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Enter customer address (optional)"
                        rows={3}
                        data-testid="textarea-customer-address"
                      />
                    </div>
                  </div>

                  <div className="d-flex gap-3 pt-3">
                    <Button 
                      type="submit"
                      disabled={createCustomerMutation.isPending}
                      className="btn btn-primary"
                      data-testid="button-submit-customer"
                    >
                      {createCustomerMutation.isPending ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          Adding Customer...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-user-plus me-2"></i>
                          Add Customer
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      type="button"
                      variant="outline-secondary"
                      onClick={() => setLocation("/shopkeeper/customers")}
                      className="btn btn-outline-secondary"
                      data-testid="button-cancel"
                    >
                      <i className="fas fa-times me-2"></i>
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
                <h6 className="fw-bold mb-0">
                  <i className="fas fa-info-circle me-2"></i>
                  Customer Information
                </h6>
              </CardHeader>
              <CardContent>
                <div className="text-muted">
                  <p className="mb-2">
                    <strong>Required fields:</strong>
                  </p>
                  <ul className="list-unstyled mb-3">
                    <li><i className="fas fa-check text-primary me-2"></i>Customer Name</li>
                    <li><i className="fas fa-check text-primary me-2"></i>Phone Number</li>
                  </ul>
                  
                  <p className="mb-2">
                    <strong>Optional fields:</strong>
                  </p>
                  <ul className="list-unstyled mb-3">
                    <li><i className="fas fa-circle text-muted me-2" style={{fontSize: "8px"}}></i>Email Address</li>
                    <li><i className="fas fa-circle text-muted me-2" style={{fontSize: "8px"}}></i>Address</li>
                  </ul>
                  
                  <p className="small">
                    Adding customer information helps you track purchases and provide better service.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}