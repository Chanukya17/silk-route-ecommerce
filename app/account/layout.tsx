import Link from "next/link";
import Header from "@/components/Header";
import { User, ShoppingBag, Heart, MapPin, LogOut } from "lucide-react";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-secondary-light">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-secondary/20">
              <h2 className="font-display font-bold text-xl text-primary-900 mb-6">My Account</h2>
              
              <nav className="space-y-2">
                <Link href="/account" className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary-700 hover:bg-secondary/50 hover:text-primary-900 transition-colors">
                  <User className="w-5 h-5" /> Dashboard
                </Link>
                <Link href="/account/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary-700 hover:bg-secondary/50 hover:text-primary-900 transition-colors">
                  <ShoppingBag className="w-5 h-5" /> Orders
                </Link>
                <Link href="/account/wishlist" className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary-700 hover:bg-secondary/50 hover:text-primary-900 transition-colors">
                  <Heart className="w-5 h-5" /> Wishlist
                </Link>
                <Link href="/account/addresses" className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary-700 hover:bg-secondary/50 hover:text-primary-900 transition-colors">
                  <MapPin className="w-5 h-5" /> Addresses
                </Link>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-accent hover:bg-accent/10 transition-colors mt-4">
                  <LogOut className="w-5 h-5" /> Sign Out
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-2xl p-8 shadow-sm border border-secondary/20">
            {children}
          </div>
          
        </div>
      </main>
    </div>
  );
}
