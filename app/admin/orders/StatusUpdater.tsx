"use client";

import { useState } from 'react';
import { updateOrderStatus } from '@/app/actions/admin';
import { CheckCircle2 } from 'lucide-react';

const STATUS_OPTIONS = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function StatusUpdater({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [loading, setLoading] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    if (newStatus === currentStatus) return;
    
    setLoading(true);
    await updateOrderStatus(orderId, newStatus);
    setLoading(false);
    
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PAID': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="flex items-center gap-2 relative">
      <select 
        defaultValue={currentStatus} 
        onChange={handleStatusChange}
        disabled={loading}
        className={`w-full text-xs font-bold px-3 py-1.5 rounded-full border appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 ${getStatusColor(currentStatus)}`}
      >
        {STATUS_OPTIONS.map(status => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>
      
      {showSaved && (
        <CheckCircle2 className="w-4 h-4 text-green-500 absolute -right-6 animate-in fade-in" />
      )}
    </div>
  );
}
