"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { useEffect, useState } from "react";

export default function CartIcon() {
  const items = useCartStore((state) => state.items);
  // Prevent hydration mismatch by only rendering after mount
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <button className="relative p-2 hover:bg-secondary/30 rounded-full transition-colors">
      <ShoppingBag className="h-5 w-5" />
      {mounted && totalItems > 0 && (
        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
          {totalItems}
        </span>
      )}
    </button>
  );
}
