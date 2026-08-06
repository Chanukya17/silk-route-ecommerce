import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import TypeTiles from '@/components/TypeTiles';
import SubtypeCarousel from '@/components/SubtypeCarousel';
import ProductGrid from '@/components/ProductGrid';

// We shouldn't instantiate this globally in a real app to avoid connection leaks,
// but for this scaffolding, it's fine.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// In Next.js 14 App Router, page.tsx can be an async Server Component
export default async function Home() {
  // Fetch subtypes for carousel
  const subtypes = await prisma.subtype.findMany({
    take: 8,
    include: {
      type: true
    }
  });

  // Fetch Trending Products (Handloom sarees with high price or specific ones)
  const trendingProducts = await prisma.product.findMany({
    where: {
      type: { name: 'Handloom' }
    },
    take: 4,
    orderBy: {
      price: 'desc'
    },
    include: {
      subtype: { include: { type: true } }
    }
  });

  // Fetch New Arrivals (Recent Powerloom or general products)
  const newArrivals = await prisma.product.findMany({
    take: 4,
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      subtype: { include: { type: true } }
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroBanner />
        <TypeTiles />
        <SubtypeCarousel subtypes={subtypes} />
        <ProductGrid 
          title="Trending Bestsellers" 
          description="Our most loved and sought-after authentic handloom weaves."
          products={trendingProducts.map(p => ({...p, price: Number(p.price)}))} 
        />
        <ProductGrid 
          title="New Arrivals" 
          products={newArrivals.map(p => ({...p, price: Number(p.price)}))} 
        />
      </main>
      
      <footer className="bg-primary-900 text-white py-12 text-center mt-auto">
        <p className="font-display text-2xl font-bold mb-4">SILK & WEAVE</p>
        <p className="text-white/60 text-sm">© {new Date().getFullYear()} Silk & Weave. All rights reserved.</p>
      </footer>
    </div>
  );
}
