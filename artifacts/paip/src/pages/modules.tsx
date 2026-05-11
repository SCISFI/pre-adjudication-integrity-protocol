import { useListModules, useListMySubmissions, getListMySubmissionsQueryKey } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import Layout from "@/components/layout";
import { ArrowRight, CheckCircle2, Circle, LockKeyhole } from "lucide-react";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

type Submission = {
  weekNumber: number;
  completedAt: string | Date;
};

function getUnlockStatus(weekNumber: number, submissions: Submission[]) {
  const currentWeekSubmitted = submissions.some((s) => s.weekNumber === weekNumber);

  if (currentWeekSubmitted) {
    return {
      unlocked: true,
      label: "Submitted",
      reason: "",
    };
  }

  if (weekNumber === 1) {
    return {
      unlocked: true,
      label: "",
      reason: "",
    };
  }

  const previousSubmission = submissions.find((s) => s.weekNumber === weekNumber - 1);

  if (!previousSubmission) {
    return {
      unlocked: false,
      label: "Locked",
      reason: `Complete Week ${weekNumber - 1} before this module unlocks.`,
    };
  }

  const previousCompletedAt = new Date(previousSubmission.completedAt);
  const unlockDate = new Date(previousCompletedAt.getTime() + SEVEN_DAYS_MS);

  if (Date.now() < unlockDate.getTime()) {
    return {
      unlocked: false,
      label: "Locked",
      reason: `Next module unlocks after your 7-day reflection period is complete (${unlockDate.toLocaleDateString()}).`,
    };
  }

  return {
    unlocked: true,
    label: "",
    reason: "",
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
        <div>
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
          Complete each module's reflection to advance. The next module unlocks only after the prior module is completed and the 7-day reflection period is complete.
        </p>
      </div>
    </Layout>
  );
}
