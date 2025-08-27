import Link from "next/link";
import { User, Mail, Lock, Edit, ChevronRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { verifySession } from "@/lib/dal";

export default async function AccountOverview() {
  const session = await verifySession();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Card className="from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-5 items-center justify-between">
              <div className="flex flex-col sm:flex-row text-center sm:text-start items-center gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium">Username</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground">
                      Display: {session?.user.displayUsername}
                    </span>
                  </div>
                </div>
              </div>
              <Link href="/account-settings/username">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-5 items-center justify-between">
              <div className="flex flex-col sm:flex-row text-center sm:text-start items-center gap-4">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium flex sm:flex-row flex-col-reverse items-center sm:items-start  gap-2.5">
                    Email Address{" "}
                    {session?.user.emailVerified ? (
                      <Badge
                        variant="secondary"
                        className="bg-green-500 dark:bg-green-100 text-green-800 text-xs"
                      >
                        Verified
                      </Badge>
                    ) : (
                      <Link href="/verification-email">
                        <Badge
                          variant="secondary"
                          className="bg-red-500 text-white dark:bg-red-600 text-xs"
                        >
                          Not Verified
                        </Badge>
                      </Link>
                    )}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground">
                      {session?.user.email}
                    </span>
                  </div>
                </div>
              </div>
              <Link href="/account-settings/email">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-5 items-center justify-between">
              <div className="flex flex-col sm:flex-row text-center sm:text-start items-center gap-4">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                  <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-medium">Password</h3>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                    <span className="text-sm text-muted-foreground font-mono">
                      ••••••••••••
                    </span>
                    {/* <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {" "}
                      Last Updated:{" "}
                    </span> */}
                  </div>
                </div>
              </div>
              <Link href="/account-settings/password">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent"
                >
                  <Edit className="w-4 h-4" />
                  Change
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
