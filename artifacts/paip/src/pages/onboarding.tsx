import { useState } from "react";
import { useCompleteOnboarding, getGetMyParticipantProfileQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Shield, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const ACKNOWLEDGMENTS = [
  "I understand that this program is not therapy, legal counsel, or a forensic evaluation.",
  "I understand that nothing in this program constitutes legal advice or implies any legal outcome.",
  "I understand that my participation data may be reviewed by my assigned clinician for program monitoring purposes only.",
  "I understand that this program does not collect details of alleged offenses, victim information, or case facts.",
  "I understand that AI-generated feedback in this program is for reflective purposes only and is not for court use.",
  "I affirm that I will engage with this material honestly and to the best of my ability.",
];

const RELATIONSHIP_OPTIONS = [
  "Single",
  "Married/partnered",
  "Separated/divorcing",
  "Other",
];

type Step = "acknowledgments" | "relationship" | "complete";

export default function Onboarding() {
  const [step, setStep] = useState<Step>("acknowledgments");
  const [checked, setChecked] = useState<boolean[]>(new Array(ACKNOWLEDGMENTS.length).fill(false));
  const [relationshipStatus, setRelationshipStatus] = useState("");
  const [otherRelationshipStatus, setOtherRelationshipStatus] = useState("");
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { mutate: completeOnboarding, isPending } = useCompleteOnboarding({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMyParticipantProfileQueryKey() });
        setStep("complete");
      },
    },
  });

  const allChecked = checked.every(Boolean);
  const finalRelationshipStatus =
    relationshipStatus === "Other" ? otherRelationshipStatus.trim() : relationshipStatus;

  const relationshipReady =
    relationshipStatus.length > 0 &&
    (relationshipStatus !== "Other" || otherRelationshipStatus.trim().length > 1);

  function toggleCheck(i: number) {
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  }

  function handleSubmit() {
    completeOnboarding({
      data: {
        acknowledgmentsAccepted: true,
        relationshipStatus: finalRelationshipStatus || "Not specified",
      },
    });
  }

  if (step === "complete") {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background p-6">
        <div className="max-w-md text-center space-y-6">
          <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Onboarding complete</h2>
            <p className="text-sm text-muted-foreground">
              You have accepted the program acknowledgments and may now begin Week 1.
            </p>
          </div>
          <Button onClick={() => setLocation("/participant/dashboard")} data-testid="button-go-to-dashboard">
            Continue to program
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-lg space-y-8">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-primary rounded-sm flex items-center justify-center shrink-0">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Program Acknowledgments</h1>
            <p className="text-xs text-muted-foreground">
              {step === "acknowledgments" ? "Step 1 of 2 — Acknowledgments" : "Step 2 of 2 — Relationship status"}
            </p>
          </div>
        </div>

        {step === "acknowledgments" && (
          <>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Before proceeding, please read and check each of the following statements. All must be acknowledged to continue.
              </p>
              <div className="space-y-3">
                {ACKNOWLEDGMENTS.map((text, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <Checkbox
                      id={`ack-${i}`}
                      checked={checked[i]}
                      onCheckedChange={() => toggleCheck(i)}
                      data-testid={`checkbox-ack-${i}`}
                      className="mt-0.5 shrink-0"
                    />
                    <Label htmlFor={`ack-${i}`} className="text-sm text-foreground leading-relaxed cursor-pointer">
                      {text}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setStep("relationship")}
              disabled={!allChecked}
              className="w-full"
              data-testid="button-next-step"
            >
              Continue
            </Button>
          </>
        )}

        {step === "relationship" && (
          <>
            <div className="space-y-5">
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Current relationship status</p>
                <p className="text-xs text-muted-foreground">
                  This information is used for program context only. It is not shared beyond your assigned clinician.
                </p>
              </div>

              <RadioGroup
                value={relationshipStatus}
                onValueChange={(value) => {
                  setRelationshipStatus(value);
                  if (value !== "Other") setOtherRelationshipStatus("");
                }}
                className="space-y-3"
                data-testid="radio-relationship-status"
              >
                {RELATIONSHIP_OPTIONS.map((option) => (
                  <div key={option} className="flex items-center space-x-3">
                    <RadioGroupItem value={option} id={`relationship-${option}`} />
                    <Label htmlFor={`relationship-${option}`} className="text-sm text-foreground cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {relationshipStatus === "Other" && (
                <div className="space-y-2">
                  <Label htmlFor="relationship-other" className="text-sm font-medium text-foreground">
                    Please describe your relationship status
                  </Label>
                  <Input
                    id="relationship-other"
                    value={otherRelationshipStatus}
                    onChange={(e) => setOtherRelationshipStatus(e.target.value)}
                    placeholder="Enter relationship status"
                    data-testid="input-relationship-status-other"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("acknowledgments")} className="flex-1" data-testid="button-back">
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isPending || !relationshipReady}
                className="flex-1"
                data-testid="button-submit-onboarding"
              >
                {isPending ? "Submitting…" : "Complete onboarding"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
