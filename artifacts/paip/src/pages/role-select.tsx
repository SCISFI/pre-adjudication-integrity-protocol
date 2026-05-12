import { useUpdateMyRole, getGetMyProfileQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RoleSelect() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { mutate: updateRole, isPending } = useUpdateMyRole({
    mutation: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: getGetMyProfileQueryKey() });

        if (data.role === "participant") {
          setLocation("/onboarding");
        } else if (data.role === "clinician" || data.role === "clinical_admin") {
          setLocation("/clinician/dashboard");
        }
      },
    },
  });

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-lg space-y-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary rounded-sm flex items-center justify-center shrink-0">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Pre-Adjudication Integrity Protocol
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Development/testing role selection.
            </p>
          </div>
        </div>

        <div className="rounded border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-xs text-amber-800">
            Development/testing only: role switching is included so the MVP can be tested.
            In production, participants must never be able to switch into clinician or admin access.
          </p>
        </div>

        <div className="space-y-3">
          <button
            data-testid="role-participant"
            onClick={() => updateRole({ data: { role: "participant" } })}
            disabled={isPending}
            className="w-full text-left p-5 rounded border border-border bg-card hover:bg-muted/50 transition-colors disabled:opacity-50 group"
          >
            <p className="font-medium text-foreground group-hover:text-primary">I am a Participant</p>
            <p className="text-sm text-muted-foreground mt-1">
              I am enrolled in this program and will complete weekly reflections and daily check-ins.
            </p>
          </button>

          <button
            data-testid="role-clinician"
            onClick={() => updateRole({ data: { role: "clinician" } })}
            disabled={isPending}
            className="w-full text-left p-5 rounded border border-border bg-card hover:bg-muted/50 transition-colors disabled:opacity-50 group"
          >
            <p className="font-medium text-foreground group-hover:text-primary">I am a Clinician</p>
            <p className="text-sm text-muted-foreground mt-1">
              I supervise assigned participant activity and generate participation summaries.
            </p>
          </button>

          <button
            data-testid="role-clinical-admin"
            onClick={() => updateRole({ data: { role: "clinician" } })}
            disabled={isPending}
            className="w-full text-left p-5 rounded border border-border bg-card hover:bg-muted/50 transition-colors disabled:opacity-50 group"
          >
            <p className="font-medium text-foreground group-hover:text-primary">Clinical Admin Test View</p>
            <p className="text-sm text-muted-foreground mt-1">
              Development/testing only. Production admin access will be separated later.
            </p>
          </button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          This screen is for MVP testing. Production role assignment must be controlled administratively.
        </p>
      </div>
    </div>
  );
}
