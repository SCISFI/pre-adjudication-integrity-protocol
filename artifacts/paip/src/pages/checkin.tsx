import { useState } from "react";
import { useGetTodayCheckin, useSubmitCheckin, getGetTodayCheckinQueryKey, getListMyCheckinsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function Checkin() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [response, setResponse] = useState("");
  const { data: todayCheckin, isLoading } = useGetTodayCheckin({ query: { queryKey: getGetTodayCheckinQueryKey() } });
  const { mutate: submitCheckin, isPending } = useSubmitCheckin({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetTodayCheckinQueryKey() });
        queryClient.invalidateQueries({ queryKey: getListMyCheckinsQueryKey() });
        setResponse("");
      },
    },
  });

  const alreadySubmitted = todayCheckin?.submitted;

  return (
    <Layout>
      <div className="space-y-6 max-w-xl">
        <div className="space-y-2">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/dashboard")} className="gap-1.5 -ml-2">
            <ArrowLeft className="h-4 w-4" /> Return to Main Menu
          </Button>
          <h2 className="text-xl font-semibold text-foreground">Daily Check-in</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {isLoading && (
          <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">Loading…</div>
        )}

        {!isLoading && alreadySubmitted && todayCheckin.checkin && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-primary">
              <CheckCircle2 className="h-4 w-4" />
              <span>Today's check-in submitted</span>
            </div>
            <div className="rounded border border-border p-5 bg-card">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Your response</p>
              <p className="text-sm text-foreground leading-relaxed">
                {(todayCheckin.checkin as { reflectionResponse: string }).reflectionResponse}
              </p>
            </div>
          </div>
        )}

        {!isLoading && !alreadySubmitted && (
          <div className="space-y-5">
            <div className="rounded border border-border p-5 bg-muted/30">
              <p className="text-sm font-medium text-foreground">
                What is one honest thing you are holding today?
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Reflect on your current state of mind, your commitments, or what is present for you right now.
              </p>
            </div>

            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Write your response here…"
              className="min-h-[140px] resize-none"
              data-testid="textarea-checkin-response"
            />

            <Button
              onClick={() => submitCheckin({ data: { reflectionResponse: response.trim() } })}
              disabled={isPending || response.trim().length < 10}
              className="w-full"
              data-testid="button-submit-checkin"
            >
              {isPending ? "Submitting…" : "Submit check-in"}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Daily check-ins are visible to your assigned clinician for program monitoring purposes only.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
