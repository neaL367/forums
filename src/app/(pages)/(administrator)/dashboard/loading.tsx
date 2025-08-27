import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto p-6 my-10 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage users, roles, and system administration
        </p>
      </div>

      <div className="min-h-[60dvh] flex items-center justify-center flex-1 py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    </div>
  );
}
