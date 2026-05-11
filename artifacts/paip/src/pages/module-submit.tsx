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

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

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

const WEEKLY_PROMPTS: Record<number, Prompt[]> = {
  1: [
    { id: "truth", label: "Truth I am facing", question: "What truth am I facing this week?", minLength: 20 },
    { id: "avoidance", label: "Avoidance pattern", question: "Where am I tempted to hide, minimize, blame, or manage my image?", minLength: 20 },
    { id: "emotion", label: "Dangerous emotion", question: "What emotion is most dangerous for me right now?", minLength: 10 },
    { id: "boundary", label: "Boundary", question: "What boundary do I need to honor for the next seven days?", minLength: 15 },
    { id: "support", label: "Support contact", question: "Who needs to know how I am really doing?", minLength: 10 },
    { id: "therapy", label: "Therapy work", question: "What do I need to discuss with my licensed therapist or supervised clinical provider?", minLength: 15 },
    { id: "family", label: "Relationship or family impact", question: "What responsibility do I need to practice toward my spouse, partner, family, household, or future relationships without demanding reassurance?", minLength: 20 },
    { id: "next-action", label: "Next right action", question: "What is one concrete action I will take before this week ends?", minLength: 15 },
  ],
  2: [
    { id: "shame", label: "Shame and despair", question: "What is shame, despair, or panic telling me this week?", minLength: 20 },
    { id: "grounding", label: "Grounding", question: "What grounding action do I need today?", minLength: 10 },
    { id: "support", label: "Support", question: "Who do I need to contact instead of isolating?", minLength: 10 },
    { id: "unsafe", label: "Safety honesty", question: "What would I need to do if I begin to feel unsafe or unable to stay grounded?", minLength: 20 },
    { id: "body", label: "Body care", question: "What does my body need this week: sleep, food, movement, medical care, or rest?", minLength: 15 },
    { id: "therapy", label: "Therapy work", question: "What do I need to bring to my therapist or supervised clinical provider immediately?", minLength: 15 },
    { id: "relationship", label: "Not making others carry me", question: "How will I avoid making my spouse, partner, family, or support person responsible for my emotional survival?", minLength: 20 },
    { id: "commitment-prep", label: "Stabilizing action", question: "What stabilizing action will I repeat for the next seven days?", minLength: 15 },
  ],
  3: [
    { id: "difference", label: "Legal trouble versus recovery", question: "Where am I confusing legal trouble with actual recovery work?", minLength: 20 },
    { id: "performance", label: "Performance", question: "Where am I tempted to perform change so others will think better of me?", minLength: 20 },
    { id: "private-work", label: "Private recovery action", question: "What recovery action will I practice this week that no one has to applaud?", minLength: 15 },
    { id: "ownership", label: "Ownership", question: "What pattern belongs to me regardless of what happens legally?", minLength: 20 },
    { id: "support", label: "Accountability structure", question: "What support structure do I need while the legal process remains unresolved?", minLength: 20 },
    { id: "therapy", label: "Therapy work", question: "What do I need to process with my licensed therapist or supervised clinical provider instead of this app?", minLength: 15 },
    { id: "family", label: "Family and relationship posture", question: "How will I practice responsibility toward affected people without demanding that they believe I am changing?", minLength: 20 },
    { id: "commitment-prep", label: "Integrity without audience", question: "What integrity action will I practice this week even if it does not help my image?", minLength: 15 },
  ],
  4: [
    { id: "attorney", label: "Attorney role", question: "What questions or concerns belong with my attorney?", minLength: 10 },
    { id: "therapist", label: "Therapy role", question: "What clinical material belongs with my licensed therapist or supervised clinical provider?", minLength: 15 },
    { id: "support", label: "Support role", question: "What kind of support do I need from safe people who are not my attorney or therapist?", minLength: 15 },
    { id: "app-boundary", label: "App boundary", question: "What does not belong in this app?", minLength: 10 },
    { id: "partner", label: "Spouse/partner/family boundary", question: "What have I been tempted to place on my spouse, partner, family, or support system that does not belong there?", minLength: 20 },
    { id: "role-confusion", label: "Role confusion", question: "Where has role confusion already created harm, pressure, or avoidance?", minLength: 20 },
    { id: "therapy", label: "Therapy work", question: "What role map do I need to review with my therapist or supervised clinical provider?", minLength: 15 },
    { id: "commitment-prep", label: "Right truth, right place", question: "What boundary will I practice this week about putting the right truth in the right place?", minLength: 15 },
  ],
};

function getUnlockStatus(weekNumber: number, submissions: Submission[]) {
  const currentWeekSubmitted = submissions.some((s) => s.weekNumber === weekNumber);

  if (currentWeekSubmitted) {
    return { unlocked: true, reason: "" };
  }

  if (weekNumber === 1) {
    return { unlocked: true, reason: "" };
  }

  const previousSubmission = submissions.find((s) => s.weekNumber === weekNumber - 1);

  if (!previousSubmission) {
    return {
      unlocked: false,
      reason: `Complete Week ${weekNumber - 1} before this module unlocks.`,
    };
  }

  const previousCompletedAt = new Date(previousSubmission.completedAt);
  const unlockDate = new Date(previousCompletedAt.getTime() + SEVEN_DAYS_MS);

  if (Date.now() < unlockDate.getTime()) {
    return {
      unlocked: false,
      reason: `Next module unlocks after your 7-day reflection period is complete (${unlockDate.toLocaleDateString()}).`,
    };
  }

  return { unlocked: true, reason: "" };
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

  function buildReflectionResponse() {
    return prompts
      .map((prompt) => {
        const answer = (responses[prompt.id] ?? "").trim();
        return `${prompt.label}\nQuestion: ${prompt.question}\nResponse: ${answer}`;
      })
      .join("\n\n---\n\n");
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
            Do not enter offense details, victim names, investigative facts, illegal content descriptions, police facts, or legal strategy.
            Bring legal details to your attorney and clinical details to your licensed therapist or supervised clinical provider.
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

        <div className="space-y-2">
          <Label htmlFor="commitment" className="text-sm font-medium text-foreground">
            Weekly integrity commitment
          </Label>
          <p className="text-sm text-muted-foreground">What is one specific integrity commitment you will practice this week?</p>
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
