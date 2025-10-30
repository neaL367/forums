import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useActionState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { changeUsernameAction } from "@/actions/account-settings/change-username";
import type { ChangeUsernameFormState } from "@/formdata/account-setting/change-username";

const initialState: ChangeUsernameFormState = {
  success: false,
  message: "",
};

export function UsernameSettingsForm() {
  const router = useRouter();
  const { data: session, refetch } = authClient.useSession();
  
  const loadingToastRef = useRef<string | number | null>(null);

  const [state, action, pending] = useActionState(
    async (prevState: ChangeUsernameFormState, formData: FormData) => {
      loadingToastRef.current = toast.loading("Updating your username...");
      return await changeUsernameAction(prevState, formData);
    },
    initialState
  );

  useEffect(() => {
    if (state?.message) {
      if (loadingToastRef.current) {
        toast.dismiss(loadingToastRef.current);
        loadingToastRef.current = null;
      }

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
    <Card className="from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs">
      <CardHeader>
        <CardTitle className="text-lg">Change Username</CardTitle>
        <p className="text-sm text-muted-foreground">
          Update your username. This will change how others see you on the
          platform.
        </p>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div>
            <label
              htmlFor="displayUsername"
              className="text-sm font-medium text-muted-foreground"
            >
              Display Username
            </label>
            <Input
              id="displayUsername"
              name="displayUsername"
              defaultValue={
                state.inputs?.displayUsername ??
                session?.user.displayUsername ??
                ""
              }
              className="mt-1"
              required
              placeholder="Enter your display username"
              disabled={pending}
            />
            {state.errors?.displayUsername && (
              <p className="text-xs text-red-500 mt-1">
                {state.errors.displayUsername[0]}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              This is how your name will appear to other users
            </p>
          </div>

          <Button type="submit" className="flex-1" disabled={pending}>
            {pending ? "Updating..." : "Update Username"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}