"use client";

import { useState } from 'react';
import { updateProductStock } from '@/app/actions/csv';
import { Check, Edit2, X } from 'lucide-react';

export default function StockEditor({ productId, initialStock }: { productId: string, initialStock: number }) {
  const [isEditing, setIsEditing] = useState(false);
  const [stock, setStock] = useState(initialStock);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await updateProductStock(productId, stock);
    setIsEditing(false);
    setLoading(false);
  };

  if (!isEditing) {
    return (
      <div className="flex items-center justify-center gap-2">
        <span className={`font-bold ${stock < 5 ? 'text-red-500' : 'text-primary-900'}`}>
          {stock}
        </span>
        <button onClick={() => setIsEditing(true)} className="text-primary-400 hover:text-accent transition-colors">
          <Edit2 className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-1">
      <input 
        type="number" 
        min="0"
        value={stock} 
        onChange={e => setStock(parseInt(e.target.value) || 0)}
        className="w-16 px-2 py-1 text-sm border border-secondary rounded text-center focus:outline-none focus:border-accent"
        autoFocus
      />
      <button onClick={handleSave} disabled={loading} className="text-green-500 hover:text-green-700 disabled:opacity-50">
        <Check className="w-4 h-4" />
      </button>
      <button onClick={() => { setIsEditing(false); setStock(initialStock); }} disabled={loading} className="text-red-500 hover:text-red-700 disabled:opacity-50">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
