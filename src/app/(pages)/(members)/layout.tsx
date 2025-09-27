export default function MembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="w-full max-w-[1680px] mx-auto p-6 my-10">{children}</div>
    </div>
  );
}
