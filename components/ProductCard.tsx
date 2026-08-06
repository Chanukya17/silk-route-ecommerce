import Image from "next/image";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import WishlistButton from "./WishlistButton";

export interface ProductProps {
  id: string;
  name: string;
  price: number;
  giTag: boolean;
  subtype: { name: string; type: { name: string } };
}

export default function ProductCard({ product }: { product: ProductProps }) {
  // Determine an appropriate fallback image based on type
  const isHandloom = product.subtype.type.name === 'Handloom';
  const imgUrl = isHandloom ? '/images/handloom_tile.png' : '/images/powerloom_tile.png';

  return (
    <div className="group flex flex-col gap-4">
      <Link href={`/product/${product.id}`} className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-secondary/10">
        <Image
          src={imgUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 z-10">
          <WishlistButton productId={product.id} />
        </div>
        {product.giTag && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <BadgeCheck className="w-4 h-4 text-accent" />
            <span className="text-xs font-semibold text-primary-900">GI Tagged</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity group-hover:opacity-100" />
      </Link>
      
      <div className="flex flex-col gap-1 px-1">
        <p className="text-sm font-medium text-primary-600 uppercase tracking-wide">
          {product.subtype.name}
        </p>
        <Link href={`/product/${product.id}`} className="font-display font-semibold text-lg text-primary-900 line-clamp-1 hover:text-accent transition-colors">
          {product.name}
        </Link>
        <p className="text-primary-800 font-medium mt-1">₹{product.price.toLocaleString('en-IN')}</p>
      </div>
    </div>
  );
}
