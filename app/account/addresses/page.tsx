import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import prisma from '@/lib/prisma';
import { MapPin, Plus, Trash2 } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AddressesPage() {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    redirect('/api/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { addresses: true }
  });

  if (!user) return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary-900 mb-2">Saved Addresses</h1>
          <p className="text-primary-600">Manage your shipping addresses for a faster checkout.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-800 transition-colors">
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>

      {user.addresses.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {user.addresses.map(address => (
            <div key={address.id} className="border border-secondary/50 rounded-xl p-6 relative group hover:border-primary-400 transition-colors">
              {address.isDefault && (
                <span className="absolute top-4 right-4 bg-accent/10 text-accent text-xs font-bold px-2 py-1 rounded">
                  DEFAULT
                </span>
              )}
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-primary-900 font-medium mb-1">{address.street}</p>
                  <p className="text-primary-700 text-sm">{address.city}, {address.state}</p>
                  <p className="text-primary-700 text-sm font-semibold mt-1">{address.pincode}</p>
                </div>
              </div>
              <div className="flex gap-4 pt-4 border-t border-secondary/30">
                <button className="text-sm font-semibold text-primary-600 hover:text-primary-900 transition-colors">Edit</button>
                <button className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1">
                  <Trash2 className="w-4 h-4" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-secondary/20 rounded-xl border border-secondary/40 border-dashed">
          <MapPin className="w-12 h-12 text-primary-300 mx-auto mb-4" />
          <p className="text-primary-800 font-medium mb-2">No addresses saved yet.</p>
          <p className="text-primary-600 text-sm">Add an address to speed up your checkout process.</p>
        </div>
      )}
    </div>
  );
}
