import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6 items-center justify-center bg-black min-h-[80dvh]">
      <Loader2 className="w-10 h-10 animate-spin" />
    </div>
  );
}
