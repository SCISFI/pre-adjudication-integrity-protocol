import { useState } from "react";
import {
  useGetTodayCheckin,
  useSubmitCheckin,
  getGetTodayCheckinQueryKey,
  getListMyCheckinsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { CheckCircle2 } from "lucide-react";

const EMOTION_OPTIONS = [
  "Panic",
  "Shame",
  "Anger",
  "Fear",
  "Numbness",
  "Sadness",
  "Restlessness",
  "Defensiveness",
  "Loneliness",
  "Hopefulness",
  "Grounded",
  "Other",
];

const BODY_NEED_OPTIONS = [
  "Sleep",
  "Food",
  "Hydration",
  "Movement",
  "Medical care",
  "Rest",
  "Hygiene",
  "Substance avoidance",
  "Screen/device boundaries",
  "None selected",
];

function sliderLabel(value: number, low: string, high: string) {
  return `${value} / 5 — ${low} to ${high}`;
}

function toggleOption(current: string[], option: string, noneOption?: string) {
  if (option === noneOption) {
    return current.includes(option) ? [] : [option];
  }

  const withoutNone = noneOption
    ? current.filter((item) => item !== noneOption)
    : current;

  if (withoutNone.includes(option)) {
    return withoutNone.filter((item) => item !== option);
  }

  return [...withoutNone, option];
}

export default function Checkin() {
  const queryClient = useQueryClient();
  const [emotions, setEmotions] = useState<string[]>([]);
  const [emotionalStability, setEmotionalStability] = useState(3);
  const [physicalStability, setPhysicalStability] = useState(3);
  const [bodyNeeds, setBodyNeeds] = useState<string[]>([]);
  const [connection, setConnection] = useState(3);
  const [boundary, setBoundary] = useState("");
  const [supportAction, setSupportAction] = useState("");
  const [nextRightAction, setNextRightAction] = useState("");
  const [attested, setAttested] = useState(false);
  const { data: todayCheckin, isLoading } = useGetTodayCheckin({
    query: { queryKey: getGetTodayCheckinQueryKey() },
  });
  const { mutate: submitCheckin, isPending } = useSubmitCheckin({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetTodayCheckinQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: getListMyCheckinsQueryKey(),
        });
        setEmotions([]);
        setEmotionalStability(3);
        setPhysicalStability(3);
        setBodyNeeds([]);
        setConnection(3);
        setBoundary("");
        setSupportAction("");
        setNextRightAction("");
        setAttested(false);
      },
    },
  });

  const alreadySubmitted = todayCheckin?.submitted;
  const boundaryComplete = boundary.trim().length >= 5;
  const supportActionComplete = supportAction.trim().length >= 5;
  const nextRightActionComplete = nextRightAction.trim().length >= 5;
  const canSubmit =
    emotions.length > 0 &&
    bodyNeeds.length > 0 &&
    boundaryComplete &&
    supportActionComplete &&
    nextRightActionComplete &&
    attested;

  function buildCheckinResponse() {
    return [
      "Emotions present today",
      `Selected: ${emotions.join(", ")}`,
      "",
      "Emotional stability today",
      sliderLabel(emotionalStability, "Very unstable", "Grounded"),
      "",
      "Physical stability today",
      sliderLabel(physicalStability, "Very depleted", "Steady"),
      "",
      "Body needs attention",
      `Selected: ${bodyNeeds.join(", ")}`,
      "",
      "Connection versus isolation today",
      sliderLabel(
        connection,
        "Moving toward isolation",
        "Moving toward appropriate connection",
      ),
      "",
      "Boundary for today",
      boundary.trim(),
      "",
      "Support action",
      supportAction.trim(),
      "",
      "Next-right action",
      nextRightAction.trim(),
      "",
      "Completion attestation",
      "I completed this check-in honestly and without intentionally hiding what I know needs attention today.",
    ].join("\n");
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-xl">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Daily Check-in
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {isLoading && (
          <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
            Loading…
          </div>
        )}

        {!isLoading && alreadySubmitted && todayCheckin.checkin && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-primary">
              <CheckCircle2 className="h-4 w-4" />
              <span>Today's check-in submitted</span>
            </div>
            <div className="rounded border border-border p-5 bg-card">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Your response
              </p>
              <pre className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans">
                {
                  (todayCheckin.checkin as { reflectionResponse: string })
                    .reflectionResponse
                }
              </pre>
            </div>
          </div>
        )}

        {!isLoading && !alreadySubmitted && (
          <div className="space-y-6">
            <div className="rounded border border-border p-5 bg-muted/30 space-y-2">
              <p className="text-sm font-medium text-foreground">
                Structured daily self-attestation
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Do not enter offense details, victim names, investigative facts,
                illegal content descriptions, police facts, or legal strategy in
                this app. Legal questions belong with your attorney. Clinical
                treatment concerns belong with your licensed therapist or
                supervised clinical provider.
              </p>
            </div>

            <section className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-foreground">
                  Emotions present today
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Check what is present. This is self-attestation only, not a
                  score.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {EMOTION_OPTIONS.map((option) => (
                  <label
                    key={option}
                    className="flex items-start gap-3 rounded border border-border bg-card p-3 text-sm text-foreground"
                  >
                    <Checkbox
                      checked={emotions.includes(option)}
                      onCheckedChange={() =>
                        setEmotions((current) => toggleOption(current, option))
                      }
                      data-testid={`checkbox-emotion-${option.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                      className="mt-0.5"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="space-y-3 rounded border border-border bg-card p-5">
              <div className="space-y-1">
                <Label className="text-sm font-medium text-foreground">
                  Emotional stability today
                </Label>
                <p className="text-xs text-muted-foreground">
                  Very unstable → Grounded
                </p>
              </div>
              <Slider
                min={1}
                max={5}
                step={1}
                value={[emotionalStability]}
                onValueChange={([value]) => setEmotionalStability(value ?? 3)}
                data-testid="slider-emotional-stability"
              />
              <p className="text-xs text-muted-foreground">
                {sliderLabel(emotionalStability, "Very unstable", "Grounded")}
              </p>
            </section>

            <section className="space-y-3 rounded border border-border bg-card p-5">
              <div className="space-y-1">
                <Label className="text-sm font-medium text-foreground">
                  Physical stability today
                </Label>
                <p className="text-xs text-muted-foreground">
                  Very depleted → Steady
                </p>
              </div>
              <Slider
                min={1}
                max={5}
                step={1}
                value={[physicalStability]}
                onValueChange={([value]) => setPhysicalStability(value ?? 3)}
                data-testid="slider-physical-stability"
              />
              <p className="text-xs text-muted-foreground">
                {sliderLabel(physicalStability, "Very depleted", "Steady")}
              </p>
            </section>

            <section className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-foreground">
                  Body needs attention
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Check what needs attention today.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {BODY_NEED_OPTIONS.map((option) => (
                  <label
                    key={option}
                    className="flex items-start gap-3 rounded border border-border bg-card p-3 text-sm text-foreground"
                  >
                    <Checkbox
                      checked={bodyNeeds.includes(option)}
                      onCheckedChange={() =>
                        setBodyNeeds((current) =>
                          toggleOption(current, option, "None selected"),
                        )
                      }
                      data-testid={`checkbox-body-${option.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                      className="mt-0.5"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="space-y-3 rounded border border-border bg-card p-5">
              <div className="space-y-1">
                <Label className="text-sm font-medium text-foreground">
                  Connection versus isolation today
                </Label>
                <p className="text-xs text-muted-foreground">
                  Moving toward isolation → Moving toward appropriate connection
                </p>
              </div>
              <Slider
                min={1}
                max={5}
                step={1}
                value={[connection]}
                onValueChange={([value]) => setConnection(value ?? 3)}
                data-testid="slider-connection"
              />
              <p className="text-xs text-muted-foreground">
                {sliderLabel(
                  connection,
                  "Moving toward isolation",
                  "Moving toward appropriate connection",
                )}
              </p>
            </section>

            <div className="space-y-2">
              <Label
                htmlFor="boundary"
                className="text-sm font-medium text-foreground"
              >
                Boundary for today
              </Label>
              <p className="text-xs text-muted-foreground">
                What boundary do I need to honor today?
              </p>
              <Textarea
                id="boundary"
                value={boundary}
                onChange={(e) => setBoundary(e.target.value)}
                placeholder="Write today's boundary…"
                className="min-h-[90px] resize-y"
                data-testid="textarea-boundary"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="support-action"
                className="text-sm font-medium text-foreground"
              >
                Support action
              </Label>
              <p className="text-xs text-muted-foreground">
                Who, if anyone, do I need to contact appropriately today, and
                what is appropriate to ask of them?
              </p>
              <Textarea
                id="support-action"
                value={supportAction}
                onChange={(e) => setSupportAction(e.target.value)}
                placeholder="Write an appropriate support action…"
                className="min-h-[90px] resize-y"
                data-testid="textarea-support-action"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="next-right-action"
                className="text-sm font-medium text-foreground"
              >
                Next-right action
              </Label>
              <p className="text-xs text-muted-foreground">
                What is one next-right action I will take today?
              </p>
              <Textarea
                id="next-right-action"
                value={nextRightAction}
                onChange={(e) => setNextRightAction(e.target.value)}
                placeholder="Write one concrete action for today…"
                className="min-h-[90px] resize-y"
                data-testid="textarea-next-right-action"
              />
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="checkin-attestation"
                checked={attested}
                onCheckedChange={(value) => setAttested(!!value)}
                className="mt-0.5"
                data-testid="checkbox-checkin-attestation"
              />
              <Label
                htmlFor="checkin-attestation"
                className="text-sm text-foreground leading-relaxed cursor-pointer"
              >
                I completed this check-in honestly and without intentionally
                hiding what I know needs attention today.
              </Label>
            </div>

            <Button
              onClick={() =>
                submitCheckin({
                  data: { reflectionResponse: buildCheckinResponse() },
                })
              }
              disabled={isPending || !canSubmit}
              className="w-full"
              data-testid="button-submit-checkin"
            >
              {isPending ? "Submitting…" : "Submit check-in"}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Daily check-ins are visible to your assigned clinician for program
              monitoring purposes only. Slider values are self-attestation only
              and are not scores, risk indicators, or relapse predictions.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
