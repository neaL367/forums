export default function MembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100dvh-6rem)]">
      {children}
    </div>
  );
}