import { useListModules, useListMySubmissions, getListMySubmissionsQueryKey } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, LockKeyhole } from "lucide-react";

type Submission = {
  weekNumber: number;
  completedAt: string | Date;
};

function getUnlockStatus(weekNumber: number, submissions: Submission[]) {
  const currentWeekSubmitted = submissions.some((s) => s.weekNumber === weekNumber);

  return {
    unlocked: true,
    label: currentWeekSubmitted ? "Submitted" : "Testing unlocked",
    reason: "All Phase 1 modules are temporarily unlocked for MVP testing.",
  };
}

export default function Modules() {
  const [, setLocation] = useLocation();
  const { data: modules, isLoading: modulesLoading } = useListModules();
  const { data: submissions } = useListMySubmissions({ query: { queryKey: getListMySubmissionsQueryKey() } });

  const submissionList = (submissions ?? []) as Submission[];
  const submittedWeeks = new Set(submissionList.map((s) => s.weekNumber));

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
        <div className="space-y-2">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/dashboard")} className="gap-1.5 -ml-2">
            <ArrowLeft className="h-4 w-4" /> Return to Main Menu
          </Button>
          <h2 className="text-xl font-semibold text-foreground">Weekly Modules</h2>
          <p className="text-sm text-muted-foreground mt-1">Phase 1 — Weeks 1 through 4</p>
        </div>

        <div className="rounded border border-border bg-card overflow-hidden divide-y divide-border">
          {(modules ?? []).map((mod: { weekNumber: number; title: string; focusArea: string }) => {
            const done = submittedWeeks.has(mod.weekNumber);
            const unlockStatus = getUnlockStatus(mod.weekNumber, submissionList);
            const locked = !unlockStatus.unlocked;

            return (
              <button
                key={mod.weekNumber}
                onClick={() => {
                  if (!locked) {
                    setLocation(`/modules/${mod.weekNumber}`);
                  }
                }}
                disabled={locked}
                className={`w-full flex items-center gap-4 px-5 py-5 text-left transition-colors group ${
                  locked ? "bg-muted/20 cursor-not-allowed opacity-75" : "hover:bg-muted/30"
                }`}
                data-testid={`module-card-week-${mod.weekNumber}`}
              >
                <div className="shrink-0">
                  {done ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : locked ? (
                    <LockKeyhole className="h-5 w-5 text-muted-foreground" />
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
                  {locked && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {unlockStatus.reason}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {done && <span className="text-xs text-muted-foreground">Submitted</span>}
                  {locked && <span className="text-xs text-muted-foreground">Locked</span>}
                  {!locked && <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />}
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground">
          Testing mode: all Phase 1 modules are temporarily unlocked so the full weekly workflow can be reviewed. The 7-day unlock timing can be restored later.
        </p>
      </div>
    </Layout>
  );
}
