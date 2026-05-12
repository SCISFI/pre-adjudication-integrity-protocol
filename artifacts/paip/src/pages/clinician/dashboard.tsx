import { useListClinicianParticipants, getListClinicianParticipantsQueryKey } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import Layout from "@/components/layout";
import { ArrowRight } from "lucide-react";

interface WeekStatus {
  weekNumber: number;
  submitted: boolean;
  submittedAt: string | null;
}

interface Participant {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  onboardingCompleted: boolean;
  totalCheckins: number;
  weeklyStatus: WeekStatus[];
  lastActivityAt: string | null;
  needsAttention: boolean;
}

function displayName(p: Participant) {
  const full = [p.firstName, p.lastName].filter(Boolean).join(" ");
  return full || p.email || `Participant #${p.id}`;
}

export default function ClinicianDashboard() {
  const [, setLocation] = useLocation();
  const { data: participants, isLoading } = useListClinicianParticipants({
    query: { queryKey: getListClinicianParticipantsQueryKey() },
  });

  const list = (participants ?? []) as Participant[];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Participants</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {list.length} participant{list.length !== 1 ? "s" : ""} assigned to your account
          </p>
        </div>

        {isLoading && (
          <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">Loading…</div>
        )}

        {!isLoading && list.length === 0 && (
          <div className="rounded border border-border p-8 text-center bg-card">
            <p className="text-sm text-muted-foreground">No participants are assigned to you yet.</p>
          </div>
        )}

        {!isLoading && list.length > 0 && (
          <div className="rounded border border-border overflow-hidden bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Onboarding</th>
                  <th className="text-center px-3 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Check-ins</th>
                  <th className="text-center px-3 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">W1</th>
                  <th className="text-center px-3 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">W2</th>
                  <th className="text-center px-3 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">W3</th>
                  <th className="text-center px-3 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">W4</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Last activity</th>
                  <th className="px-3 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {list.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-muted/20 cursor-pointer transition-colors group"
                    onClick={() => setLocation(`/clinician/participants/${p.id}`)}
                    data-testid={`participant-row-${p.id}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{displayName(p)}</span>
                        {p.needsAttention && (
                          <span
                            className="inline-block h-2 w-2 rounded-full bg-amber-500 shrink-0"
                            title="No activity in 7+ days"
                            data-testid={`needs-attention-${p.id}`}
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {p.onboardingCompleted ? "Complete" : "Pending"}
                    </td>
                    <td className="px-3 py-3 text-center text-muted-foreground">{p.totalCheckins}</td>
                    {[1, 2, 3, 4].map((w) => {
                      const ws = p.weeklyStatus.find((s) => s.weekNumber === w);
                      return (
                        <td key={w} className="px-3 py-3 text-center">
                          {ws?.submitted ? (
                            <span className="text-primary text-xs font-medium">Done</span>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {p.lastActivityAt
                        ? new Date(p.lastActivityAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                        : "None"}
                    </td>
                    <td className="px-3 py-3">
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="rounded border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-xs text-amber-800">
            The amber indicator marks participants with no recorded activity in 7 or more days.
            This is a participation monitoring flag only and does not constitute a clinical assessment of any kind.
          </p>
        </div>
      </div>
    </Layout>
  );
}
