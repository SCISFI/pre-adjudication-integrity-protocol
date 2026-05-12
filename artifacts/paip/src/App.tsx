import {
  Switch,
  Route,
  Router as WouterRouter,
  useLocation,
  Redirect,
} from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@workspace/replit-auth-web";
import {
  useGetMyProfile,
  getGetMyProfileQueryKey,
} from "@workspace/api-client-react";
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
        setLocation("/participant/dashboard");
      } else if (
        profile.role === "clinician" ||
        profile.role === "clinical_admin"
      ) {
        setLocation("/clinician/dashboard");
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

      {/* Legacy top-level paths kept as redirects so saved preview URLs do not render NotFound. */}
      <Route path="/dashboard">
        <Redirect to="/participant/dashboard" replace />
      </Route>
      <Route path="/checkin">
        <Redirect to="/participant/daily-check-in" replace />
      </Route>
      <Route path="/modules">
        <Redirect to="/participant/week" replace />
      </Route>
      <Route path="/modules/:weekNumber/submit">
        {(params) => (
          <Redirect
            to={`/participant/week/${params.weekNumber}/submit`}
            replace
          />
        )}
      </Route>
      <Route path="/modules/:weekNumber">
        {(params) => (
          <Redirect to={`/participant/week/${params.weekNumber}`} replace />
        )}
      </Route>
      <Route path="/submissions">
        <Redirect to="/participant/history" replace />
      </Route>
      <Route path="/clinician">
        <Redirect to="/clinician/dashboard" replace />
      </Route>
      <Route path="/clinician/:participantId">
        {(params) => (
          <Redirect
            to={`/clinician/participants/${params.participantId}`}
            replace
          />
        )}
      </Route>

      {/* Participant */}
      <Route path="/participant/dashboard" component={Dashboard} />
      <Route path="/participant/daily-check-in" component={Checkin} />
      <Route path="/participant/week" component={Modules} />
      <Route
        path="/participant/week/:weekNumber/submit"
        component={ModuleSubmit}
      />
      <Route path="/participant/week/:weekNumber" component={ModuleDetail} />
      <Route path="/participant/history" component={Submissions} />

      {/* Clinician */}
      <Route path="/clinician/dashboard" component={ClinicianDashboard} />
      <Route
        path="/clinician/participants/:participantId/summary"
        component={ParticipantDetail}
      />
      <Route
        path="/clinician/participants/:participantId"
        component={ParticipantDetail}
      />

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
