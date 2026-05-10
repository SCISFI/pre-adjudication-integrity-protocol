import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@workspace/replit-auth-web";
import { useGetMyProfile, getGetMyProfileQueryKey } from "@workspace/api-client-react";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

// Pages — auth & onboarding
import Login from "@/pages/login";
import RoleSelect from "@/pages/role-select";
import Onboarding from "@/pages/onboarding";

// Pages — participant
import Dashboard from "@/pages/dashboard";
import Checkin from "@/pages/checkin";
import Modules from "@/pages/modules";
import ModuleDetail from "@/pages/module-detail";
import ModuleSubmit from "@/pages/module-submit";
import Submissions from "@/pages/submissions";

// Pages — clinician
import ClinicianDashboard from "@/pages/clinician/dashboard";
import ParticipantDetail from "@/pages/clinician/participant-detail";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function RoleRouter() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useGetMyProfile({
    query: {
      enabled: isAuthenticated,
      queryKey: getGetMyProfileQueryKey(),
    },
  });
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (authLoading || profileLoading) return;

    if (!isAuthenticated) {
      setLocation("/login");
      return;
    }

    if (isAuthenticated && profile) {
      if (!profile.role) {
        setLocation("/role-select");
      } else if (profile.role === "participant") {
        setLocation("/dashboard");
      } else if (profile.role === "clinician") {
        setLocation("/clinician");
      }
    }
  }, [isAuthenticated, authLoading, profile, profileLoading, setLocation]);

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-background">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={RoleRouter} />
      <Route path="/login" component={Login} />
      <Route path="/role-select" component={RoleSelect} />
      <Route path="/onboarding" component={Onboarding} />

      {/* Participant */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/checkin" component={Checkin} />
      <Route path="/modules" component={Modules} />
      <Route path="/modules/:weekNumber/submit" component={ModuleSubmit} />
      <Route path="/modules/:weekNumber" component={ModuleDetail} />
      <Route path="/submissions" component={Submissions} />

      {/* Clinician */}
      <Route path="/clinician" component={ClinicianDashboard} />
      <Route path="/clinician/:participantId" component={ParticipantDetail} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
