export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" h-[80dvh] flex items-center justify-center">
      {children}
    </div>
  );
}
