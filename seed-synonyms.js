const { PrismaClient } = require('./lib/generated/prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
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
