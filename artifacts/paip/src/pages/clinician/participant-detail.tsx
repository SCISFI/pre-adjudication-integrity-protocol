import { useRoute, useLocation } from "wouter";
import {
  useGetClinicianParticipantDetail,
  useGenerateParticipationSummary,
  useGetParticipationSummaries,
  getGetClinicianParticipantDetailQueryKey,
  getGetParticipationSummariesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";

interface WeekStatus {
  weekNumber: number;
  submitted: boolean;
  submittedAt: string | null;
}

interface Checkin {
  id: number;
  checkInDate: string;
  reflectionResponse: string;
  completedAt: string;
}

interface Submission {
  id: number;
  weekNumber: number;
  reflectionResponse: string;
  integrityCommitment: string;
  completedAt: string;
  feedback?: { feedbackText: string } | null;
}

interface ParticipantDetail {
  participant: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    onboardingCompleted: boolean;
    lastActivityAt: string | null;
    needsAttention: boolean;
    totalCheckins: number;
    weeklyStatus: WeekStatus[];
  };
  checkins: Checkin[];
  submissions: Submission[];
}

interface Summary {
  id: number;
  summaryText: string;
  disclaimer: string;
  generatedAt: string;
}

export default function ParticipantDetail() {
  const [, params] = useRoute("/clinician/:participantId");
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const participantId = params ? parseInt(params.participantId, 10) : 0;
  const [generatedSummaries, setGeneratedSummaries] = useState<Summary[]>([]);

  const { data: detail, isLoading } = useGetClinicianParticipantDetail(participantId, {
    query: {
      enabled: participantId !== 0,
      queryKey: getGetClinicianParticipantDetailQueryKey(participantId),
    },
  });

  const { data: summaries } = useGetParticipationSummaries(participantId, {
    query: {
      enabled: participantId !== 0,
      queryKey: getGetParticipationSummariesQueryKey(participantId),
    },
  });

  const { mutate: generateSummary, isPending: summaryPending } = useGenerateParticipationSummary({
    mutation: {
      onSuccess: (createdSummary) => {
        queryClient.invalidateQueries({ queryKey: getGetParticipationSummariesQueryKey(participantId) });
        setGeneratedSummaries((current) => [createdSummary as Summary, ...current]);
      },
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">Loading…</div>
      </Layout>
    );
  }

  if (!detail) {
    return (
      <Layout>
        <div className="space-y-4">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/clinician")} className="gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <p className="text-sm text-muted-foreground">Participant not found.</p>
        </div>
      </Layout>
    );
  }

  const d = detail as ParticipantDetail;
  const p = d.participant;
  const displayName = [p.firstName, p.lastName].filter(Boolean).join(" ") || p.email || `Participant #${p.id}`;
  const persistedSummaries = (summaries ?? []) as Summary[];
  const visibleSummaries = [
    ...generatedSummaries,
    ...persistedSummaries.filter((summary) => !generatedSummaries.some((generated) => generated.id === summary.id)),
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Back + Header */}
        <div className="space-y-2">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/clinician")} className="gap-1.5 -ml-2">
            <ArrowLeft className="h-4 w-4" /> All participants
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-foreground">{displayName}</h2>
                {p.needsAttention && (
                  <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 inline-block" />
                    No activity 7+ days
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{p.email}</p>
            </div>
          </div>
        </div>

        {p.needsAttention && (
          <section className="rounded border border-amber-200 bg-amber-50 px-5 py-4 space-y-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-amber-900">Needs Attention clinician guidance</h3>
                <p className="text-xs text-amber-900 leading-relaxed">
                  Needs Attention means this participant has had no recorded activity for 7 or more days. This is not a risk score,
                  relapse indicator, compliance failure, or clinical conclusion. Review recent activity and determine whether
                  follow-up is appropriate through your normal clinical process.
                </p>
              </div>
            </div>
            <ul className="list-disc space-y-1 pl-9 text-xs text-amber-900 leading-relaxed">
              <li>Review last submitted weekly reflection.</li>
              <li>Review last daily check-in.</li>
              <li>Consider whether this should be discussed in the next clinical contact.</li>
              <li>Use normal clinical judgment and existing treatment/support channels.</li>
              <li>Do not interpret inactivity as relapse, risk, deception, or failure.</li>
            </ul>
          </section>
        )}

        {/* Summary stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Onboarding", value: p.onboardingCompleted ? "Complete" : "Pending" },
            { label: "Check-ins", value: p.totalCheckins.toString() },
            { label: "Weeks submitted", value: p.weeklyStatus.filter((w) => w.submitted).length.toString() + " / 4" },
            {
              label: "Last activity",
              value: p.lastActivityAt
                ? new Date(p.lastActivityAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                : "None",
            },
          ].map((stat) => (
            <div key={stat.label} className="rounded border border-border p-4 bg-card text-center">
              <p className="text-lg font-semibold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Weekly module status */}
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Weekly Module Status</h3>
          <div className="rounded border border-border bg-card overflow-hidden divide-y divide-border">
            {p.weeklyStatus.map((ws) => (
              <div key={ws.weekNumber} className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-foreground">Week {ws.weekNumber}</span>
                <div className="text-right">
                  {ws.submitted ? (
                    <span className="text-xs text-primary font-medium">
                      Submitted{ws.submittedAt ? ` — ${new Date(ws.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : ""}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Not submitted</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Check-in history */}
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Daily Check-in History ({d.checkins.length})
          </h3>
          {d.checkins.length === 0 && (
            <p className="text-sm text-muted-foreground">No check-ins recorded.</p>
          )}
          <div className="space-y-2">
            {d.checkins.slice(0, 20).map((c) => (
              <div key={c.id} className="rounded border border-border bg-card px-5 py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-muted-foreground">
                    {new Date(c.checkInDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{c.reflectionResponse}</p>
              </div>
            ))}
            {d.checkins.length > 20 && (
              <p className="text-xs text-muted-foreground pl-1">{d.checkins.length - 20} older check-ins not shown.</p>
            )}
          </div>
        </section>

        {/* Submissions */}
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Weekly Submissions</h3>
          {d.submissions.length === 0 && (
            <p className="text-sm text-muted-foreground">No submissions recorded.</p>
          )}
          <div className="space-y-4">
            {d.submissions.map((s) => (
              <div key={s.id} className="rounded border border-border bg-card overflow-hidden">
                <div className="px-5 py-3 border-b border-border bg-muted/20 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Week {s.weekNumber}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(s.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <div className="px-5 py-4 space-y-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Structured responses</p>
                    <pre className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans">{s.reflectionResponse}</pre>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Integrity commitment</p>
                    <p className="text-sm text-foreground leading-relaxed">{s.integrityCommitment}</p>
                  </div>
                  {s.feedback && (
                    <div className="pt-3 border-t border-border">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">AI feedback</p>
                      <p className="text-sm text-foreground leading-relaxed">{s.feedback.feedbackText}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Participation Summary */}
        <section className="space-y-4 pt-4 border-t border-border">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground">Participation Summary</h3>
            <p className="text-xs text-muted-foreground">
              Generates a factual activity summary for program monitoring purposes. This document records participation data only
              and contains no clinical assessment, risk evaluation, or legal opinion.
            </p>
          </div>

          <Button
            onClick={() => generateSummary({ participantId })}
            disabled={summaryPending}
            variant="outline"
            data-testid="button-generate-summary"
          >
            {summaryPending ? "Generating…" : "Generate participation summary"}
          </Button>

          {visibleSummaries.length > 0 && (
            <div className="space-y-4">
              {visibleSummaries.map((s) => (
                <div key={`${s.id}-${s.generatedAt}`} className="rounded border border-border bg-card overflow-hidden" data-testid={`summary-${s.id}`}>
                  <div className="px-5 py-3 border-b border-border bg-muted/20">
                    <p className="text-xs text-muted-foreground">
                      Generated {new Date(s.generatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                  <div className="px-5 py-4 space-y-4">
                    <div className="rounded border border-amber-200 bg-amber-50 px-4 py-3">
                      <p className="text-xs text-amber-800 leading-relaxed">{s.disclaimer}</p>
                    </div>
                    <pre className="text-xs text-foreground font-mono whitespace-pre-wrap leading-relaxed">{s.summaryText}</pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
