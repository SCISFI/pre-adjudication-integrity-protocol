import { useListMySubmissions, getListMySubmissionsQueryKey } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";

const WEEK_TITLES = [
  "Orientation and Foundations",
  "Accountability and Responsibility",
  "Relationships and Support Systems",
  "Behavioral Patterns and Integrity Practices",
];

export default function Submissions() {
  const [, setLocation] = useLocation();
  const { data: submissions, isLoading } = useListMySubmissions({ query: { queryKey: getListMySubmissionsQueryKey() } });

  if (isLoading) {
    return (
      <Layout>
        <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">Loading…</div>
      </Layout>
    );
  }

  const list = (submissions ?? []) as {
    id: number;
    weekNumber: number;
    reflectionResponse: string;
    integrityCommitment: string;
    completedAt: string;
    feedback?: { feedbackText: string };
  }[];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">My Submissions</h2>
          <p className="text-sm text-muted-foreground mt-1">Weekly reflections and integrity commitments</p>
        </div>

        {list.length === 0 && (
          <div className="rounded border border-border p-8 text-center space-y-3 bg-card">
            <p className="text-sm text-muted-foreground">No submissions yet.</p>
            <Button size="sm" variant="outline" onClick={() => setLocation("/modules")} data-testid="button-go-modules">
              View weekly modules
            </Button>
          </div>
        )}

        <div className="space-y-6">
          {list.map((sub) => (
            <div key={sub.id} className="rounded border border-border bg-card overflow-hidden" data-testid={`submission-week-${sub.weekNumber}`}>
              <div className="px-5 py-4 border-b border-border bg-muted/20 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Week {sub.weekNumber}</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">{WEEK_TITLES[sub.weekNumber - 1]}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(sub.completedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </p>
              </div>

              <div className="px-5 py-4 space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Structured responses</p>
                  <pre className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans">{sub.reflectionResponse}</pre>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Integrity commitment</p>
                  <p className="text-sm text-foreground leading-relaxed">{sub.integrityCommitment}</p>
                </div>

                {sub.feedback && (
                  <div className="pt-3 border-t border-border space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Mentor feedback</p>
                    <p className="text-sm text-foreground leading-relaxed">{sub.feedback.feedbackText}</p>
                    <p className="text-xs text-muted-foreground italic">
                      This feedback is for reflective purposes only and is not for court use.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
