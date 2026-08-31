import prisma from '@/lib/prisma';
import { PackageSearch, Upload } from 'lucide-react';
import CsvUploadForm from './CsvUploadForm';
import StockEditor from './StockEditor';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: { type: true, subtype: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary-900 mb-2">Products Management</h1>
          <p className="text-primary-600">Manage your inventory, prices, and upload new products via CSV.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-secondary/40 shadow-sm flex flex-col md:flex-row gap-8 justify-between items-start">
        <div className="max-w-xl">
          <h2 className="text-xl font-bold text-primary-900 mb-2 flex items-center gap-2">
            <Upload className="w-5 h-5 text-accent" /> Bulk CSV Upload
          </h2>
          <p className="text-primary-600 text-sm mb-4">
            Upload a CSV file containing the following headers: 
            <code className="bg-secondary-light px-2 py-0.5 rounded mx-1 text-primary-900 font-semibold border border-secondary">name</code>, 
            <code className="bg-secondary-light px-2 py-0.5 rounded mx-1 text-primary-900 font-semibold border border-secondary">description</code>, 
            <code className="bg-secondary-light px-2 py-0.5 rounded mx-1 text-primary-900 font-semibold border border-secondary">price</code>, 
            <code className="bg-secondary-light px-2 py-0.5 rounded mx-1 text-primary-900 font-semibold border border-secondary">sku</code>, 
            <code className="bg-secondary-light px-2 py-0.5 rounded mx-1 text-primary-900 font-semibold border border-secondary">stock</code>, 
            <code className="bg-secondary-light px-2 py-0.5 rounded mx-1 text-primary-900 font-semibold border border-secondary">typeName</code>, 
            <code className="bg-secondary-light px-2 py-0.5 rounded mx-1 text-primary-900 font-semibold border border-secondary">subtypeName</code>, 
            <code className="bg-secondary-light px-2 py-0.5 rounded mx-1 text-primary-900 font-semibold border border-secondary">giTag</code>
          </p>
          <p className="text-primary-500 text-xs italic mb-4">Note: The Type and Subtype names must exactly match existing taxonomy entries.</p>
        </div>
        
        <CsvUploadForm />
      </div>

      <div className="bg-white rounded-xl border border-secondary/40 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary-light border-b border-secondary/30 text-primary-900 text-sm tracking-wide">
                <th className="p-4 font-semibold w-12"></th>
                <th className="p-4 font-semibold">Product Name</th>
                <th className="p-4 font-semibold">SKU</th>
                <th className="p-4 font-semibold">Taxonomy</th>
                <th className="p-4 font-semibold text-right">Price</th>
                <th className="p-4 font-semibold text-center w-32">Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map(product => (
                  <tr key={product.id} className="border-b border-secondary/20 hover:bg-secondary/10 transition-colors">
                    <td className="p-4 text-center">
                      <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center">
                        <PackageSearch className="w-4 h-4 text-primary-500" />
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-primary-900 line-clamp-1">{product.name}</p>
                      {product.giTag && <span className="text-xs font-semibold text-accent mt-0.5 block">GI Tagged</span>}
                    </td>
                    <td className="p-4 text-primary-600 text-sm font-medium">{product.sku || '—'}</td>
                    <td className="p-4">
                      <span className="text-sm bg-secondary-light border border-secondary/50 px-2 py-1 rounded text-primary-800">
                        {product.type.name} / {product.subtype.name}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-primary-900">
                      ₹{Number(product.price).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-center">
                      <StockEditor productId={product.id} initialStock={product.stock} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-primary-600">
                    No products found. Start by uploading a CSV.
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
