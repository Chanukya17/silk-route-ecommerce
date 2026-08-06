"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { User, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function UserDropdown() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  if (status === "loading") {
    return <div className="w-9 h-9 rounded-full bg-secondary animate-pulse" />;
  }

  if (!session) {
    return (
      <button 
        onClick={() => signIn()}
        className="p-2 hover:bg-secondary/30 rounded-full transition-colors flex items-center gap-2"
      >
        <User className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setOpen(!open)}
        className="w-9 h-9 flex items-center justify-center bg-accent text-white rounded-full font-bold uppercase"
      >
        {session.user?.name?.[0] || session.user?.email?.[0] || 'U'}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-secondary/20 py-2 z-50">
          <div className="px-4 py-2 border-b border-secondary/30 mb-2">
            <p className="font-semibold text-primary-900 truncate">{session.user?.name}</p>
            <p className="text-xs text-primary-600 truncate">{session.user?.email}</p>
          </div>
          
          <Link 
            href="/account" 
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-primary-800 hover:bg-secondary-light"
          >
            <LayoutDashboard className="w-4 h-4" /> My Account
          </Link>
          
          <button 
            onClick={() => signOut()}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-accent hover:bg-secondary-light text-left"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
