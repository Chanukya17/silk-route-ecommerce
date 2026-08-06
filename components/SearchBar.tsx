"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDebounce } from '@/lib/hooks/useDebounce';

interface SearchResult {
  id: string;
  name: string;
  price: string;
  type: { name: string };
  subtype: { name: string };
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md hidden md:block">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search sarees, fabrics, or categories..."
          className="w-full bg-secondary-light border border-secondary/50 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-primary-400"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400 animate-spin" />}
      </form>

      {isOpen && query.length >= 2 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-secondary/30 overflow-hidden z-50">
          {results.length > 0 ? (
            <div className="p-2">
              <p className="text-xs font-semibold text-primary-500 uppercase px-2 mb-2">Suggestions</p>
              <ul className="space-y-1">
                {results.map(product => (
                  <li key={product.id}>
                    <Link 
                      href={`/product/${product.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex justify-between items-center px-3 py-2 hover:bg-secondary-light rounded-lg transition-colors group"
                    >
                      <div>
                        <p className="text-sm font-semibold text-primary-900 group-hover:text-accent transition-colors">{product.name}</p>
                        <p className="text-xs text-primary-500">{product.type.name} • {product.subtype.name}</p>
                      </div>
                      <span className="text-xs font-bold text-primary-800">₹{Number(product.price).toLocaleString('en-IN')}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => { setIsOpen(false); router.push(`/search?q=${encodeURIComponent(query.trim())}`); }}
                className="w-full text-center text-xs font-bold text-accent py-2 mt-2 border-t border-secondary/20 hover:bg-secondary-light transition-colors"
              >
                View all results for &quot;{query}&quot;
              </button>
            </div>
          ) : !loading && (
            <div className="p-4 text-center text-sm text-primary-600">
              No results found for &quot;{query}&quot;. Try checking your spelling or using different keywords.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
