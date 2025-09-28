export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col gap-6 items-center justify-center bg-black">
      <div className="flex space-x-3">
        <span className="w-3 h-3 rounded-full bg-white/50 animate-ping" />
        <span className="w-3 h-3 rounded-full bg-white/75 animate-ping [animation-delay:200ms]" />
        <span className="w-3 h-3 rounded-full bg-white animate-ping [animation-delay:400ms]" />
      </div>
      <span className="text-sm font-semibold text-white tracking-widest animate-pulse">
        LOADING
      </span>
    </div>
  );
}
