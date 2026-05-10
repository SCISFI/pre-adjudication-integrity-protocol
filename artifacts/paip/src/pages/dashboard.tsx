import { useGetTodayCheckin, useListMySubmissions, getListMySubmissionsQueryKey } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

const WEEK_TITLES = ["Orientation and Foundations", "Accountability and Responsibility", "Relationships and Support Systems", "Behavioral Patterns and Integrity Practices"];

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { data: todayCheckin } = useGetTodayCheckin();
  const { data: submissions } = useListMySubmissions({ query: { queryKey: getListMySubmissionsQueryKey() } });

  const submittedWeeks = new Set((submissions ?? []).map((s: { weekNumber: number }) => s.weekNumber));
  const latestSubmission = (submissions ?? []).slice(-1)[0] as { weekNumber: number; integrityCommitment: string; feedback?: { feedbackText: string } } | undefined;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-foreground">Program Overview</h2>
          <p className="text-sm text-muted-foreground mt-1">Pre-Adjudication Integrity Protocol — Phase 1</p>
        </div>

        {/* Daily Check-in */}
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Daily Check-in</h3>
          <div className="rounded border border-border p-5 bg-card flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              {todayCheckin?.submitted ? (
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              )}
              <div>
                <p className="text-sm font-medium text-foreground">
                  {todayCheckin?.submitted ? "Submitted for today" : "Not yet submitted today"}
                </p>
                {todayCheckin?.submitted && todayCheckin.checkin && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {(todayCheckin.checkin as { reflectionResponse: string }).reflectionResponse}
                  </p>
                )}
              </div>
            </div>
            {!todayCheckin?.submitted && (
              <Button size="sm" onClick={() => setLocation("/checkin")} data-testid="button-goto-checkin">
                Check in
              </Button>
            )}
          </div>
        </section>

        {/* Weekly Modules */}
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Weekly Modules</h3>
          <div className="rounded border border-border overflow-hidden bg-card divide-y divide-border">
            {[1, 2, 3, 4].map((week) => {
              const done = submittedWeeks.has(week);
              return (
                <button
                  key={week}
                  onClick={() => setLocation(`/modules/${week}`)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/30 transition-colors group"
                  data-testid={`module-week-${week}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-medium text-muted-foreground w-14 shrink-0">Week {week}</span>
                    <span className="text-sm text-foreground truncate">{WEEK_TITLES[week - 1]}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    {done ? (
                      <span className="text-xs text-muted-foreground">Submitted</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Not submitted</span>
                    )}
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Last feedback */}
        {latestSubmission?.feedback && (
          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Most Recent Feedback — Week {latestSubmission.weekNumber}
            </h3>
            <div className="rounded border border-border p-5 bg-card space-y-3">
              <p className="text-sm text-foreground leading-relaxed">{latestSubmission.feedback.feedbackText}</p>
              <p className="text-xs text-muted-foreground italic">
                This feedback is generated for reflective purposes only. It is not for court use.
              </p>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
