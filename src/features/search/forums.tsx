import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getForumsByTitle } from "@/database/forums";

export default async function Forums({ query }: { query: string }) {
  const filteredForums = await getForumsByTitle(query);

  return (
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
  );
}
