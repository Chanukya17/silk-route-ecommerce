import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { PrismaClient } from '@/lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export default async function AccountOverview() {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    redirect('/api/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      orders: { take: 3, orderBy: { createdAt: 'desc' } },
      _count: {
        select: { wishlist: true, orders: true }
      }
    }
  });

  if (!user) return null;

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-primary-900 mb-2">Welcome back, {user.name || "User"}!</h1>
      <p className="text-primary-600 mb-8">Manage your orders, saved addresses, and wishlist.</p>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="bg-secondary-light p-6 rounded-xl border border-secondary/40">
          <h3 className="text-lg font-semibold text-primary-900 mb-1">Total Orders</h3>
          <p className="text-3xl font-display font-bold text-accent">{user._count.orders}</p>
        </div>
        <div className="bg-secondary-light p-6 rounded-xl border border-secondary/40">
          <h3 className="text-lg font-semibold text-primary-900 mb-1">Wishlisted Items</h3>
          <p className="text-3xl font-display font-bold text-accent">{user._count.wishlist}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-primary-900 mb-4">Recent Orders</h2>
      {user.orders.length > 0 ? (
        <div className="space-y-4">
          {user.orders.map(order => (
            <div key={order.id} className="flex justify-between items-center p-4 border border-secondary/50 rounded-lg">
              <div>
                <p className="font-semibold text-primary-900">Order #{order.id.slice(-6).toUpperCase()}</p>
                <p className="text-sm text-primary-600">{order.createdAt.toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary-900">₹{Number(order.totalAmount).toLocaleString('en-IN')}</p>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full mt-1">
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-primary-600 bg-secondary/20 p-4 rounded-lg text-center">You have no recent orders.</p>
      )}
    </div>
  );
}
