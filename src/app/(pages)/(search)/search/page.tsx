import Members from "@/features/search/members";
import Forums from "@/features/search/forums";
import Topics from "@/features/search/topics";

export default async function SearchPage(props: {
  searchParams?: Promise<{
    query?: string;
    type?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const searchType = searchParams?.type || "all";

  return (
    <div className="max-w-[1680px] mx-auto px-4 py-8 md:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:gap-8">
        <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3 md:grid-cols-2">
        {(searchType === "all" || searchType === "members") && (
          <Members query={query} />
        )}

        {(searchType === "all" || searchType === "forums") && (
          <Forums query={query} />
        )}

        {(searchType === "all" || searchType === "topics") && (
          <Topics query={query} />
        )}
      </div>
    </div>
  );
}
