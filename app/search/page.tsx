import { PrismaClient } from '@/lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import ProductGrid from '@/components/ProductGrid';
import FilterPanel from '@/components/FilterPanel';
import Header from '@/components/Header';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export default async function SearchResultsPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const query = searchParams.q as string || '';
  const searchWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  
  let products: import('@/lib/generated/prisma/client').Prisma.ProductGetPayload<{ include: { type: true, subtype: { include: { type: true } } } }>[] = [];
  
  if (searchWords.length > 0) {
    const synonyms = await prisma.synonym.findMany({
      where: { term: { in: searchWords, mode: 'insensitive' } }
    });
    
    const expandedTerms = [...searchWords];
    synonyms.forEach(s => expandedTerms.push(s.mapTo.toLowerCase()));
    
    const orConditions = expandedTerms.flatMap(term => [
      { name: { contains: term, mode: 'insensitive' as const } },
      { subtype: { name: { contains: term, mode: 'insensitive' as const } } },
      { fabrics: { some: { name: { contains: term, mode: 'insensitive' as const } } } }
    ]);
    
    // Process filters exactly like Category pages
    const whereClause: import('@/lib/generated/prisma/client').Prisma.ProductWhereInput = { OR: orConditions };
    if (searchParams.subtype) {
      const subtypes = Array.isArray(searchParams.subtype) ? searchParams.subtype : [searchParams.subtype];
      whereClause.subtype = { name: { in: subtypes } };
    }
    if (searchParams.fabric) {
      const fabrics = Array.isArray(searchParams.fabric) ? searchParams.fabric : [searchParams.fabric];
      whereClause.fabrics = { some: { name: { in: fabrics } } };
    }
    if (searchParams.color) {
      const colors = Array.isArray(searchParams.color) ? searchParams.color : [searchParams.color];
      whereClause.colors = { some: { name: { in: colors } } };
    }
    
    products = await prisma.product.findMany({
      where: whereClause,
      include: {
        type: true,
        subtype: { include: { type: true } },
      },
      orderBy: searchParams.sort === 'price_asc' ? { price: 'asc' } : 
               searchParams.sort === 'price_desc' ? { price: 'desc' } :
               searchParams.sort === 'newest' ? { createdAt: 'desc' } : { popularity: 'desc' }
    });
  }

  // To populate filters dynamically from the matched products
  // In a real app we would map fabrics/colors too, for now we will stub them based on data

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-primary-900">
            Search Results for &quot;{query}&quot;
          </h1>
          <p className="text-primary-600 mt-2">{products.length} products found</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 shrink-0">
            <FilterPanel />
          </aside>
          <div className="flex-1">
            {products.length > 0 ? (
              <ProductGrid title="Search Results" products={products.map(p => ({ ...p, price: Number(p.price) }))} />
            ) : (
              <div className="text-center py-24 bg-secondary-light rounded-2xl">
                <p className="text-lg text-primary-700 font-medium mb-4">No results found for &quot;{query}&quot;.</p>
                <p className="text-primary-500 text-sm max-w-md mx-auto">
                  Try checking your spelling, using more generic terms, or browsing our categories.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
