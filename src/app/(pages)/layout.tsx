export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-black">{children}</div>;
}
