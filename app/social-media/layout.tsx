export default async function SocialMediaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-7xl px-4">
        <main className="py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
