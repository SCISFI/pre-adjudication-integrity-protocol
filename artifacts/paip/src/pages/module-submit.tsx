import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import {
  useGetModule,
  useCreateSubmission,
  getGetModuleQueryKey,
  getListMySubmissionsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ModuleSubmit() {
  const [, params] = useRoute("/modules/:weekNumber/submit");
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const weekNumber = params ? parseInt(params.weekNumber, 10) : 0;

  const { data: mod } = useGetModule(weekNumber, {
    query: { enabled: weekNumber > 0, queryKey: getGetModuleQueryKey(weekNumber) },
  });

  const [reflection, setReflection] = useState("");
  const [commitment, setCommitment] = useState("");
  const [attested, setAttested] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ feedbackText?: string | null } | null>(null);

  const { mutate: createSubmission, isPending } = useCreateSubmission({
    mutation: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: getListMySubmissionsQueryKey() });
        setSubmittedData(data?.feedback ?? {});
      },
    },
  });

  const reflectionPrompt = (mod as { sections?: { heading: string; content: string }[] })?.sections?.find(
    (s) => s.heading === "Reflection Prompt",
  )?.content;

  if (submittedData !== null) {
    return (
      <Layout>
        <div className="max-w-xl space-y-6">
          <div className="flex items-center gap-2 text-primary">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium text-foreground">Week {weekNumber} submitted</span>
          </div>
          {submittedData.feedbackText && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Mentor feedback</h3>
              <div className="rounded border border-border p-5 bg-card">
                <p className="text-sm text-foreground leading-relaxed">{submittedData.feedbackText}</p>
              </div>
              <p className="text-xs text-muted-foreground italic">
                This feedback is generated for reflective purposes only. It is not for court use.
              </p>
            </div>
          )}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setLocation("/modules")} data-testid="button-back-modules">
              Back to modules
            </Button>
            <Button onClick={() => setLocation("/submissions")} data-testid="button-view-submissions">
              View all submissions
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-xl space-y-7">
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation(`/modules/${weekNumber}`)}
            className="gap-1.5 -ml-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to module
          </Button>
          <h2 className="text-xl font-semibold text-foreground">Week {weekNumber} — Reflection</h2>
          <p className="text-sm text-muted-foreground">Complete all fields to submit this week's reflection.</p>
        </div>

        {reflectionPrompt && (
          <div className="rounded border border-border p-4 bg-muted/30">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Reflection prompt</p>
            <p className="text-sm text-foreground leading-relaxed">{reflectionPrompt}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="reflection" className="text-sm font-medium text-foreground">
            Your reflection
          </Label>
          <Textarea
            id="reflection"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Write your response to the reflection prompt…"
            className="min-h-[160px] resize-none"
            data-testid="textarea-reflection"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="commitment" className="text-sm font-medium text-foreground">
            State your integrity commitment for this week
          </Label>
          <Textarea
            id="commitment"
            value={commitment}
            onChange={(e) => setCommitment(e.target.value)}
            placeholder="Write a concrete, specific commitment you are making this week…"
            className="min-h-[100px] resize-none"
            data-testid="textarea-commitment"
          />
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="attestation"
            checked={attested}
            onCheckedChange={(v) => setAttested(!!v)}
            className="mt-0.5"
            data-testid="checkbox-attestation"
          />
          <Label htmlFor="attestation" className="text-sm text-foreground leading-relaxed cursor-pointer">
            I have engaged with this material honestly and to the best of my ability.
          </Label>
        </div>

        <Button
          onClick={() =>
            createSubmission({
              data: {
                weekNumber,
                reflectionResponse: reflection.trim(),
                integrityCommitment: commitment.trim(),
                attestationChecked: attested,
              },
            })
          }
          disabled={isPending || !attested || reflection.trim().length < 20 || commitment.trim().length < 10}
          className="w-full"
          data-testid="button-submit-reflection"
        >
          {isPending ? "Submitting…" : "Submit reflection"}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Submissions are final and visible to your assigned clinician for program monitoring purposes only.
        </p>
      </div>
    </Layout>
  );
}
