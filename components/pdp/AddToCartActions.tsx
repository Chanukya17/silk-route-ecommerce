"use client";

import { useCartStore, CartItem } from "@/lib/store/useCartStore";
import { useState } from "react";
import { ShoppingBag, Zap } from "lucide-react";

export default function AddToCartActions({ product }: { product: CartItem }) {
  const addItem = useCartStore(state => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({ ...product, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem({ ...product, quantity: 1 });
    // In a real app, route to checkout here
    alert("Redirecting to checkout...");
  };

  return (
    <div className="flex gap-4 mt-8">
      <button 
        onClick={handleAddToCart}
        className="flex-1 flex items-center justify-center gap-2 border-2 border-primary-900 text-primary-900 px-6 py-4 rounded-full font-bold hover:bg-primary-50 transition-colors"
      >
        <ShoppingBag className="w-5 h-5" />
        {added ? "Added!" : "Add to Cart"}
      </button>
      
      <button 
        onClick={handleBuyNow}
        className="flex-1 flex items-center justify-center gap-2 bg-accent text-white px-6 py-4 rounded-full font-bold hover:bg-accent-hover transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
      >
        <Zap className="w-5 h-5" />
        Buy Now
      </button>
    </div>
  );
}
