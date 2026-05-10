import { useAuth } from "@workspace/replit-auth-web";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Login() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setLocation("/");
    }
  }, [isLoading, isAuthenticated, setLocation]);

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm flex flex-col items-center text-center space-y-8">
        <div className="space-y-4">
          <div className="h-16 w-16 bg-primary rounded flex items-center justify-center mx-auto">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Pre-Adjudication Integrity Protocol
          </h1>
          <p className="text-muted-foreground text-sm max-w-[280px] mx-auto">
            A structured recovery and accountability platform.
          </p>
        </div>

        <Button 
          onClick={login} 
          disabled={isLoading}
          size="lg" 
          className="w-full font-medium"
          data-testid="button-login"
        >
          Log in
        </Button>
      </div>
    </div>
  );
}
