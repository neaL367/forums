export default function MembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="w-full max-w-7xl mx-auto">{children}</div>
    </div>
  );
}