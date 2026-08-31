import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import prisma from '@/lib/prisma';
import ProductGrid from "@/components/ProductGrid";

export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    redirect('/api/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      wishlist: {
        include: {
          product: {
            include: { type: true, subtype: { include: { type: true } } }
          }
        }
      }
    }
  });

  if (!user) return null;

  const wishlistedProducts = user.wishlist.map(w => ({
    ...w.product,
    price: Number(w.product.price)
  }));

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-primary-900 mb-2">My Wishlist</h1>
      <p className="text-primary-600 mb-8">Products you&apos;ve saved for later.</p>

      {wishlistedProducts.length > 0 ? (
        <ProductGrid title="" products={wishlistedProducts} />
      ) : (
        <div className="text-center py-20 bg-secondary-light rounded-2xl border border-secondary/30">
          <h3 className="text-2xl font-display font-bold text-primary-900 mb-4">Your wishlist is empty</h3>
          <p className="text-primary-600 mb-8 max-w-sm mx-auto">Discover our exclusive collection and save your favorite styles for later.</p>
          <a href="/" className="inline-block bg-primary-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-800 transition-colors">
            Explore Collection
          </a>
        </div>
      )}
    </div>
  );
}
