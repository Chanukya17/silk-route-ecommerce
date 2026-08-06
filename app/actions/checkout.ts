"use server";

import { PrismaClient } from '../../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export interface CheckoutData {
  items: { id: string; quantity: number }[];
  shippingAddress: string;
  pincode: string;
  couponCode: string;
}

export async function createOrderAction(data: CheckoutData) {
  try {
    if (!data.items || data.items.length === 0) {
      return { success: false, message: "Cart is empty" };
    }

    // Verify product prices from the database
    const productIds = data.items.map(item => item.id);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    let totalAmount = 0;
    const orderItemsData = data.items.map(cartItem => {
      const product = products.find(p => p.id === cartItem.id);
      if (!product) throw new Error(`Product ${cartItem.id} not found`);
      
      const price = Number(product.price);
      totalAmount += price * cartItem.quantity;
      
      return {
        productId: product.id,
        quantity: cartItem.quantity,
        priceAtPurchase: price
      };
    });

    // Apply Coupon (Mock logic)
    let discountAmount = 0;
    if (data.couponCode === "SILK10") {
      discountAmount = totalAmount * 0.10;
    }

    const subtotal = totalAmount - discountAmount;
    
    // Flat 5% GST
    const taxAmount = subtotal * 0.05;
    
    const finalAmount = subtotal + taxAmount;

    // Create Order
    const order = await prisma.order.create({
      data: {
        totalAmount: finalAmount,
        taxAmount: taxAmount,
        discountAmount: discountAmount,
        shippingAddress: data.shippingAddress,
        pincode: data.pincode,
        status: "PAID", // Since this triggers after Razorpay success
        items: {
          create: orderItemsData
        }
      }
    });

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Checkout Error:", error);
    return { success: false, message: error instanceof Error ? error.message : "Failed to process order" };
  }
}
