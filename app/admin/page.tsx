import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [orders, products] = await Promise.all([
    prisma.order.findMany({
      include: {
        items: {
          include: { product: { include: { type: true, subtype: true } } }
        }
      }
    }),
    prisma.product.findMany({
      include: { type: true, subtype: true }
    })
  ]);

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
  const totalOrders = orders.length;

  const lowStockProducts = products.filter(p => p.stock < 5);

  // Group sales by type
  const salesByType: Record<string, number> = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      const typeName = item.product.type?.name || 'Unknown';
      salesByType[typeName] = (salesByType[typeName] || 0) + item.quantity;
    });
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-primary-900 mb-2">Admin Dashboard</h1>
        <p className="text-primary-600">Overview of your store&apos;s performance.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-secondary/40 shadow-sm">
          <h3 className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-2">Total Revenue</h3>
          <p className="text-3xl font-display font-bold text-primary-900">₹{totalRevenue.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-secondary/40 shadow-sm">
          <h3 className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-2">Total Orders</h3>
          <p className="text-3xl font-display font-bold text-primary-900">{totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-secondary/40 shadow-sm">
          <h3 className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-2">Low Stock Items</h3>
          <p className="text-3xl font-display font-bold text-accent">{lowStockProducts.length}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-secondary/40 shadow-sm">
          <h3 className="text-lg font-bold text-primary-900 mb-6">Sales by Type</h3>
          <div className="space-y-4">
            {Object.entries(salesByType).map(([type, count]) => {
              const max = Math.max(...Object.values(salesByType));
              const percentage = max > 0 ? (count / max) * 100 : 0;
              return (
                <div key={type}>
                  <div className="flex justify-between text-sm mb-1 font-medium">
                    <span className="text-primary-800">{type}</span>
                    <span className="text-primary-600">{count} sold</span>
                  </div>
                  <div className="h-3 w-full bg-secondary/30 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-900 rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
            {Object.keys(salesByType).length === 0 && (
              <p className="text-sm text-primary-500">No sales data available yet.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-secondary/40 shadow-sm">
          <h3 className="text-lg font-bold text-primary-900 mb-6">Low Stock Alerts</h3>
          {lowStockProducts.length > 0 ? (
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {lowStockProducts.map(product => (
                <div key={product.id} className="flex justify-between items-center p-3 border border-red-100 bg-red-50/50 rounded-lg">
                  <div>
                    <p className="font-semibold text-primary-900 text-sm line-clamp-1">{product.name}</p>
                    <p className="text-xs text-primary-600">{product.subtype?.name} • SKU: {product.sku || 'N/A'}</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded">
                      {product.stock} left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-primary-500">All products are adequately stocked.</p>
          )}
        </div>
      </div>
    </div>
  );
}
