import Header from "@/components/Header";

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 bg-white">
        {children}
      </div>
      <footer className="bg-primary-900 text-white py-12 text-center mt-auto">
        <p className="font-display text-2xl font-bold mb-4">SILK & WEAVE</p>
        <p className="text-white/60 text-sm">© {new Date().getFullYear()} Silk & Weave. All rights reserved.</p>
      </footer>
    </div>
  );
}
