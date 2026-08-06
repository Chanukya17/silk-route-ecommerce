"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterGroupProps {
  title: string;
  paramKey: string;
  options: FilterOption[];
  currentValues: string[];
  onChange: (key: string, value: string, isChecked: boolean) => void;
}

function FilterGroup({ title, paramKey, options, currentValues, onChange }: FilterGroupProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-b border-secondary/40 py-4">
      <button 
        className="flex w-full items-center justify-between font-display text-lg font-semibold text-primary-900"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      {isOpen && (
        <div className="mt-4 flex flex-col gap-2">
          {options.map(option => (
            <label key={option.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={currentValues.includes(option.value)}
                onChange={(e) => onChange(paramKey, option.value, e.target.checked)}
                className="w-4 h-4 rounded border-secondary text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-primary-800">{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FilterPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleFilterChange = (key: string, value: string, isChecked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentValues = params.get(key)?.split(',') || [];

    let newValues = [];
    if (isChecked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter(v => v !== value);
    }

    if (newValues.length > 0) {
      params.set(key, newValues.join(','));
    } else {
      params.delete(key);
    }

    params.set("page", "1"); // reset page on filter change
    router.push(`${pathname}?${params.toString()}`);
  };

  const getArrayParam = (key: string) => searchParams.get(key)?.split(',') || [];

  return (
    <div className="w-full lg:w-64 shrink-0 pr-0 lg:pr-6">
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <h2 className="font-display text-2xl font-bold text-primary-900 hidden lg:block">Filters</h2>
        <button 
          className="lg:hidden w-full flex items-center justify-between bg-secondary-light px-4 py-3 rounded-xl border border-secondary/50 font-semibold text-primary-900"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          Filters
          {isMobileOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      <div className={`${isMobileOpen ? 'block' : 'hidden'} lg:block space-y-2`}>
        <div className="flex justify-end mb-2 lg:mb-0 lg:absolute lg:-mt-10 lg:right-6">
          <button 
            onClick={() => router.push(pathname)}
            className="text-sm text-accent hover:underline font-medium"
          >
            Clear All
          </button>
        </div>

        <FilterGroup title="Fabric" paramKey="fabric" options={[ { label: "Silk", value: "Silk" }, { label: "Cotton", value: "Cotton" }, { label: "Georgette", value: "Georgette" }, { label: "Linen", value: "Linen" } ]} currentValues={getArrayParam("fabric")} onChange={handleFilterChange} />
        <FilterGroup title="Color" paramKey="color" options={[ { label: "Red", value: "Red" }, { label: "Blue", value: "Blue" }, { label: "Green", value: "Green" }, { label: "Gold", value: "Gold" }, { label: "Black", value: "Black" } ]} currentValues={getArrayParam("color")} onChange={handleFilterChange} />
        <FilterGroup title="Price" paramKey="price" options={[ { label: "Under ₹2,000", value: "0-2000" }, { label: "₹2,000 - ₹5,000", value: "2000-5000" }, { label: "₹5,000 - ₹10,000", value: "5000-10000" }, { label: "Over ₹10,000", value: "10000-999999" } ]} currentValues={getArrayParam("price")} onChange={handleFilterChange} />
        <FilterGroup title="Occasion" paramKey="occasion" options={[ { label: "Wedding", value: "Wedding" }, { label: "Festive", value: "Festive" }, { label: "Party", value: "Party" }, { label: "Casual", value: "Casual" } ]} currentValues={getArrayParam("occasion")} onChange={handleFilterChange} />
        <FilterGroup title="Blouse Included" paramKey="blouse" options={[ { label: "Yes", value: "true" }, { label: "No", value: "false" } ]} currentValues={getArrayParam("blouse")} onChange={handleFilterChange} />
      </div>
    </div>
  );
}
