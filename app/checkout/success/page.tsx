import Link from "next/link";
import Header from "@/components/Header";
import { CheckCircle } from "lucide-react";
import { PrismaClient } from '../../../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const orderId = searchParams.orderId as string;
  let order = null;

  if (orderId) {
    order = await prisma.order.findUnique({
      where: { id: orderId }
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-secondary-light">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-xl w-full text-center border border-secondary/20">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </div>
          
          <h1 className="font-display text-4xl font-bold text-primary-900 mb-2">Order Confirmed!</h1>
          <p className="text-primary-700 text-lg mb-8">Thank you for shopping with Silk & Weave.</p>

          {order ? (
            <div className="bg-secondary-light/50 p-6 rounded-2xl mb-8 text-left">
              <p className="text-sm text-primary-600 mb-1">Order Reference</p>
              <p className="font-mono text-primary-900 font-semibold mb-4">{order.id}</p>
              
              <div className="flex justify-between items-center pt-4 border-t border-secondary/30">
                <span className="text-primary-800">Amount Paid</span>
                <span className="font-bold text-xl text-primary-900">₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
              </div>
            </div>
          ) : (
            <div className="bg-secondary-light/50 p-6 rounded-2xl mb-8">
              <p className="text-primary-700">Your order is being processed.</p>
            </div>
          )}

          <p className="text-primary-600 text-sm mb-8">
            A confirmation email has been sent to you. You can expect delivery within 3-5 business days.
          </p>

          <Link 
            href="/"
            className="inline-block w-full bg-primary-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    </div>
  );
}
