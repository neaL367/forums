"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";

export default function EmailSettingsPage() {
  const { data: session } = authClient.useSession();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Change Email</CardTitle>
        <p className="text-sm text-muted-foreground">
          Update your email address. You&apos;ll need to verify the new email.
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
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
                <Badge
                  variant="secondary"
                  className="bg-red-500 text-white dark:bg-red-600"
                >
                  Not Verified
                </Badge>
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
              className="mt-1"
              required
              placeholder="Enter your new email address"
            />
            <p className="text-xs text-muted-foreground mt-1">
              A verification email will be sent to this address
            </p>
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-muted-foreground"
            >
              Confirm Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              className="mt-1"
              required
              placeholder="Enter your password to confirm"
            />
          </div>

          <Button type="submit" className="flex-1">
            Update Email
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
