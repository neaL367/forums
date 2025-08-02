"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { authClient } from "@/lib/auth-client";

export default function PasswordSettingsPage() {
  const { data: session } = authClient.useSession();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Change Password</CardTitle>
        <p className="text-sm text-muted-foreground">
          Update your password to keep your account secure.
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
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
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-muted-foreground"
            >
              Confirm New Password
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="mt-1"
              required
              placeholder="Confirm your new password"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              Update Password
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
