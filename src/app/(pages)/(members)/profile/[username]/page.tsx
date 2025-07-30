import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
// import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Mail } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { getUserByUsername } from "@/services/user";

// export async function generateStaticParams() {
//   const users: User[] = await getAllUsers();
//   return users.map((u) => ({
//     slug: u.username,
//   }));
// }

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username: username } = await params;
  if (!username) return notFound();

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return notFound();

  const user = await getUserByUsername(username);
  if (!user) return notFound();

  return (
    <Card className="z-50 rounded-md rounded-t-none min-w-xl">
      <CardHeader>
        <CardTitle className="text-lg">Account Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 gap-x-10">
          <div>
            <label className="text-sm font-medium text-muted-foreground flex gap-2.5">
              Username
              <Badge>
                {" "}
                {user.role.charAt(0).toUpperCase() +
                  user.role.slice(1).toLowerCase()}
              </Badge>
            </label>
            <div className="flex items-center gap-3.5 mt-1">
              {/* <Avatar>
                {user.avatarUrl ? (
                  <AvatarImage
                    src={user.avatarUrl}
                    alt={`${user.displayUsername}'s avatar`}
                  />
                ) : (
                  <AvatarFallback>
                    {user.displayUsername.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar> */}
              <p className="text-sm mt-1">{user.displayUsername}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground flex gap-2.5">
              Email
              {user.emailVerified ? (
                <Badge
                  variant="secondary"
                  className="bg-green-500 text-white dark:bg-green-600"
                >
                  Verified
                  {/* <BadgeCheckIcon /> */}
                </Badge>
              ) : (
                <Link href="/verification-email" className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-red-500 text-white dark:bg-red-600"
                  >
                    {/* <XCircle className="h-4 w-4" /> */}
                    Not Verified
                  </Badge>
                </Link>
              )}
            </label>
            <div className="flex items-center gap-2 mt-1">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{user.email}</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Account Created
            </label>
            <p className="text-sm mt-1">
              {format(new Date(user.createdAt), "yyyy-MM-dd")}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Last Updated
            </label>
            <p className="text-sm mt-1">
              {format(new Date(user.updatedAt), "yyyy-MM-dd")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
