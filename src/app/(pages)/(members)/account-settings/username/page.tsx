"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useActionState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { UsernameSettingsAction } from "@/actions/account-settings/username";
import type { UsernameFormState } from "@/models/account-setting/username";

const initialState: UsernameFormState = {
  success: false,
  message: "",
};

export default function UsernameSettingsPage() {
  const router = useRouter();
  
  const { data: session, refetch } = authClient.useSession();
  const [state, action, pending] = useActionState(UsernameSettingsAction, initialState)

   useEffect(() => {
      if (state?.message) {
        if (state.success) {
          toast.success(state.message);
          
          router.push("/account-settings");
          refetch();
        } else {
          toast.error(state.message);
        }
      }
    }, [refetch, router, state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Change Username</CardTitle>
        <p className="text-sm text-muted-foreground">
          Update your username. This will change how others see you on the platform.
        </p>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div>
            <label htmlFor="displayUsername" className="text-sm font-medium text-muted-foreground">
              Display Username
            </label>
            <Input
              id="displayUsername"
              name="displayUsername"
              defaultValue={state.inputs?.displayUsername ?? session?.user.displayUsername ?? ""}
              className="mt-1"
              required
              placeholder="Enter your display username"
              disabled={pending}
            />
            {state.errors?.displayUsername && (
              <p className="text-xs text-red-500 mt-1">{state.errors.displayUsername[0]}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">This is how your name will appear to other users</p>
          </div>

          <Button type="submit" className="flex-1" disabled={pending}>
            {pending ? "Updating..." : "Update Username"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
