import { useLocation, Link } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";
import { useGetMyProfile } from "@workspace/api-client-react";
import { Shield, LogOut, LayoutDashboard, BookOpen, CheckSquare, FileText, Users, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const PARTICIPANT_NAV: NavItem[] = [
  { href: "/participant/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/participant/daily-check-in", label: "Daily Check-in", icon: CheckSquare },
  { href: "/participant/week", label: "Weekly Modules", icon: BookOpen },
  { href: "/participant/history", label: "My Submissions", icon: FileText },
];

const CLINICIAN_NAV: NavItem[] = [
  { href: "/clinician/dashboard", label: "Participants", icon: Users },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const { data: profile } = useGetMyProfile();
  const [location, setLocation] = useLocation();

  const isClinicalRole = profile?.role === "clinician" || profile?.role === "clinical_admin";
  const nav = isClinicalRole ? CLINICIAN_NAV : PARTICIPANT_NAV;
  const displayName = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || profile?.email || "Account";

  return (
    <div className="min-h-[100dvh] flex bg-background">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="px-5 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 bg-primary rounded-sm flex items-center justify-center shrink-0">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xs font-semibold tracking-wide text-sidebar-foreground uppercase">PAIP</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = location === href || location.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-foreground font-medium"
                    : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
                data-testid={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setLocation("/role-select")}
            className="flex items-center gap-2.5 px-3 py-2 rounded text-sm text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 w-full text-left"
            data-testid="button-switch-test-role"
          >
            <Repeat className="h-4 w-4 shrink-0" />
            Switch test role
          </button>
        </nav>

        <div className="px-3 py-4 border-t border-sidebar-border">
          <div className="px-3 pb-2">
            <p className="text-xs text-muted-foreground truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground capitalize">{profile?.role?.replace("_", " ") ?? "—"}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
            onClick={logout}
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
