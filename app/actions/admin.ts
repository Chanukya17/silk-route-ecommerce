"use server";

import { PrismaClient } from '@/lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { revalidatePath } from 'next/cache';
import { getServerSession } from "next-auth/next";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function checkAdmin() {
  const session = await getServerSession();
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error("Unauthorized");
  }
}

export async function createType(formData: FormData) {
  await checkAdmin();
  const name = formData.get('name') as string;
  if (!name) return;
  await prisma.type.create({ data: { name } });
  revalidatePath('/admin/taxonomy');
}

export async function createSubtype(formData: FormData) {
  await checkAdmin();
  const name = formData.get('name') as string;
  const typeId = formData.get('typeId') as string;
  if (!name || !typeId) return;
  await prisma.subtype.create({ data: { name, typeId } });
  revalidatePath('/admin/taxonomy');
}

export async function deleteSubtype(id: string) {
  await checkAdmin();
  await prisma.subtype.delete({ where: { id } });
  revalidatePath('/admin/taxonomy');
}

export async function updateOrderStatus(orderId: string, status: string) {
  await checkAdmin();
  await prisma.order.update({
    where: { id: orderId },
    data: { status }
  });
  revalidatePath('/admin/orders');
}
