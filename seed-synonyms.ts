import 'dotenv/config';
import { PrismaClient } from './lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});
const prisma = new PrismaClient({ adapter });

async function seed() {
  try {
    await prisma.synonym.upsert({
      where: { term: 'kanjivaram' },
      update: { mapTo: 'kanchipuram' },
      create: { term: 'kanjivaram', mapTo: 'kanchipuram' }
    });
    console.log("Synonym seeded!");
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}
seed();
