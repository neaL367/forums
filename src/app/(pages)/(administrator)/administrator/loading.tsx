import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[66dvh]">
      <Skeleton className="h-[66dvh] w-full rounded-xl" />
    </div>
  );
}
