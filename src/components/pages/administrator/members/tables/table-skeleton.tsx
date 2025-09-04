import { Skeleton } from "@/components/ui/skeleton";

export function MembersTableSkeleton() {
  return (
    <div className="mx-auto space-y-4">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 lg:p-6 bg-card/50 border-b">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <Skeleton className="h-10 w-80" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-20" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="overflow-hidden rounded-lg border">
        <div className="bg-muted sticky top-0 z-10">
          <div className="flex">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="p-4 flex-1">
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="divide-y">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex">
              {Array.from({ length: 8 }).map((_, j) => (
                <div key={j} className="p-4 flex-1">
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between px-4">
        <Skeleton className="h-4 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-8" />
          <Skeleton className="h-9 w-8" />
          <Skeleton className="h-9 w-8" />
          <Skeleton className="h-9 w-8" />
        </div>
      </div>
    </div>
  );
}