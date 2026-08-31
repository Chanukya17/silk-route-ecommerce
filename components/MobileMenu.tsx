"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className="md:hidden p-2 text-primary-900" 
        onClick={() => setIsOpen(true)}
        aria-label="Open mobile menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col p-6 animate-in slide-in-from-right-1/2">
          <div className="flex justify-between items-center mb-8">
            <span className="font-display text-2xl font-bold tracking-tight text-primary-800">
              SILK & WEAVE
            </span>
            <button 
              className="p-2 text-primary-900" 
              onClick={() => setIsOpen(false)}
              aria-label="Close mobile menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex flex-col gap-6 text-lg font-medium text-primary-900">
            <Link href="/handloom?sort=newest" onClick={() => setIsOpen(false)} className="border-b border-secondary/20 pb-4 hover:text-accent">New Arrivals</Link>
            <Link href="/handloom" onClick={() => setIsOpen(false)} className="border-b border-secondary/20 pb-4 hover:text-accent">Handloom</Link>
            <Link href="/powerloom" onClick={() => setIsOpen(false)} className="border-b border-secondary/20 pb-4 hover:text-accent">Powerloom</Link>
            <Link href="/#shop" onClick={() => setIsOpen(false)} className="hover:text-accent">Collections</Link>
          </nav>
        </div>
      )}
    </>
  );
}
