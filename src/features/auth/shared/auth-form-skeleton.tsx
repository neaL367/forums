import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AuthFormSkeleton() {
  return (
    <Card className="z-50 rounded-md rounded-t-none min-w-lg">
      <CardHeader>
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {/* Input field skeleton */}
          <div className="grid gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          
          {/* Another input field skeleton (optional, for forms with multiple inputs) */}
          <div className="grid gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          
          {/* Submit button skeleton */}
          <Skeleton className="h-10 w-full" />
          
          {/* Back button skeleton */}
          <Skeleton className="h-10 w-full mt-4" />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-center w-full border-t py-4">
          <Skeleton className="h-3 w-48" />
        </div>
      </CardFooter>
    </Card>
  );
}