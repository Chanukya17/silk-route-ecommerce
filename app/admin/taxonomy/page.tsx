import { PrismaClient } from '@/lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { createType, createSubtype, deleteSubtype } from '@/app/actions/admin';
import { Trash2 } from 'lucide-react';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export default async function TaxonomyPage() {
  const types = await prisma.type.findMany({
    include: { subtypes: true }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-primary-900 mb-2">Taxonomy Management</h1>
        <p className="text-primary-600">Manage Product Types and Subtypes.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Add Type Form */}
        <div className="bg-white p-6 rounded-xl border border-secondary/40 shadow-sm h-fit">
          <h2 className="text-xl font-bold text-primary-900 mb-4">Add New Type</h2>
          <form action={createType} className="flex gap-4">
            <input 
              type="text" 
              name="name" 
              placeholder="e.g. Handloom" 
              required 
              className="flex-1 px-4 py-2 rounded-lg border border-secondary bg-white focus:outline-none focus:border-accent"
            />
            <button type="submit" className="bg-primary-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-800 transition-colors">
              Add Type
            </button>
          </form>
        </div>

        {/* Add Subtype Form */}
        <div className="bg-white p-6 rounded-xl border border-secondary/40 shadow-sm h-fit">
          <h2 className="text-xl font-bold text-primary-900 mb-4">Add New Subtype</h2>
          <form action={createSubtype} className="flex flex-col gap-4">
            <select name="typeId" required className="px-4 py-2 rounded-lg border border-secondary bg-white focus:outline-none focus:border-accent">
              <option value="">Select Parent Type...</option>
              {types.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <div className="flex gap-4">
              <input 
                type="text" 
                name="name" 
                placeholder="e.g. Kanchipuram" 
                required 
                className="flex-1 px-4 py-2 rounded-lg border border-secondary bg-white focus:outline-none focus:border-accent"
              />
              <button type="submit" className="bg-primary-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-800 transition-colors">
                Add Subtype
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* List Existing */}
      <div className="bg-white rounded-xl border border-secondary/40 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-secondary/30 bg-secondary-light">
          <h2 className="text-xl font-bold text-primary-900">Existing Taxonomy</h2>
        </div>
        <div className="p-6 space-y-6">
          {types.map(type => (
            <div key={type.id} className="border border-secondary/30 rounded-lg p-4">
              <h3 className="font-bold text-lg text-primary-900 mb-3 pb-2 border-b border-secondary/20">{type.name}</h3>
              <div className="flex flex-wrap gap-2">
                {type.subtypes.map(sub => (
                  <div key={sub.id} className="flex items-center gap-2 bg-secondary-light px-3 py-1.5 rounded-full border border-secondary/50">
                    <span className="text-sm font-semibold text-primary-800">{sub.name}</span>
                    <form action={async () => { "use server"; await deleteSubtype(sub.id); }}>
                      <button type="submit" className="text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                ))}
                {type.subtypes.length === 0 && (
                  <p className="text-sm text-primary-500 italic">No subtypes added.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
