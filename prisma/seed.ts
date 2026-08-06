import 'dotenv/config';
import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Create Types
  const handloom = await prisma.type.upsert({
    where: { name: 'Handloom' },
    update: {},
    create: { name: 'Handloom' },
  });

  const powerloom = await prisma.type.upsert({
    where: { name: 'Powerloom' },
    update: {},
    create: { name: 'Powerloom' },
  });

  // 2. Pre-populate Cross-cutting Filters
  const fabrics = ['Silk', 'Cotton', 'Linen', 'Organza', 'Georgette'].map(name => ({ name }));
  for (const f of fabrics) {
    await prisma.fabric.upsert({ where: { name: f.name }, update: {}, create: f });
  }

  const occasions = ['Wedding', 'Festive', 'Office/Daily Wear', 'Party', 'Casual', 'Puja/Traditional'].map(name => ({ name }));
  for (const o of occasions) {
    await prisma.occasion.upsert({ where: { name: o.name }, update: {}, create: o });
  }

  const regions = ['Tamil Nadu', 'Uttar Pradesh', 'Madhya Pradesh', 'West Bengal', 'Odisha', 'Andhra Pradesh', 'Gujarat', 'Assam', 'Maharashtra'].map(name => ({ name }));
  for (const r of regions) {
    await prisma.region.upsert({ where: { name: r.name }, update: {}, create: r });
  }

  const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Pink', 'Purple'].map(name => ({ name }));
  for (const c of colors) {
    await prisma.color.upsert({ where: { name: c.name }, update: {}, create: c });
  }

  const borderTypes = ['Zari', 'Temple Border', 'Contrast Border', 'Tassel', 'No Border'].map(name => ({ name }));
  for (const b of borderTypes) {
    await prisma.borderType.upsert({ where: { name: b.name }, update: {}, create: b });
  }

  // Helper to fetch all records
  const allFabrics = await prisma.fabric.findMany();
  const allOccasions = await prisma.occasion.findMany();
  const allRegions = await prisma.region.findMany();
  const allColors = await prisma.color.findMany();
  const allBorders = await prisma.borderType.findMany();

  // 3. Create Subtypes (Handloom)
  const handloomSubtypes = [
    'Banarasi', 'Kanjivaram / Kanchipuram Silk', 'Chanderi', 'Maheshwari', 'Jamdani', 
    'Paithani', 'Ikat (Sambalpuri, Pochampally, Odisha Ikat)', 'Bandhani / Bandhej', 
    'Tussar Silk', 'Baluchari', 'Patola', 'Muga Silk (Assam)', 'Kota Doria', 
    'Venkatagiri', 'Mangalagiri', 'Ilkal', 'Tant (Bengal Cotton)', 'Gadwal', 'Narayanpet'
  ];

  for (const name of handloomSubtypes) {
    const subtype = await prisma.subtype.upsert({
      where: { name },
      update: {},
      create: {
        name,
        typeId: handloom.id,
        description: `Authentic ${name} Handloom Saree`,
      },
    });

    // Create 3 sample products
    for (let i = 1; i <= 3; i++) {
      await prisma.product.create({
        data: {
          name: `${name} Masterpiece Edition 00${i}`,
          description: `Exquisite handwoven ${name} saree crafted with care.`,
          price: 5000 + (i * 1000), // Randomish price
          typeId: handloom.id,
          subtypeId: subtype.id,
          giTag: i === 1, // Only 1st gets GI tag
          giTagNumber: i === 1 ? `GI-${Math.floor(Math.random() * 10000)}` : null,
          weaverName: i === 2 ? 'Artisan Crafts Co.' : null,
          certification: 'Silk Mark',
          fabrics: { connect: [{ id: allFabrics[0].id }] },
          occasions: { connect: [{ id: allOccasions[0].id }, { id: allOccasions[1].id }] },
          regions: { connect: [{ id: allRegions[0].id }] },
          colors: { connect: [{ id: allColors[i % allColors.length].id }] },
          borderTypes: { connect: [{ id: allBorders[0].id }] }
        }
      });
    }
  }

  // 4. Create Subtypes (Powerloom)
  const powerloomSubtypes = [
    'Printed Cotton', 'Georgette (Plain / Embellished / Printed)', 'Chiffon', 'Crepe', 
    'Net / Sequinned Party Wear', 'Satin', 'Art Silk', 'Linen', 'Organza', 
    'Digital Print Sarees', 'Embroidered/Machine-embellished'
  ];

  for (const name of powerloomSubtypes) {
    const subtype = await prisma.subtype.upsert({
      where: { name },
      update: {},
      create: {
        name,
        typeId: powerloom.id,
        description: `Trendy ${name} Powerloom Saree`,
      },
    });

    // Create 3 sample products
    for (let i = 1; i <= 3; i++) {
      await prisma.product.create({
        data: {
          name: `${name} Collection Style ${i}`,
          description: `Beautiful everyday wear ${name} saree.`,
          price: 1500 + (i * 500),
          typeId: powerloom.id,
          subtypeId: subtype.id,
          fabrics: { connect: [{ id: allFabrics[1].id }] },
          occasions: { connect: [{ id: allOccasions[4].id }] }, // Casual
          regions: { connect: [{ id: allRegions[1].id }] },
          colors: { connect: [{ id: allColors[i % allColors.length].id }] },
          borderTypes: { connect: [{ id: allBorders[2].id }] } // Contrast
        }
      });
    }
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
