import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import AdminSidebar from "@/components/Layout/AdminSidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ManageShops() {
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingShop, setEditingShop] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "dairy",
    address: "",
    phone: "",
    email: "",
    description: "",
    ownerId: null,
    logoUrl: "",
  });

  const { data: shops = [], isLoading } = useQuery({
    queryKey: ["/api/shops"],
  });

  const { data: users = [] } = useQuery({
    queryKey: ["/api/users"],
  });

  const createShopMutation = useMutation({
    mutationFn: (shopData) => apiRequest("POST", "/api/shops", shopData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shops"] });
      toast({ title: "Success", description: "Shop created successfully!" });
      resetForm();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create shop", variant: "destructive" });
    },
  });

  const updateShopMutation = useMutation({
    mutationFn: ({ id, ...shopData }) => apiRequest("PUT", `/api/shops/${id}`, shopData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shops"] });
      toast({ title: "Success", description: "Shop updated successfully!" });
      resetForm();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update shop", variant: "destructive" });
    },
  });

  const deleteShopMutation = useMutation({
    mutationFn: (id) => apiRequest("DELETE", `/api/shops/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shops"] });
      toast({ title: "Success", description: "Shop deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete shop", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      type: "dairy",
      address: "",
      phone: "",
      email: "",
      description: "",
      ownerId: null,
      logoUrl: "",
    });
    setShowAddForm(false);
    setEditingShop(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingShop) {
      updateShopMutation.mutate({ id: editingShop.id, ...formData });
    } else {
      createShopMutation.mutate(formData);
    }
  };

  const handleEdit = (shop) => {
    setFormData({
      name: shop.name,
      type: shop.type,
      address: shop.address || "",
      phone: shop.phone || "",
      email: shop.email || "",
      description: shop.description || "",
      ownerId: shop.ownerId,
      logoUrl: shop.logoUrl || "",
    });
    setEditingShop(shop);
    setShowAddForm(true);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getShopTypeIcon = (type) => {
    switch (type) {
      case 'dairy': return 'fas fa-cheese';
      case 'meat': return 'fas fa-drumstick-bite';
      case 'grocery': return 'fas fa-shopping-basket';
      default: return 'fas fa-store';
    }
  };

  const getShopTypeBadge = (type) => {
    switch (type) {
      case 'dairy': return 'bg-info';
      case 'meat': return 'bg-danger';
      case 'grocery': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="min-h-screen d-flex">
      <AdminSidebar />
      
      <div className="main-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Manage Shops</h2>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="btn-primary"
          >
            <i className="fas fa-plus me-2"></i>Add New Shop
          </Button>
        </div>

        {/* Add/Edit Shop Form */}
        {showAddForm && (
          <Card className="mb-4">
            <CardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">
                  {editingShop ? 'Edit Shop' : 'Add New Shop'}
                </h5>
                <Button variant="outline" size="sm" onClick={resetForm}>
                  <i className="fas fa-times"></i>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Label htmlFor="name">Shop Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter shop name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <Label htmlFor="type">Shop Type *</Label>
                    <select
                      id="type"
                      className="form-select"
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      required
                    >
                      <option value="dairy">Dairy</option>
                      <option value="meat">Meat Market</option>
                      <option value="grocery">Grocery Store</option>
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Shop address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="mb-3">
                  <Label htmlFor="logo">Shop Logo</Label>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="form-control"
                    data-testid="input-shop-logo"
                  />
                  <small className="text-muted">Upload an image file for your shop logo (JPG, PNG, etc.)</small>
                  {formData.logoUrl && (
                    <div className="mt-2">
                      <img 
                        src={formData.logoUrl} 
                        alt="Shop logo preview" 
                        className="img-thumbnail"
                        style={{ maxWidth: "150px", maxHeight: "150px" }}
                      />
                    </div>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Label htmlFor="ownerId">Shop Owner</Label>
                    <select
                      id="ownerId"
                      className="form-select"
                      value={formData.ownerId || ""}
                      onChange={(e) => handleInputChange('ownerId', parseInt(e.target.value) || null)}
                    >
                      <option value="">Select an owner</option>
                      {users.filter(user => user.role === 'shopkeeper').map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Shop description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <Button
                    type="submit"
                    disabled={createShopMutation.isPending || updateShopMutation.isPending}
                    className="btn-primary"
                  >
                    {editingShop ? 'Update Shop' : 'Create Shop'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Shops List */}
        <Card>
          <CardHeader>
            <h5 className="fw-bold mb-0">All Shops ({shops.length})</h5>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : shops.length > 0 ? (
              <div className="row">
                {shops.map((shop) => (
                  <div key={shop.id} className="col-lg-6 mb-3">
                    <Card className="dashboard-card h-100">
                      <CardContent className="p-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div className="d-flex align-items-center">
                            <div className="me-3">
                              <i className={`${getShopTypeIcon(shop.type)} fs-2 text-primary`}></i>
                            </div>
                            <div>
                              <h6 className="fw-bold mb-1">{shop.name}</h6>
                              <span className={`badge ${getShopTypeBadge(shop.type)}`}>
                                {shop.type.charAt(0).toUpperCase() + shop.type.slice(1)}
                              </span>
                            </div>
                          </div>
                          <div className="dropdown">
                            <button 
                              className="btn btn-outline-secondary btn-sm dropdown-toggle"
                              type="button"
                              data-bs-toggle="dropdown"
                            >
                              <i className="fas fa-ellipsis-v"></i>
                            </button>
                            <ul className="dropdown-menu">
                              <li>
                                <button 
                                  className="dropdown-item"
                                  onClick={() => handleEdit(shop)}
                                >
                                  <i className="fas fa-edit me-2"></i>Edit
                                </button>
                              </li>
                              <li>
                                <button 
                                  className="dropdown-item text-danger"
                                  onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this shop?')) {
                                      deleteShopMutation.mutate(shop.id);
                                    }
                                  }}
                                >
                                  <i className="fas fa-trash me-2"></i>Delete
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                        
                        {shop.address && (
                          <p className="small text-muted mb-2">
                            <i className="fas fa-map-marker-alt me-2"></i>{shop.address}
                          </p>
                        )}
                        
                        {shop.phone && (
                          <p className="small text-muted mb-2">
                            <i className="fas fa-phone me-2"></i>{shop.phone}
                          </p>
                        )}
                        
                        {shop.email && (
                          <p className="small text-muted mb-2">
                            <i className="fas fa-envelope me-2"></i>{shop.email}
                          </p>
                        )}

                        {shop.ownerId && (
                          <p className="small text-muted mb-2">
                            <i className="fas fa-user me-2"></i>
                            Owner: {users.find(u => u.id === shop.ownerId)?.name || 'Unknown'}
                          </p>
                        )}

                        <div className="mt-3 d-flex justify-content-between text-muted small">
                          <span>
                            <i className="fas fa-calendar me-1"></i>
                            {new Date(shop.createdAt).toLocaleDateString()}
                          </span>
                          <span className={`badge ${shop.isActive ? 'bg-success' : 'bg-secondary'}`}>
                            {shop.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted py-5">
                <i className="fas fa-store fs-1 mb-3"></i>
                <p>No shops found. Add your first shop to get started!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}