import { Members } from "@/features/search/members/members";
import { Forums } from "@/features/search/forums/forums";
import { Topics } from "@/features/search/topics/topics";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const query = typeof params.query === "string" ? params.query : "";
  const type = typeof params.type === "string" ? params.type : "all";
  
  return (
    <div className="max-w-[1680px] mx-auto px-4 py-8 md:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:gap-8">
        <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3 md:grid-cols-2">
        {(type === "all" || type === "members") && (
          <Members query={query} />
        )}

        {(type === "all" || type === "forums") && (
          <Forums query={query} />
        )}

        {(type === "all" || type === "topics") && (
          <Topics query={query} />
        )}
      </div>
    </div>
  );
}
