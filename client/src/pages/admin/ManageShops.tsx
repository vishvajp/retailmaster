import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import AdminSidebar from "@/components/Layout/AdminSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Shop } from "@shared/schema";

export default function ManageShops() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    address: "",
    phone: "",
    email: "",
    ownerId: 1, // This should be dynamically set
  });

  const { toast } = useToast();

  const { data: shops = [], isLoading } = useQuery<Shop[]>({
    queryKey: ["/api/shops"],
  });

  const createShopMutation = useMutation({
    mutationFn: async (shopData: typeof formData) => {
      return apiRequest("POST", "/api/shops", shopData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shops"] });
      setIsAddDialogOpen(false);
      setFormData({
        name: "",
        type: "",
        address: "",
        phone: "",
        email: "",
        ownerId: 1,
      });
      toast({
        title: "Success",
        description: "Shop created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create shop",
        variant: "destructive",
      });
    },
  });

  const deleteShopMutation = useMutation({
    mutationFn: async (shopId: number) => {
      return apiRequest("DELETE", `/api/shops/${shopId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shops"] });
      toast({
        title: "Success",
        description: "Shop deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete shop",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createShopMutation.mutate(formData);
  };

  const handleDelete = (shopId: number) => {
    if (confirm("Are you sure you want to delete this shop?")) {
      deleteShopMutation.mutate(shopId);
    }
  };

  return (
    <div className="min-h-screen d-flex">
      <AdminSidebar />
      
      <div className="main-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Manage Shops</h2>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <i className="fas fa-plus me-2"></i>Add New Shop
              </Button>
            </DialogTrigger>
            <DialogContent className="modal-lg">
              <DialogHeader>
                <DialogTitle>
                  <i className="fas fa-store me-2"></i>Add New Shop
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <Label htmlFor="shopName">Shop Name</Label>
                    <Input
                      id="shopName"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <Label htmlFor="shopType">Shop Type</Label>
                    <select 
                      className="form-select" 
                      id="shopType"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      required
                    >
                      <option value="">Select type</option>
                      <option value="dairy">Dairy</option>
                      <option value="meat">Meat</option>
                      <option value="grocery">Grocery</option>
                    </select>
                  </div>
                </div>
                
                <div className="row mb-3">
                  <div className="col-md-6">
                    <Label htmlFor="shopPhone">Phone Number</Label>
                    <Input
                      type="tel"
                      id="shopPhone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <Label htmlFor="shopEmail">Email</Label>
                    <Input
                      type="email"
                      id="shopEmail"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <Label htmlFor="shopAddress">Address</Label>
                  <textarea
                    className="form-control"
                    id="shopAddress"
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>
                
                <div className="d-flex gap-2">
                  <Button type="submit" disabled={createShopMutation.isPending}>
                    {createShopMutation.isPending ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Adding...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>Add Shop
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Shop Name</th>
                      <th>Type</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shops.map((shop) => (
                      <tr key={shop.id}>
                        <td>{shop.name}</td>
                        <td>
                          <span className={`badge ${
                            shop.type === 'dairy' ? 'bg-info' :
                            shop.type === 'meat' ? 'bg-danger' : 'bg-success'
                          }`}>
                            {shop.type}
                          </span>
                        </td>
                        <td>{shop.phone}</td>
                        <td>{shop.email}</td>
                        <td>
                          <span className={`badge ${shop.isActive ? 'bg-success' : 'bg-warning'}`}>
                            {shop.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary btn-action me-1">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger btn-action"
                            onClick={() => handleDelete(shop.id)}
                            disabled={deleteShopMutation.isPending}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {shops.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center text-muted py-4">
                          No shops found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
