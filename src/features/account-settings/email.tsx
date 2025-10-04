"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useActionState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { authClient } from "@/lib/auth-client";
import { changeEmailAction } from "@/actions/account-settings/change-email";
import type { ChangeEmailFormState } from "@/formdata/account-setting/change-email";

const initialState: ChangeEmailFormState = {
  success: false,
  message: "",
};

export function EmailSettingsForm() {
  const router = useRouter();
  const { data: session, refetch } = authClient.useSession();
  
  const loadingToastRef = useRef<string | number | null>(null);

  const [state, action, pending] = useActionState(
    async (prevState: ChangeEmailFormState, formData: FormData) => {
      loadingToastRef.current = toast.loading("Updating your email address...");
      return await changeEmailAction(prevState, formData);
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
        <CardTitle className="text-lg">Change Email</CardTitle>
        <p className="text-sm text-muted-foreground">
          Update your email address. You&apos;ll need to verify the new email.
        </p>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <input type="hidden" name="userId" value={session?.user.id ?? ""} />

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Current Email
            </label>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm">{session?.user.email}</span>
              {session?.user.emailVerified ? (
                <Badge
                  variant="secondary"
                  className="bg-green-500 dark:bg-green-100 text-green-800"
                >
                  Verified
                </Badge>
              ) : (
                <Link href="/auth/verification-email">
                  <Badge
                    variant="secondary"
                    className="bg-red-500 text-white dark:bg-red-600 text-xs"
                  >
                    Not Verified
                  </Badge>
                </Link>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="newEmail"
              className="text-sm font-medium text-muted-foreground"
            >
              New Email Address
            </label>
            <Input
              id="newEmail"
              name="newEmail"
              type="email"
              placeholder="Enter your new email address"
              className="mt-1"
              required
              disabled={pending}
              defaultValue={state.inputs?.newEmail ?? ""}
            />
            {state.errors?.newEmail && (
              <p className="text-xs text-red-500 mt-1">
                {state.errors.newEmail[0]}
              </p>
            )}
          </div>

          <Button type="submit" className="flex-1" disabled={pending}>
            {pending ? "Updating..." : "Update Email"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}