import prisma from '@/lib/prisma';
import { ClipboardList } from 'lucide-react';
import StatusUpdater from './StatusUpdater';

export const dynamic = 'force-dynamic';

export default async function OrdersManagementPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: { include: { product: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary-900 mb-2">Order Management</h1>
          <p className="text-primary-600">Track and update customer order statuses.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-secondary/40 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary-light border-b border-secondary/30 text-primary-900 text-sm tracking-wide">
                <th className="p-4 font-semibold w-12"></th>
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold text-right">Total</th>
                <th className="p-4 font-semibold text-center w-48">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map(order => (
                  <tr key={order.id} className="border-b border-secondary/20 hover:bg-secondary/10 transition-colors">
                    <td className="p-4 text-center">
                      <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center">
                        <ClipboardList className="w-4 h-4 text-primary-500" />
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-primary-900">{order.id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-primary-600 line-clamp-1 mt-1" title={order.shippingAddress}>
                        {order.shippingAddress.split(',')[0]}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-primary-900">{order.user?.name || 'Guest'}</p>
                      <p className="text-xs text-primary-600">{order.user?.email || 'N/A'}</p>
                    </td>
                    <td className="p-4 text-primary-800 text-sm">
                      {order.createdAt.toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right font-bold text-primary-900">
                      ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4">
                      <StatusUpdater orderId={order.id} currentStatus={order.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-primary-600">
                    No orders have been placed yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
