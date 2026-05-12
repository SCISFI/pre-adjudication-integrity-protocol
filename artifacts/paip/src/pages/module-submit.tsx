import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import {
  useGetModule,
  useCreateSubmission,
  useListMySubmissions,
  getGetModuleQueryKey,
  getListMySubmissionsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2, LockKeyhole } from "lucide-react";

type Submission = {
  weekNumber: number;
  completedAt: string | Date;
};

type Prompt = {
  id: string;
  label: string;
  question: string;
  minLength: number;
};

type SelfInventoryItem = {
  id: string;
  label: string;
};

const WEEKLY_PROMPTS: Record<number, Prompt[]> = {
  1: [
    { id: "truth", label: "Truth I am facing", question: "What truth am I facing this week?", minLength: 30 },
    { id: "avoidance", label: "Hide, minimize, blame, or manage", question: "What am I most tempted to hide, minimize, blame, or manage?", minLength: 30 },
    { id: "emotion", label: "Most dangerous emotion", question: "What emotion is most dangerous for me right now?", minLength: 20 },
    { id: "boundary", label: "Seven-day boundary", question: "What boundary do I need to honor for the next 7 days?", minLength: 25 },
    { id: "support", label: "Who needs to know", question: "Who needs to know how I am really doing?", minLength: 20 },
    { id: "attorney", label: "Belongs with my attorney", question: "What belongs with my attorney, not this app?", minLength: 20 },
    { id: "clinical-provider", label: "Belongs with my clinical provider", question: "What belongs with my licensed therapist or supervised clinical provider?", minLength: 20 },
    { id: "relationship-responsibility", label: "Relationship and family responsibility", question: "What responsibility do I need to practice toward my spouse, partner, family, household, or future relationships without demanding reassurance?", minLength: 30 },
    { id: "next-action", label: "Concrete next-right action", question: "What is one concrete next-right action I will take before this week ends?", minLength: 25 },
  ],
  2: [
    { id: "shame-panic", label: "Shame, despair, or panic", question: "What is shame, despair, or panic telling me this week?", minLength: 30 },
    { id: "grounding", label: "Grounding action", question: "What grounding action do I need today?", minLength: 25 },
    { id: "support-contact", label: "Support instead of isolation", question: "Who do I need to contact instead of isolating, and what can I appropriately ask of that person?", minLength: 30 },
    { id: "if-unsafe", label: "If I cannot stay grounded", question: "What would I need to do if I begin to feel unsafe, unable to stay grounded, or at risk of harming myself or someone else?", minLength: 30 },
    { id: "body-care", label: "Body care", question: "What does my body need this week: sleep, food, movement, medical care, or rest?", minLength: 25 },
    { id: "clinical-provider", label: "Belongs with my clinical provider", question: "What belongs with my licensed therapist or supervised clinical provider this week?", minLength: 25 },
    { id: "not-making-others-carry-me", label: "Not making others carry me", question: "How will I avoid making my spouse, partner, family, or support person responsible for my emotional survival?", minLength: 30 },
    { id: "stabilizing-action", label: "Seven-day stabilizing action", question: "What stabilizing action will I repeat for the next 7 days?", minLength: 25 },
  ],
  3: [
    { id: "legal-vs-recovery", label: "Legal trouble versus recovery", question: "Where am I confusing legal trouble with actual recovery work?", minLength: 30 },
    { id: "performance", label: "Performance and image management", question: "Where am I tempted to perform change so others will think better of me?", minLength: 30 },
    { id: "private-recovery", label: "Private recovery action", question: "What recovery action will I practice this week that no one has to applaud?", minLength: 25 },
    { id: "ownership", label: "What belongs to me", question: "What pattern belongs to me regardless of what happens legally?", minLength: 30 },
    { id: "attorney", label: "Belongs with my attorney", question: "What belongs with my attorney, not this app?", minLength: 25 },
    { id: "clinical-provider", label: "Belongs with my clinical provider", question: "What belongs with my licensed therapist or supervised clinical provider?", minLength: 25 },
    { id: "family-posture", label: "Responsibility without demanding belief", question: "How will I practice responsibility toward affected people without demanding that they believe I am changing?", minLength: 30 },
    { id: "integrity-without-audience", label: "Integrity without audience", question: "What integrity action will I practice this week even if it does not help my image?", minLength: 25 },
  ],
  4: [
    { id: "attorney", label: "Attorney role", question: "What questions or concerns belong with my attorney?", minLength: 25 },
    { id: "clinical-provider", label: "Clinical provider role", question: "What clinical material belongs with my licensed therapist or supervised clinical provider?", minLength: 25 },
    { id: "support-people", label: "Support people role", question: "What kind of support do I need from safe people who are not my attorney or therapist?", minLength: 25 },
    { id: "app-boundary", label: "App boundary", question: "What does not belong in this app?", minLength: 25 },
    { id: "spouse-family-boundary", label: "Spouse, partner, family, or household boundary", question: "What have I been tempted to place on my spouse, partner, family, household, or support system that does not belong there?", minLength: 30 },
    { id: "role-confusion", label: "Role confusion", question: "Where has role confusion already created harm, pressure, or avoidance?", minLength: 30 },
    { id: "provider-review", label: "Role map for clinical review", question: "What role map do I need to review with my therapist or supervised clinical provider?", minLength: 25 },
    { id: "right-truth-right-place", label: "Right truth, right place", question: "What boundary will I practice this week about putting the right truth in the right place?", minLength: 25 },
  ],
};

const WEEK_ONE_SELF_INVENTORY: SelfInventoryItem[] = [
  { id: "isolation", label: "Isolation" },
  { id: "sleep-disruption", label: "Sleep disruption" },
  { id: "shame-intensity", label: "Shame intensity" },
  { id: "panic", label: "Panic" },
  { id: "image-management", label: "Temptation to manage image" },
  { id: "avoid-support", label: "Temptation to avoid therapy/support" },
];

function getUnlockStatus(_weekNumber: number, _submissions: Submission[]) {
  return { unlocked: true, reason: "All Phase 1 modules are temporarily unlocked for MVP testing." };
}

export default function ModuleSubmit() {
  const [, params] = useRoute("/modules/:weekNumber/submit");
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const weekNumber = params ? parseInt(params.weekNumber, 10) : 0;

  useGetModule(weekNumber, {
    query: { enabled: weekNumber > 0, queryKey: getGetModuleQueryKey(weekNumber) },
  });

  const { data: submissions } = useListMySubmissions({ query: { queryKey: getListMySubmissionsQueryKey() } });
  const submissionList = (submissions ?? []) as Submission[];
  const unlockStatus = getUnlockStatus(weekNumber, submissionList);
  const prompts = WEEKLY_PROMPTS[weekNumber] ?? WEEKLY_PROMPTS[1];

  const [responses, setResponses] = useState<Record<string, string>>({});
  const [selfInventory, setSelfInventory] = useState<Record<string, boolean>>({});
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

  function setResponse(id: string, value: string) {
    setResponses((prev) => ({ ...prev, [id]: value }));
  }

  function setInventoryItem(id: string, value: boolean) {
    setSelfInventory((prev) => ({ ...prev, [id]: value }));
  }

  function buildReflectionResponse() {
    const writtenResponses = prompts
      .map((prompt) => {
        const answer = (responses[prompt.id] ?? "").trim();
        return `${prompt.label}\nQuestion: ${prompt.question}\nResponse: ${answer}`;
      })
      .join("\n\n---\n\n");

    if (weekNumber !== 1) return writtenResponses;

    const inventoryResponses = WEEK_ONE_SELF_INVENTORY
      .map((item) => `${item.label}: ${selfInventory[item.id] ? "Self-attested" : "Not selected"}`)
      .join("\n");

    return `${writtenResponses}\n\n---\n\nSelf-inventory (self-attestation only; not scored)\n${inventoryResponses}`;
  }

  const allResponsesComplete = prompts.every((prompt) => {
    return (responses[prompt.id] ?? "").trim().length >= prompt.minLength;
  });

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

  if (!unlockStatus.unlocked) {
    return (
      <Layout>
        <div className="max-w-xl space-y-5">
          <Button variant="ghost" size="sm" onClick={() => setLocation(`/modules/${weekNumber}`)} className="gap-1.5 -ml-2">
            <ArrowLeft className="h-4 w-4" /> Back to module
          </Button>
          <div className="rounded border border-border bg-card p-6 space-y-3">
            <div className="flex items-center gap-2">
              <LockKeyhole className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">Week {weekNumber} reflection is locked</h2>
            </div>
            <p className="text-sm text-muted-foreground">{unlockStatus.reason}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl space-y-7">
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation(`/modules/${weekNumber}`)}
            className="gap-1.5 -ml-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to module
          </Button>
          <h2 className="text-xl font-semibold text-foreground">Week {weekNumber} — Structured Written Work</h2>
          <p className="text-sm text-muted-foreground">
            Complete each response field directly. Plan for about 30 minutes of focused weekly work.
          </p>
        </div>

        <div className="rounded border border-border p-4 bg-muted/30">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Boundary reminder</p>
          <p className="text-sm text-foreground leading-relaxed">
            Do not enter offense details, victim names, investigative facts, illegal content descriptions, police facts, or legal strategy in this app.
            Use this space for recovery reflection, accountability, boundaries, emotions, and next right actions. Discuss legal details with your attorney
            and clinical details with your licensed therapist or supervised clinical provider.
          </p>
        </div>

        {prompts.map((prompt, index) => (
          <div key={prompt.id} className="space-y-2">
            <Label htmlFor={prompt.id} className="text-sm font-medium text-foreground">
              {index + 1}. {prompt.label}
            </Label>
            <p className="text-sm text-muted-foreground">{prompt.question}</p>
            <Textarea
              id={prompt.id}
              value={responses[prompt.id] ?? ""}
              onChange={(e) => setResponse(prompt.id, e.target.value)}
              placeholder="Write a direct response to this one question…"
              className="min-h-[110px] resize-y"
              data-testid={`textarea-reflection-${prompt.id}`}
            />
          </div>
        ))}

        {weekNumber === 1 && (
          <section className="rounded border border-border bg-card p-5 space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground">Review / self-inventory</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Check any areas that need attention this week. This is self-attestation only, not a score, risk indicator, relapse prediction,
                clinical conclusion, or success/failure rating.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {WEEK_ONE_SELF_INVENTORY.map((item) => (
                <label key={item.id} className="flex items-start gap-3 rounded border border-border bg-muted/20 p-3 text-sm text-foreground">
                  <Checkbox
                    checked={!!selfInventory[item.id]}
                    onCheckedChange={(value) => setInventoryItem(item.id, !!value)}
                    data-testid={`checkbox-self-inventory-${item.id}`}
                    className="mt-0.5"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </section>
        )}

        <div className="space-y-2">
          <Label htmlFor="commitment" className="text-sm font-medium text-foreground">
            Weekly integrity commitment
          </Label>
          <p className="text-sm text-muted-foreground">What is one concrete, behavioral commitment you will practice for the next 7 days?</p>
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
            I completed this reflection honestly and without intentionally hiding what I know needs attention.
          </Label>
        </div>

        <Button
          onClick={() =>
            createSubmission({
              data: {
                weekNumber,
                reflectionResponse: buildReflectionResponse(),
                integrityCommitment: commitment.trim(),
                attestationChecked: attested,
              },
            })
          }
          disabled={isPending || !attested || !allResponsesComplete || commitment.trim().length < 10}
          className="w-full"
          data-testid="button-submit-reflection"
        >
          {isPending ? "Submitting…" : "Submit structured reflection"}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Submissions are final and visible to your assigned clinician for program monitoring purposes only.
        </p>
      </div>
    </Layout>
  );
}
