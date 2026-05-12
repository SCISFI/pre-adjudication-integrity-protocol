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
    {
      id: "seriousness",
      label: "Seriousness of this moment",
      question:
        "What truth about the seriousness of this moment do I need to face without explaining, defending, or minimizing?",
      minLength: 35,
    },
    {
      id: "stabilization",
      label: "Stabilization without avoidance",
      question:
        "What do I need to do in the next 7 days to stop adding damage and stay grounded enough to do the work?",
      minLength: 35,
    },
    {
      id: "legal-recovery",
      label: "Legal crisis versus recovery",
      question:
        "Where am I tempted to confuse legal crisis management with actual recovery-accountability work?",
      minLength: 35,
    },
    {
      id: "attorney",
      label: "Belongs with my attorney",
      question:
        "What legal questions or concerns belong with my attorney instead of this app? Do not include the details here.",
      minLength: 25,
    },
    {
      id: "clinical-provider",
      label: "Belongs with my clinical provider",
      question:
        "What clinical material belongs with my licensed therapist or supervised clinical provider instead of this app?",
      minLength: 25,
    },
    {
      id: "support-role",
      label: "Appropriate support role",
      question:
        "Who needs to know how I am really doing, and what can I appropriately ask of that person without making them responsible for me?",
      minLength: 35,
    },
    {
      id: "relationship-responsibility",
      label: "Relationship and family responsibility",
      question:
        "What responsibility do I need to practice toward my spouse, partner, family, household, or future relationships without demanding reassurance, contact, forgiveness, or belief?",
      minLength: 35,
    },
    {
      id: "boundary",
      label: "Seven-day boundary",
      question:
        "What specific boundary do I need to honor for the next 7 days with technology, isolation, conversations, emotions, or support?",
      minLength: 30,
    },
    {
      id: "next-action",
      label: "Concrete next-right action",
      question:
        "What is one concrete next-right action I will complete before this week ends?",
      minLength: 25,
    },
  ],
  2: [
    {
      id: "recurring-thought",
      label: "Recurring thought pattern",
      question:
        "What recurring thought has been shaping my choices, secrecy, avoidance, entitlement, shame, or image management this week?",
      minLength: 35,
    },
    {
      id: "thinking-error",
      label: "Thinking error",
      question:
        "What thinking error am I most tempted to use: minimization, blame, exception-making, self-pity, entitlement, comparison, or delay?",
      minLength: 35,
    },
    {
      id: "truthful-reframe",
      label: "Truthful reframe",
      question:
        "What is a more honest sentence I can practice when that thought appears?",
      minLength: 25,
    },
    {
      id: "thought-journal",
      label: "Thought journal practice",
      question:
        "Using general language only, write one present-tense thought journal entry: situation, emotion, thought, body cue, action urge, and better response.",
      minLength: 60,
    },
    {
      id: "soft-language",
      label: "Softened language",
      question:
        "Where am I using softened language to make something seem less serious than it is?",
      minLength: 30,
    },
    {
      id: "attorney",
      label: "Belongs with my attorney",
      question:
        "What legal question or fear should be directed to my attorney rather than processed here? Do not include the details here.",
      minLength: 25,
    },
    {
      id: "clinical-provider",
      label: "Belongs with my clinical provider",
      question:
        "What thinking pattern or clinical concern needs to be brought to my licensed therapist or supervised clinical provider?",
      minLength: 30,
    },
    {
      id: "daily-honesty",
      label: "Daily honesty practice",
      question:
        "What daily honesty practice will I repeat for the next 7 days before I act from a distorted thought?",
      minLength: 30,
    },
  ],
  3: [
    {
      id: "vulnerability-chain",
      label: "Vulnerability chain",
      question:
        "Using general language only, what chain shows up for me before poor choices: stress, emotion, thought, body cue, urge, opportunity, or decision?",
      minLength: 45,
    },
    {
      id: "early-warning",
      label: "Early warning point",
      question:
        "Where is the earliest point in that chain where I can tell the truth or interrupt the pattern?",
      minLength: 30,
    },
    {
      id: "pause-name-choose",
      label: "Pause, name, choose",
      question:
        "How will I practice pause, name, choose this week when I notice a destabilizing emotion, thought, or urge?",
      minLength: 35,
    },
    {
      id: "support-without-outsourcing",
      label: "Support without outsourcing",
      question:
        "What can I appropriately ask a support person to do, and what must remain my own responsibility?",
      minLength: 35,
    },
    {
      id: "environment",
      label: "Environment change",
      question:
        "What environment, schedule, technology, isolation, or routine change would make the next right action more likely this week?",
      minLength: 35,
    },
    {
      id: "clinical-provider",
      label: "Clinical provider follow-up",
      question:
        "What part of this chain needs to be reviewed with my licensed therapist or supervised clinical provider?",
      minLength: 25,
    },
    {
      id: "not-pressure-others",
      label: "No pressure on others",
      question:
        "How will I avoid pressuring a spouse, partner, family member, or support person to monitor, reassure, forgive, or certify my change?",
      minLength: 35,
    },
    {
      id: "self-control-practice",
      label: "Seven-day self-control practice",
      question:
        "What self-control practice will I repeat for the next 7 days before I act automatically?",
      minLength: 30,
    },
  ],
  4: [
    {
      id: "healthy-boundary",
      label: "Healthy boundary",
      question:
        "What healthy boundary do I need to practice behaviorally this week, not merely intend?",
      minLength: 30,
    },
    {
      id: "sexual-health",
      label: "Sexual health reflection",
      question:
        "Using non-explicit general language, what does healthier sexuality require from me now: honesty, consent, respect, non-coercion, patience, sobriety of mind, or clinical help?",
      minLength: 45,
    },
    {
      id: "privacy-secrecy",
      label: "Privacy versus secrecy",
      question:
        "Where do I need to distinguish appropriate privacy from secrecy that protects unhealthy patterns?",
      minLength: 35,
    },
    {
      id: "containment-team",
      label: "Containment team roles",
      question:
        "Who belongs in my containment team, and what role does each person or professional appropriately hold?",
      minLength: 35,
    },
    {
      id: "attorney",
      label: "Attorney role",
      question:
        "What legal questions or restrictions need attorney guidance rather than app reflection?",
      minLength: 25,
    },
    {
      id: "clinical-provider",
      label: "Clinical provider role",
      question:
        "What clinical treatment need, support need, or disclosure question belongs with my licensed therapist or supervised clinical provider?",
      minLength: 30,
    },
    {
      id: "spouse-family-boundary",
      label: "Spouse, partner, family, or household boundary",
      question:
        "What boundary protects my spouse, partner, family, household, or future relationships from pressure, reassurance-seeking, or role confusion?",
      minLength: 35,
    },
    {
      id: "safeguard",
      label: "Seven-day safeguard",
      question:
        "What concrete safeguard will I practice for the next 7 days without treating it as a score, guarantee, or proof that I am safe?",
      minLength: 35,
    },
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
  return {
    unlocked: true,
    reason: "All Phase 1 modules are temporarily unlocked for MVP testing.",
  };
}

export default function ModuleSubmit() {
  const [, params] = useRoute("/participant/week/:weekNumber/submit");
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const weekNumber = params ? parseInt(params.weekNumber, 10) : 0;

  useGetModule(weekNumber, {
    query: {
      enabled: weekNumber > 0,
      queryKey: getGetModuleQueryKey(weekNumber),
    },
  });

  const { data: submissions } = useListMySubmissions({
    query: { queryKey: getListMySubmissionsQueryKey() },
  });
  const submissionList = (submissions ?? []) as Submission[];
  const unlockStatus = getUnlockStatus(weekNumber, submissionList);
  const prompts = WEEKLY_PROMPTS[weekNumber] ?? WEEKLY_PROMPTS[1];

  const [responses, setResponses] = useState<Record<string, string>>({});
  const [selfInventory, setSelfInventory] = useState<Record<string, boolean>>(
    {},
  );
  const [commitment, setCommitment] = useState("");
  const [attested, setAttested] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    feedbackText?: string | null;
  } | null>(null);

  const { mutate: createSubmission, isPending } = useCreateSubmission({
    mutation: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: getListMySubmissionsQueryKey(),
        });
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

    const inventoryResponses = WEEK_ONE_SELF_INVENTORY.map(
      (item) =>
        `${item.label}: ${selfInventory[item.id] ? "Self-attested" : "Not selected"}`,
    ).join("\n");

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
            <span className="font-medium text-foreground">
              Week {weekNumber} submitted
            </span>
          </div>
          {submittedData.feedbackText && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                Mentor feedback
              </h3>
              <div className="rounded border border-border p-5 bg-card">
                <p className="text-sm text-foreground leading-relaxed">
                  {submittedData.feedbackText}
                </p>
              </div>
              <p className="text-xs text-muted-foreground italic">
                This feedback is generated for reflective purposes only. It is
                not for court use.
              </p>
            </div>
          )}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setLocation("/participant/week")}
              data-testid="button-back-modules"
            >
              Back to modules
            </Button>
            <Button
              onClick={() => setLocation("/participant/history")}
              data-testid="button-view-submissions"
            >
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation(`/participant/week/${weekNumber}`)}
            className="gap-1.5 -ml-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to module
          </Button>
          <div className="rounded border border-border bg-card p-6 space-y-3">
            <div className="flex items-center gap-2">
              <LockKeyhole className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">
                Week {weekNumber} reflection is locked
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {unlockStatus.reason}
            </p>
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
            onClick={() => setLocation(`/participant/week/${weekNumber}`)}
            className="gap-1.5 -ml-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to module
          </Button>
          <h2 className="text-xl font-semibold text-foreground">
            Week {weekNumber} — Structured Written Work
          </h2>
          <p className="text-sm text-muted-foreground">
            Complete each response field directly. Plan for at least 30 minutes
            of focused weekly work.
          </p>
        </div>

        <div className="rounded border border-border p-4 bg-muted/30">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Boundary reminder
          </p>
          <p className="text-sm text-foreground leading-relaxed">
            Do not enter offense details, victim names, investigative facts,
            illegal content descriptions, police facts, or legal strategy in
            this app. Use this space for recovery reflection, accountability,
            boundaries, emotions, and next right actions. Discuss legal details
            with your attorney and clinical details with your licensed therapist
            or supervised clinical provider.
          </p>
        </div>

        {prompts.map((prompt, index) => (
          <div key={prompt.id} className="space-y-2">
            <Label
              htmlFor={prompt.id}
              className="text-sm font-medium text-foreground"
            >
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
              <h3 className="text-sm font-semibold text-foreground">
                Review / self-inventory
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Check any areas that need attention this week. This is
                self-attestation only, not a score, risk indicator, relapse
                prediction, clinical conclusion, or success/failure rating.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {WEEK_ONE_SELF_INVENTORY.map((item) => (
                <label
                  key={item.id}
                  className="flex items-start gap-3 rounded border border-border bg-muted/20 p-3 text-sm text-foreground"
                >
                  <Checkbox
                    checked={!!selfInventory[item.id]}
                    onCheckedChange={(value) =>
                      setInventoryItem(item.id, !!value)
                    }
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
          <Label
            htmlFor="commitment"
            className="text-sm font-medium text-foreground"
          >
            Weekly integrity commitment
          </Label>
          <p className="text-sm text-muted-foreground">
            What is one concrete, behavioral commitment you will practice for
            the next 7 days?
          </p>
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
          <Label
            htmlFor="attestation"
            className="text-sm text-foreground leading-relaxed cursor-pointer"
          >
            I completed this reflection honestly and without intentionally
            hiding what I know needs attention.
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
          disabled={
            isPending ||
            !attested ||
            !allResponsesComplete ||
            commitment.trim().length < 10
          }
          className="w-full"
          data-testid="button-submit-reflection"
        >
          {isPending ? "Submitting…" : "Submit structured reflection"}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Submissions are final and visible to your assigned clinician for
          program monitoring purposes only.
        </p>
      </div>
    </Layout>
  );
}
