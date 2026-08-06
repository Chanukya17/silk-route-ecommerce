"use server";

import { PrismaClient } from '@/lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { revalidatePath } from 'next/cache';
import { getServerSession } from "next-auth/next";
import { parse } from 'csv-parse/sync';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function checkAdmin() {
  const session = await getServerSession();
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error("Unauthorized");
  }
}

export async function uploadProductsCsv(formData: FormData) {
  await checkAdmin();
  
  const file = formData.get('file') as File;
  if (!file) {
    return { error: 'No file provided' };
  }

  try {
    const text = await file.text();
    // Parse CSV: expected columns: name, description, price, sku, stock, typeName, subtypeName, giTag
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    let successCount = 0;
    let errorCount = 0;

    for (const record of records as Record<string, string>[]) {
      try {
        // Find Type and Subtype
        const type = await prisma.type.findUnique({ where: { name: record.typeName } });
        const subtype = await prisma.subtype.findUnique({ where: { name: record.subtypeName } });
        
        if (!type || !subtype) {
          errorCount++;
          continue; // Skip if taxonomy doesn't exist
        }

        await prisma.product.create({
          data: {
            name: record.name,
            description: record.description || null,
            price: parseFloat(record.price),
            sku: record.sku || null,
            stock: parseInt(record.stock) || 0,
            typeId: type.id,
            subtypeId: subtype.id,
            giTag: record.giTag === 'true' || record.giTag === '1'
          }
        });
        successCount++;
      } catch (err) {
        console.error("Failed to insert row:", record, err);
        errorCount++;
      }
    }

    revalidatePath('/admin/products');
    return { success: `Successfully imported ${successCount} products. ${errorCount} failed.` };
  } catch (error: unknown) {
    console.error("CSV Parse Error:", error);
    return { error: `Failed to process CSV: ${error instanceof Error ? error.message : String(error)}` };
  }
}

export async function updateProductStock(id: string, newStock: number) {
  await checkAdmin();
  await prisma.product.update({
    where: { id },
    data: { stock: newStock }
  });
  revalidatePath('/admin/products');
}
