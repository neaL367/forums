import Link from "next/link";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMemberByUsername } from "@/database/members";

export async function Members({ query }: { query: string }) {
  const filteredUsers = await getMemberByUsername(query);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Members ({filteredUsers.length})</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <Link
              key={user.id}
              href={`/profile/${user.id}`}
              className="flex items-center gap-3 hover:bg-muted/50 p-2 rounded-md transition-colors"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.image || ""} alt={user.displayUsername} />
                <AvatarFallback>
                  {user.displayUsername
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.displayUsername}</p>
                <p className="text-sm text-muted-foreground">
                  Joined At: {format(new Date(user.joinDate), "dd MMM yyyy")}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-muted-foreground">
            No members found for &quot;{query}&quot;.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
