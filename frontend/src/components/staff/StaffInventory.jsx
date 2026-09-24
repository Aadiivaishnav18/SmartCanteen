import React, { useState } from 'react';
import { Package, Plus, Minus, AlertCircle, CheckCircle2, RefreshCw, Flame, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StaffInventory = () => {
  const { foodItems, updateStock, toggleFoodAvailability } = useApp();
  const [search, setSearch] = useState('');

  const filteredFoods = foodItems.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) || 
    f.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black">Kitchen Stock & Inventory</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Real-time inventory levels, stock warnings, and auto-availability locks</p>
        </div>

        <div className="bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800 text-right text-xs">
          <span className="text-slate-400 block">Total Items Listed</span>
          <span className="text-xl font-black text-amber-400">{foodItems.length} Foods</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
        <input 
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search items to restock..."
          className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-extrabold">
              <tr>
                <th className="px-6 py-4">Item Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Current Stock</th>
                <th className="px-6 py-4">Stock Status</th>
                <th className="px-6 py-4 text-right">Quick Restock Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredFoods.map(food => {
                const isOut = !food.available || food.stock <= 0;
                const isLow = food.stock > 0 && food.stock <= 5;

                return (
                  <tr key={food.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={food.image} alt={food.name} className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <span className="font-bold text-slate-900 text-sm block">{food.name}</span>
                          <span className="text-slate-400 text-[10px]">Prep ~{food.prepTimeMinutes} mins</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-600 font-semibold">{food.category}</td>

                    <td className="px-6 py-4 font-black text-slate-900">₹{food.price}</td>

                    <td className="px-6 py-4">
                      <span className="text-base font-extrabold text-slate-900">{food.stock} units</span>
                    </td>

                    <td className="px-6 py-4">
                      {isOut ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                          Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                          Low Stock ({food.stock})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          In Stock
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => updateStock(food.id, Math.max(0, food.stock - 1))}
                          className="w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center font-bold"
                          title="Decrease stock by 1"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <button 
                          onClick={() => updateStock(food.id, food.stock + 5)}
                          className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-extrabold transition shadow-xs"
                          title="Add 5 units"
                        >
                          +5 Units
                        </button>

                        <button 
                          onClick={() => toggleFoodAvailability(food.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                            food.available 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                              : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {food.available ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
