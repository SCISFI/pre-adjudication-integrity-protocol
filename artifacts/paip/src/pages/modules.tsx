import { useListModules, useListMySubmissions, getListMySubmissionsQueryKey } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import Layout from "@/components/layout";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";

export default function Modules() {
  const [, setLocation] = useLocation();
  const { data: modules, isLoading: modulesLoading } = useListModules();
  const { data: submissions } = useListMySubmissions({ query: { queryKey: getListMySubmissionsQueryKey() } });

  const submittedWeeks = new Set((submissions ?? []).map((s: { weekNumber: number }) => s.weekNumber));

  if (modulesLoading) {
    return (
      <Layout>
        <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">Loading…</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Weekly Modules</h2>
          <p className="text-sm text-muted-foreground mt-1">Phase 1 — Weeks 1 through 4</p>
        </div>

        <div className="rounded border border-border bg-card overflow-hidden divide-y divide-border">
          {(modules ?? []).map((mod: { weekNumber: number; title: string; focusArea: string }) => {
            const done = submittedWeeks.has(mod.weekNumber);
            return (
              <button
                key={mod.weekNumber}
                onClick={() => setLocation(`/modules/${mod.weekNumber}`)}
                className="w-full flex items-center gap-4 px-5 py-5 text-left hover:bg-muted/30 transition-colors group"
                data-testid={`module-card-week-${mod.weekNumber}`}
              >
                <div className="shrink-0">
                  {done ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-muted-foreground shrink-0">Week {mod.weekNumber}</span>
                    <span className="text-sm font-medium text-foreground truncate">{mod.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{mod.focusArea}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {done && <span className="text-xs text-muted-foreground">Submitted</span>}
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground">
          Complete each module's reflection to advance. Modules are completed in order.
        </p>
      </div>
    </Layout>
  );
}
