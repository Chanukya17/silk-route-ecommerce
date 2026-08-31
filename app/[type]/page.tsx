import { Prisma } from '@/lib/generated/prisma/client';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import FilterPanel from '@/components/FilterPanel';
import SortDropdown from '@/components/SortDropdown';
import Pagination from '@/components/Pagination';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

const ITEMS_PER_PAGE = 12;

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { type: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Validate type
  const typeName = params.type.charAt(0).toUpperCase() + params.type.slice(1);
  if (typeName !== 'Handloom' && typeName !== 'Powerloom') {
    notFound();
  }

  // Parse filters
  const page = Number(searchParams.page) || 1;
  const sort = searchParams.sort as string;
  const fabric = searchParams.fabric as string;
  const color = searchParams.color as string;
  const price = searchParams.price as string;
  const occasion = searchParams.occasion as string;
  const blouse = searchParams.blouse as string;

  // Build where clause
  const where: Prisma.ProductWhereInput = {
    type: { name: typeName }
  };

  if (fabric) {
    where.fabrics = { some: { name: { in: fabric.split(',') } } };
  }
  if (color) {
    where.colors = { some: { name: { in: color.split(',') } } };
  }
  if (occasion) {
    where.occasions = { some: { name: { in: occasion.split(',') } } };
  }
  if (blouse === 'true') {
    where.blouseIncluded = true;
  } else if (blouse === 'false') {
    where.blouseIncluded = false;
  }
  
  if (price) {
    // Handling multiple price ranges (e.g. "0-2000,2000-5000")
    const priceRanges = price.split(',').map(range => {
      const [min, max] = range.split('-');
      return { price: { gte: Number(min), lte: Number(max) } };
    });
    where.OR = priceRanges;
  }

  // Build order by
  let orderBy: Prisma.ProductOrderByWithRelationInput = { popularity: 'desc' }; // default
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  else if (sort === 'price_desc') orderBy = { price: 'desc' };
  else if (sort === 'newest') orderBy = { createdAt: 'desc' };
  else if (sort === 'rating') orderBy = { rating: 'desc' };

  // Fetch data
  const [totalProducts, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      include: {
        subtype: { include: { type: true } }
      }
    })
  ]);

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      {/* Breadcrumb & Title */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-primary-900 mb-2">{typeName} Sarees</h1>
        <p className="text-primary-700">Explore our curated collection of {typeName.toLowerCase()} sarees.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <FilterPanel />
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-secondary/30">
            <p className="text-sm text-primary-600 font-medium">Showing {products.length} of {totalProducts} products</p>
            <SortDropdown />
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold text-primary-900 mb-2">No products found</h3>
              <p className="text-primary-700">Try adjusting your filters to see more results.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={{...product, price: Number(product.price)}} />
                ))}
              </div>
              <Pagination totalPages={totalPages} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
