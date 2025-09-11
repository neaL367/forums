import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTopicsByName } from "@/database/topics";

export default async function Topics({ query }: { query: string }) {
  const filteredTopics = await getTopicsByName(query);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Topics ({filteredTopics.length})</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {filteredTopics.length > 0 ? (
          filteredTopics.map((topic) => (
            <Link
              key={topic.id}
              href={{ pathname: "/topics/[id]", query: { id: topic.id } }}
              className="block hover:bg-muted/50 p-2 rounded-md transition-colors"
            >
              <p className="font-medium">{topic.title}</p>
            </Link>
          ))
        ) : (
          <p className="text-muted-foreground">
            No topics found for &quot;{query}&quot;.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
