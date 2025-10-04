"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { authClient } from "@/lib/auth-client";
import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { changePasswordAction } from "@/actions/account-settings/change-password";
import { ChangePasswordFormState } from "@/formdata/account-setting/change-password";

const initialState: ChangePasswordFormState = {
  success: false,
  message: "",
};

export function PasswordSettingsForm() {
  const router = useRouter();
  const { data: session, refetch } = authClient.useSession();
  
  const loadingToastRef = useRef<string | number | null>(null);

  const [state, action, pending] = useActionState(
    async (prevState: ChangePasswordFormState, formData: FormData) => {
      loadingToastRef.current = toast.loading("Updating your password...");
      return await changePasswordAction(prevState, formData);
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
  }, [state, refetch, router]);

  return (
    <Card className="from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs">
      <CardHeader>
        <CardTitle className="text-lg">Change Password</CardTitle>
        <p className="text-sm text-muted-foreground">
          Update your password to keep your account secure.
        </p>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <input type="hidden" name="userId" value={session?.user.id ?? ""} />

          <div>
            <label
              htmlFor="currentPassword"
              className="text-sm font-medium text-muted-foreground"
            >
              Current Password
            </label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              className="mt-1"
              required
              placeholder="Enter your current password"
            />
            {state.errors?.currentPassword && (
              <p className="text-xs text-red-500 mt-1">
                {state.errors.currentPassword[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="text-sm font-medium text-muted-foreground"
            >
              New Password
            </label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              className="mt-1"
              required
              placeholder="Enter your new password"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Password must be at least 8 characters long
            </p>
            {state.errors?.newPassword && (
              <p className="text-xs text-red-500 mt-1">
                {state.errors.newPassword[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="newPasswordConfirmation"
              className="text-sm font-medium text-muted-foreground"
            >
              Confirm New Password
            </label>
            <Input
              id="newPasswordConfirmation"
              name="newPasswordConfirmation"
              type="password"
              className="mt-1"
              required
              placeholder="Confirm your new password"
            />
            {state.errors?.newPasswordConfirmation && (
              <p className="text-xs text-red-500 mt-1">
                {state.errors.newPasswordConfirmation[0]}
              </p>
            )}
          </div>

          <Button type="submit" className="flex-1" disabled={pending}>
            {pending ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}