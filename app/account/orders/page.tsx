import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { PrismaClient } from '@/lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Package, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export default async function OrdersPage() {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    redirect('/api/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { 
      orders: { 
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: { product: true }
          }
        }
      } 
    }
  });

  if (!user) return null;

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-primary-900 mb-2">Order History</h1>
      <p className="text-primary-600 mb-8">View and track your past orders.</p>

      {user.orders.length > 0 ? (
        <div className="space-y-8">
          {user.orders.map(order => (
            <div key={order.id} className="border border-secondary/50 rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-secondary-light p-4 md:p-6 border-b border-secondary/50 flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full text-sm">
                  <div>
                    <p className="text-primary-600 mb-1">Order Placed</p>
                    <p className="font-semibold text-primary-900">{order.createdAt.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-primary-600 mb-1">Total Amount</p>
                    <p className="font-semibold text-primary-900">₹{Number(order.totalAmount).toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-primary-600 mb-1">Ship To</p>
                    <p className="font-semibold text-primary-900 truncate pr-4" title={order.shippingAddress}>
                      {order.shippingAddress.split(',')[0]}
                    </p>
                  </div>
                  <div>
                    <p className="text-primary-600 mb-1">Order #</p>
                    <p className="font-semibold text-primary-900">{order.id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="p-4 md:p-6 bg-white">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-primary-900 text-lg flex items-center gap-2">
                    <Package className="w-5 h-5 text-accent" /> Status: <span className="text-accent">{order.status}</span>
                  </h3>
                  <button className="text-sm font-semibold text-primary-700 hover:text-accent transition-colors flex items-center gap-1">
                    Invoice <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-6">
                  {order.items.map(item => (
                    <div key={item.id} className="flex gap-4 md:gap-6 items-center">
                      <div className="relative w-24 h-32 rounded-lg overflow-hidden bg-secondary shrink-0 border border-secondary/30">
                        {/* Mock image logic since we don't store thumbnail on orderItem */}
                        <Image src={'/images/handloom_tile.png'} alt={item.product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <Link href={`/product/${item.product.id}`} className="font-bold text-lg text-primary-900 hover:text-accent transition-colors line-clamp-1">
                          {item.product.name}
                        </Link>
                        <p className="text-primary-600 text-sm mt-1">Qty: {item.quantity}</p>
                        <p className="font-semibold text-primary-800 mt-2">₹{Number(item.priceAtPurchase).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-secondary/20 rounded-xl border border-secondary/40 border-dashed">
          <Package className="w-12 h-12 text-primary-300 mx-auto mb-4" />
          <p className="text-primary-800 font-medium mb-2">You haven&apos;t placed any orders yet.</p>
          <Link href="/" className="text-accent font-semibold hover:underline">Start Shopping</Link>
        </div>
      )}
    </div>
  );
}
