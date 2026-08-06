"use client";

import { useState } from 'react';
import { uploadProductsCsv } from '@/app/actions/csv';

export default function CsvUploadForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await uploadProductsCsv(formData);

    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else if (result.success) {
      setMessage({ type: 'success', text: result.success });
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 min-w-[300px]">
      <input 
        type="file" 
        name="file" 
        accept=".csv" 
        required 
        className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-900 file:text-white hover:file:bg-primary-800"
      />
      <button 
        type="submit" 
        disabled={loading}
        className="bg-accent text-white px-6 py-2 rounded-lg font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50"
      >
        {loading ? 'Uploading...' : 'Upload CSV'}
      </button>
      {message && (
        <p className={`text-sm mt-2 font-medium ${message.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
          {message.text}
        </p>
      )}
    </form>
  );
}
