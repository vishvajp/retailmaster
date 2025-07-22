import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("admin@shopmanager.com");
  const [password, setPassword] = useState("admin123");
  const [role, setRole] = useState("admin");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const updateDemoCredentials = (selectedRole: string) => {
    setRole(selectedRole);
    if (selectedRole === "admin") {
      setEmail("admin@shopmanager.com");
      setPassword("admin123");
    } else {
      setEmail("shop@dairy.com");
      setPassword("shop123");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      
      // Redirect based on role
      if (role === "admin") {
        setLocation("/admin");
      } else {
        setLocation("/shopkeeper");
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center min-vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <Card className="login-card">
              <CardContent className="p-4">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary">
                    <i className="fas fa-store me-2"></i>
                    ShopManager Pro
                  </h2>
                  <p className="text-muted">Sign in to your account</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <Label htmlFor="email">Email</Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-envelope"></i>
                      </span>
                      <Input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-control"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <Label htmlFor="password">Password</Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-lock"></i>
                      </span>
                      <Input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-control"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <Label htmlFor="role">Login as</Label>
                    <select 
                      className="form-select" 
                      id="role" 
                      value={role}
                      onChange={(e) => updateDemoCredentials(e.target.value)}
                    >
                      <option value="admin">Admin</option>
                      <option value="shopkeeper">Shopkeeper</option>
                    </select>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-100 py-2 fw-bold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Signing In...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Sign In
                      </>
                    )}
                  </Button>
                </form>
                
                <div className="mt-4 p-3 bg-light rounded">
                  <h6 className="fw-bold mb-2">Demo Credentials:</h6>
                  <small className="text-muted">
                    <strong>Admin:</strong> admin@shopmanager.com / admin123<br />
                    <strong>Shopkeeper:</strong> shop@dairy.com / shop123
                  </small>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
