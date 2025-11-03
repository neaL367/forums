import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { useForm } from "@/hooks/use-form";
import { changeUsernameAction } from "@/actions/account-settings/change-username";

import type {
  ChangeUsernameFormData,
  ChangeUsernameFormState,
} from "@/formdata/account-setting/change-username";

const initialState: ChangeUsernameFormState = {
  success: false,
  message: "",
};

export function UsernameSettingsForm() {
  const { state, formAction, pending, session } =
    useForm<ChangeUsernameFormData>({
      action: changeUsernameAction,
      initialState,
      loadingMessage: "Updating your username...",
      awaitSession: true,
    });

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
        <form action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="text-sm font-medium text-muted-foreground"
            >
              Username
            </label>
            <Input
              id="username"
              name="username"
              defaultValue={
                state.inputs?.username ??
                session?.user.username ??
                ""
              }
              className="mt-1"
              required
              placeholder="Enter your username"
              disabled={pending}
            />
            {state.errors?.username && (
              <p className="text-xs text-red-500 mt-1">
                {state.errors.username[0]}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              This is your unique login username
            </p>
          </div>

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
