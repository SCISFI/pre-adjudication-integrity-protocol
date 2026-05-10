import { useRoute, useLocation } from "wouter";
import { useGetModule, useListMySubmissions, getGetModuleQueryKey, getListMySubmissionsQueryKey } from "@workspace/api-client-react";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ModuleDetail() {
  const [, params] = useRoute("/modules/:weekNumber");
  const [, setLocation] = useLocation();
  const weekNumber = params ? parseInt(params.weekNumber, 10) : 0;

  const { data: mod, isLoading } = useGetModule(weekNumber, {
    query: { enabled: weekNumber > 0, queryKey: getGetModuleQueryKey(weekNumber) },
  });
  const { data: submissions } = useListMySubmissions({ query: { queryKey: getListMySubmissionsQueryKey() } });
  const alreadySubmitted = (submissions ?? []).some((s: { weekNumber: number }) => s.weekNumber === weekNumber);

  if (isLoading) {
    return (
      <Layout>
        <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">Loading…</div>
      </Layout>
    );
  }

  if (!mod) {
    return (
      <Layout>
        <div className="space-y-4">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/modules")} className="gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Back to modules
          </Button>
          <p className="text-sm text-muted-foreground">Module not found.</p>
        </div>
      </Layout>
    );
  }

  const typedMod = mod as {
    weekNumber: number;
    title: string;
    focusArea: string;
    sections: { heading: string; content: string }[];
  };

  return (
    <Layout>
      <div className="space-y-8 max-w-2xl">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/modules")} className="gap-1.5 -ml-2">
            <ArrowLeft className="h-4 w-4" /> All modules
          </Button>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Week {typedMod.weekNumber}</p>
          <h2 className="text-xl font-semibold text-foreground">{typedMod.title}</h2>
          <p className="text-sm text-muted-foreground">{typedMod.focusArea}</p>
        </div>

        {alreadySubmitted && (
          <div className="flex items-center gap-2 text-sm text-primary py-3 px-4 rounded border border-border bg-muted/30">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>You have submitted your reflection for this week.</span>
          </div>
        )}

        <div className="space-y-7">
          {typedMod.sections.map((section, i) => (
            <div key={i} className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">{section.heading}</h3>
              <p className="text-sm text-foreground leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-border">
          {alreadySubmitted ? (
            <Button variant="outline" onClick={() => setLocation("/submissions")} data-testid="button-view-submission">
              View my submission
            </Button>
          ) : (
            <Button onClick={() => setLocation(`/modules/${weekNumber}/submit`)} data-testid="button-begin-reflection">
              Begin weekly reflection
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
}
