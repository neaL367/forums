export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="min-h-[90dvh] flex justify-center items-center">{children}</section>;
}
