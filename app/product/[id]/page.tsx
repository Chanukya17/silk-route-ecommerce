import { PrismaClient } from '../../../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Breadcrumbs from '@/components/Breadcrumbs';
import ImageGallery from '@/components/pdp/ImageGallery';
import AuthenticityBadges from '@/components/pdp/AuthenticityBadges';
import PincodeChecker from '@/components/pdp/PincodeChecker';
import AddToCartActions from '@/components/pdp/AddToCartActions';
import ReviewsSection from '@/components/pdp/ReviewsSection';
import ProductGrid from '@/components/ProductGrid';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      type: true,
      subtype: true,
      fabrics: true,
      colors: true,
      regions: true,
    }
  });

  if (!product) {
    notFound();
  }

  // Fetch "You may also like" products (same subtype, excluding current)
  const relatedProducts = await prisma.product.findMany({
    where: {
      subtypeId: product.subtypeId,
      id: { not: product.id }
    },
    take: 4,
    include: {
      subtype: { include: { type: true } }
    }
  });

  const isHandloom = product.type.name === 'Handloom';
  
  // Use placeholder images for now
  const imgUrl = isHandloom ? '/images/handloom_tile.png' : '/images/powerloom_tile.png';
  const images = [imgUrl, imgUrl, imgUrl];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        <Breadcrumbs items={[
          { label: product.type.name, href: `/type/${product.type.name.toLowerCase()}` },
          { label: product.subtype.name, href: `/type/${product.type.name.toLowerCase()}/${product.subtype.name.toLowerCase().replace(/\s+/g, '-')}` },
          { label: product.name, href: `#` }
        ]} />

        <div className="grid lg:grid-cols-2 gap-12 mt-6">
          {/* Left: Image Gallery */}
          <div className="lg:sticky lg:top-24 h-fit">
            <ImageGallery images={images} productName={product.name} />
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col">
            <h1 className="font-display text-4xl font-bold text-primary-900 mb-2">{product.name}</h1>
            <p className="text-2xl font-semibold text-primary-800 mb-6">₹{Number(product.price).toLocaleString('en-IN')}</p>

            <div className="prose prose-sm text-primary-700 mb-8">
              <p>{product.description}</p>
            </div>

            <AuthenticityBadges 
              isHandloom={isHandloom}
              giTag={product.giTag}
              weaverName={product.weaverName}
              certification={product.certification}
            />

            {/* Specifications */}
            <div className="space-y-4 text-sm mt-6">
              <div className="flex border-b border-secondary/30 pb-2">
                <span className="w-1/3 font-semibold text-primary-900">Fabric</span>
                <span className="text-primary-700">{product.fabrics.map(f => f.name).join(', ')}</span>
              </div>
              <div className="flex border-b border-secondary/30 pb-2">
                <span className="w-1/3 font-semibold text-primary-900">Color</span>
                <span className="text-primary-700">{product.colors.map(c => c.name).join(', ')}</span>
              </div>
              {product.regions.length > 0 && (
                <div className="flex border-b border-secondary/30 pb-2">
                  <span className="w-1/3 font-semibold text-primary-900">Region</span>
                  <span className="text-primary-700">{product.regions.map(r => r.name).join(', ')}</span>
                </div>
              )}
              {product.blouseIncluded && (
                <div className="flex border-b border-secondary/30 pb-2">
                  <span className="w-1/3 font-semibold text-primary-900">Blouse</span>
                  <span className="text-primary-700">Included (Unstitched)</span>
                </div>
              )}
              {product.subtype.careInstructions && (
                <div className="flex border-b border-secondary/30 pb-2">
                  <span className="w-1/3 font-semibold text-primary-900">Care</span>
                  <span className="text-primary-700">{product.subtype.careInstructions}</span>
                </div>
              )}
            </div>

            <PincodeChecker />
            
            <AddToCartActions product={{
              id: product.id,
              name: product.name,
              price: Number(product.price),
              quantity: 1,
              image: images[0]
            }} />
          </div>
        </div>

        <ReviewsSection />
        
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-secondary/40 pt-12">
            <ProductGrid 
              title="You May Also Like" 
              products={relatedProducts.map(p => ({...p, price: Number(p.price)}))} 
            />
          </div>
        )}
      </main>
      
      <footer className="bg-primary-900 text-white py-12 text-center mt-auto">
        <p className="font-display text-2xl font-bold mb-4">SILK & WEAVE</p>
        <p className="text-white/60 text-sm">© {new Date().getFullYear()} Silk & Weave. All rights reserved.</p>
      </footer>
    </div>
  );
}
