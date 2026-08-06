import { getServerSession } from "next-auth/next";
import Link from "next/link";
import Header from "@/components/Header";
import { LayoutDashboard, Tag, PackageSearch, ClipboardList, ShieldAlert } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  
  // Protect route
  if (!session?.user || session.user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex flex-col bg-secondary-light">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-secondary/20 max-w-md">
            <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-primary-900 mb-2">Access Denied</h1>
            <p className="text-primary-600 mb-6">You do not have permission to view this page. Administrator privileges are required.</p>
            <Link href="/" className="bg-primary-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-800 transition-colors">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-secondary-light">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Admin Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-primary-900 rounded-2xl p-6 shadow-sm text-white sticky top-24">
              <h2 className="font-display font-bold text-xl mb-6">Admin Panel</h2>
              
              <nav className="space-y-2">
                <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-800 transition-colors">
                  <LayoutDashboard className="w-5 h-5" /> Dashboard
                </Link>
                <Link href="/admin/taxonomy" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-800 transition-colors">
                  <Tag className="w-5 h-5" /> Taxonomy
                </Link>
                <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-800 transition-colors">
                  <PackageSearch className="w-5 h-5" /> Products
                </Link>
                <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-800 transition-colors">
                  <ClipboardList className="w-5 h-5" /> Orders
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main Admin Content */}
          <div className="flex-1">
            {children}
          </div>
          
        </div>
      </main>
    </div>
  );
}
