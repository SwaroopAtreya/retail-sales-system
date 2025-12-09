"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FilterPanel from "@/components/FilterPanel";

export default function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [sales, setSales] = useState([]);
  const [meta, setMeta] = useState({ totalPages: 1, page: 1 });
  const [loading, setLoading] = useState(false);

  const params = new URLSearchParams(searchParams);
  const search = params.get("search") || "";
  const page = params.get("page") || 1;
  const sortBy = params.get("sortBy") || "date";

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const query = searchParams.toString();
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/sales?${query}`;
      console.log("Fetching from:", url);
      const res = await fetch(url);
      
      if (!res.ok) {
        console.error("API Error:", res.status, res.statusText);
        throw new Error(`API Error: ${res.status}`);
      }
      
      const data = await res.json();
      console.log("API Response:", data);
      if(data.data) {
        setSales(data.data);
        setMeta(data.meta);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    const newParams = new URLSearchParams(searchParams);
    if(term) newParams.set("search", term);
    else newParams.delete("search");
    newParams.set("page", "1");
    router.push(`/?${newParams.toString()}`);
  };

  const handleSort = (field) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sortBy", field);
    newParams.set("sortOrder", searchParams.get("sortOrder") === "asc" ? "desc" : "asc");
    router.push(`/?${newParams.toString()}`);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage);
    router.push(`/?${newParams.toString()}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 p-4 fixed h-full overflow-y-auto">
        <h2 className="text-xl font-bold mb-6 text-blue-600">TruEstate Sales</h2>
        <FilterPanel />
      </aside>

      <main className="ml-64 flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search customer or phone..."
            className="w-96 p-2 border rounded shadow-sm text-black"
            defaultValue={search}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(e.target.value)}
          />
          <select 
            className="p-2 border rounded text-black" 
            value={sortBy} 
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="date">Date (Newest)</option>
            <option value="quantity">Quantity</option>
            <option value="customerName">Customer (A-Z)</option>
          </select>
        </div>

        <div className="bg-white rounded shadow overflow-hidden">
          <table className="min-w-full text-black">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Product</th>
                <th className="p-4 text-left">Region</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center">Loading...</td></tr>
              ) : sales.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center">No results found.</td></tr>
              ) : (
                sales.map((sale) => (
                  <tr key={sale.id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{new Date(sale.date).toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="font-medium">{sale.customerName}</div>
                      <div className="text-sm text-gray-500">{sale.phone}</div>
                    </td>
                    <td className="p-4">{sale.productName}</td>
                    <td className="p-4">{sale.region}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {sale.category}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold">${sale.finalAmount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-6 text-black">
          <button 
            disabled={parseInt(page) <= 1}
            onClick={() => handlePageChange(parseInt(page) - 1)}
            className="px-4 py-2 bg-white border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>Page {meta.page} of {meta.totalPages}</span>
          <button 
            disabled={parseInt(page) >= meta.totalPages}
            onClick={() => handlePageChange(parseInt(page) + 1)}
            className="px-4 py-2 bg-white border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}
