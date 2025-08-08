import Link from "next/link";
import { format } from "date-fns";
import { Suspense } from "react";
import Search from "@/components/header/search";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserByUsername } from "@/dal/user";

export default async function SearchPage(props: {
  searchParams?: Promise<{
    query?: string;
    type?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const searchType = searchParams?.type || "all";

  const filteredUsers = await getUserByUsername(query);

  // const filteredForums = allForums.filter(
  //   (forum) =>
  //     forum.title.toLowerCase().includes(query.toLowerCase()) ||
  //     forum.description.toLowerCase().includes(query.toLowerCase())
  // );

  // const filteredTopics = allTopics.filter(
  //   (topic) =>
  //     topic.title.toLowerCase().includes(query.toLowerCase()) ||
  //     topic.author.toLowerCase().includes(query.toLowerCase())
  // );

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:gap-8">
        <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
        <Suspense fallback={<div>Loading search bar...</div>}>
          <Search />
        </Suspense>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3 md:grid-cols-2">
        {(searchType === "all" || searchType === "members") && (
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
                      <AvatarImage
                        src={user.image || ""}
                        alt={user.displayUsername}
                      />
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
        )}

        {/* {(searchType === "all" || searchType === "forums") && (
          <Card>
            <CardHeader>
              <CardTitle>Forums ({filteredForums.length})</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {filteredForums.length > 0 ? (
                filteredForums.map((forum) => (
                  <Link
                    key={forum.id}
                    href={`/forums/${forum.id}`}
                    className="block hover:bg-muted/50 p-2 rounded-md transition-colors"
                  >
                    <p className="font-medium">{forum.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {forum.description}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="text-muted-foreground">
                  No forums found for &quot;{query}&quot;.
                </p>
              )}
            </CardContent>
          </Card>
        )} */}

        {/* {(searchType === "all" || searchType === "topics") && (
          <Card>
            <CardHeader>
              <CardTitle>Topics ({filteredTopics.length})</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {filteredTopics.length > 0 ? (
                filteredTopics.map((topic) => (
                  <Link
                    key={topic.id}
                    href={`/topics/${topic.id}`}
                    className="block hover:bg-muted/50 p-2 rounded-md transition-colors"
                  >
                    <p className="font-medium">{topic.title}</p>
                    <p className="text-sm text-muted-foreground">
                      By {topic.author} &middot; {topic.replies} replies
                    </p>
                  </Link>
                ))
              ) : (
                <p className="text-muted-foreground">
                  No topics found for &quot;{query}&quot;.
                </p>
              )}
            </CardContent>
          </Card>
        )} */}
      </div>
    </div>
  );
}
