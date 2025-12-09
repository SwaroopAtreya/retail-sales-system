"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function FilterPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCheckboxChange = (key, value) => {
    const params = new URLSearchParams(searchParams);
    const currentValues = params.getAll(key);
    
    if (currentValues.includes(value)) {
      params.delete(key);
      currentValues.filter(v => v !== value).forEach(v => params.append(key, v));
    } else {
      params.append(key, value);
    }
    
    params.set("page", "1");
    router.push(`/?${params.toString()}`);
  };

  const isChecked = (key, value) => {
    return searchParams.getAll(key).includes(value);
  };

  const handleRangeChange = (type, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(type, value);
    } else {
      params.delete(type);
    }
    params.set("page", "1");
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="space-y-6 text-black">
      {/* Region Filter */}
      <div>
        <h3 className="font-semibold mb-3 text-sm text-gray-700">Region</h3>
        <div className="space-y-2">
          {["North", "South", "East", "West"].map(r => (
            <label key={r} className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input 
                type="checkbox" 
                checked={isChecked("region", r)}
                onChange={() => handleCheckboxChange("region", r)}
                className="rounded text-blue-600 cursor-pointer"
              />
              <span>{r}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Gender Filter */}
      <div>
        <h3 className="font-semibold mb-3 text-sm text-gray-700">Gender</h3>
        <div className="space-y-2">
          {["Male", "Female", "Other"].map(g => (
            <label key={g} className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input 
                type="checkbox" 
                checked={isChecked("gender", g)}
                onChange={() => handleCheckboxChange("gender", g)}
                className="rounded text-blue-600 cursor-pointer"
              />
              <span>{g}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Age Range Filter */}
      <div>
        <h3 className="font-semibold mb-3 text-sm text-gray-700">Age Range</h3>
        <div className="space-y-2">
          <input 
            type="number"
            placeholder="Min Age"
            min="0"
            max="120"
            className="w-full p-2 border rounded text-xs"
            value={searchParams.get("minAge") || ""}
            onChange={(e) => handleRangeChange("minAge", e.target.value)}
          />
          <input 
            type="number"
            placeholder="Max Age"
            min="0"
            max="120"
            className="w-full p-2 border rounded text-xs"
            value={searchParams.get("maxAge") || ""}
            onChange={(e) => handleRangeChange("maxAge", e.target.value)}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="font-semibold mb-3 text-sm text-gray-700">Category</h3>
        <div className="space-y-2">
          {["Electronics", "Clothing", "Home", "Beauty"].map(c => (
            <label key={c} className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input 
                type="checkbox" 
                checked={isChecked("category", c)}
                onChange={() => handleCheckboxChange("category", c)}
                className="rounded text-blue-600 cursor-pointer"
              />
              <span>{c}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Payment Method Filter */}
      <div>
        <h3 className="font-semibold mb-3 text-sm text-gray-700">Payment Method</h3>
        <div className="space-y-2">
          {["Credit Card", "Debit Card", "Cash", "Online Banking"].map(p => (
            <label key={p} className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input 
                type="checkbox" 
                checked={isChecked("paymentMethod", p)}
                onChange={() => handleCheckboxChange("paymentMethod", p)}
                className="rounded text-blue-600 cursor-pointer"
              />
              <span>{p}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Date Range Filter */}
      <div>
        <h3 className="font-semibold mb-3 text-sm text-gray-700">Date Range</h3>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-gray-600">Start Date</label>
            <input 
              type="date" 
              className="w-full p-2 border rounded text-xs"
              value={searchParams.get("startDate") || ""}
              onChange={(e) => handleRangeChange("startDate", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-gray-600">End Date</label>
            <input 
              type="date" 
              className="w-full p-2 border rounded text-xs"
              value={searchParams.get("endDate") || ""}
              onChange={(e) => handleRangeChange("endDate", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Clear All Filters Button */}
      <button 
        onClick={() => router.push("/")}
        className="w-full mt-4 py-2 bg-red-50 text-red-600 rounded text-sm font-medium hover:bg-red-100 transition"
      >
        Clear All Filters
      </button>
    </div>
  );
}
