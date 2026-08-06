"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

export default function WishlistButton({ productId, initialSaved = false }: { productId: string; initialSaved?: boolean }) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);
    // Optimistic update
    setSaved(!saved);
    
    // In reality, we'd call a server action here to persist it for the user
    console.log("Toggling wishlist for", productId);
    // await toggleWishlistAction(productId);
    setLoading(false);
  };

  return (
    <button 
      onClick={toggleWishlist}
      disabled={loading}
      className={`p-2 rounded-full backdrop-blur-md bg-white/70 shadow-sm transition-colors ${saved ? 'text-red-500' : 'text-primary-600 hover:text-red-500 hover:bg-white'}`}
    >
      <Heart className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
    </button>
  );
}
