import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const searchWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  if (searchWords.length === 0) {
    return NextResponse.json({ results: [] });
  }

  // Find synonyms for any of the search words
  const synonyms = await prisma.synonym.findMany({
    where: {
      term: { in: searchWords, mode: 'insensitive' }
    }
  });

  // Build the array of terms to search for
  const expandedTerms = [...searchWords];
  synonyms.forEach(s => {
    expandedTerms.push(s.mapTo.toLowerCase());
  });

  // Query products matching ANY of the expanded terms in name, subtype, or fabric
  // For a robust search, we could do OR conditions for every term
  const orConditions = expandedTerms.flatMap(term => [
    { name: { contains: term, mode: 'insensitive' as const } },
    { subtype: { name: { contains: term, mode: 'insensitive' as const } } },
    { fabrics: { some: { name: { contains: term, mode: 'insensitive' as const } } } }
  ]);

  const products = await prisma.product.findMany({
    where: {
      OR: orConditions
    },
    take: 8,
    select: {
      id: true,
      name: true,
      price: true,
      type: { select: { name: true } },
      subtype: { select: { name: true } }
    },
    orderBy: { popularity: 'desc' }
  });

  return NextResponse.json({ results: products });
}
