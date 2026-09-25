import React, { useState } from 'react';
import { Package, Plus, Minus, AlertCircle, CheckCircle2, Search } from 'lucide-react';
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
      <div className="bg-gradient-to-r from-[#172018] to-[#166534] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black">Kitchen Stock & Inventory</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">Real-time inventory levels, stock warnings, and availability locks</p>
        </div>

        <div className="bg-[#172018]/60 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-white/10 text-right text-xs">
          <span className="text-slate-400 block font-semibold">Total Listed Items</span>
          <span className="text-xl font-black text-emerald-400">{foodItems.length} Foods</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#94A3B8] absolute left-4 top-3.5" />
        <input 
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search items to restock..."
          className="w-full h-11 bg-white border border-slate-300 rounded-xl py-2.5 pl-11 pr-4 text-sm text-[#172018] placeholder-[#94A3B8] focus:outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-slate-200 text-[#64748B] uppercase tracking-wider font-extrabold">
              <tr>
                <th className="px-6 py-4">Item Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Current Stock</th>
                <th className="px-6 py-4">Stock Status</th>
                <th className="px-6 py-4 text-right">Restock Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredFoods.map(food => {
                const foodId = food._id || food.id;
                const isOut = !food.available || food.stock <= 0;
                const isLow = food.stock > 0 && food.stock <= 5;

                return (
                  <tr key={foodId} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={food.image} alt={food.name} className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <span className="font-bold text-[#172018] text-sm block">{food.name}</span>
                          <span className="text-[#64748B] text-[10px]">Prep ~{food.prepTimeMinutes || 10} mins</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-[#64748B] font-semibold">{food.category}</td>

                    <td className="px-6 py-4 font-black text-[#172018]">₹{food.price}</td>

                    <td className="px-6 py-4">
                      <span className="text-base font-extrabold text-[#172018]">{food.stock} units</span>
                    </td>

                    <td className="px-6 py-4">
                      {isOut ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FEE2E2] text-[#B91C1C] border border-[#EF4444]/30">
                          <AlertCircle className="w-3.5 h-3.5 text-[#EF4444]" />
                          Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FFEDD5] text-[#C2410C] border border-[#F97316]/30 animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-[#F97316] animate-ping"></span>
                          Low Stock ({food.stock})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#15803D] border border-[#16A34A]/30">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                          Healthy Stock
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => updateStock(foodId, Math.max(0, food.stock - 1))}
                          className="w-8 h-8 bg-slate-100 hover:bg-slate-200 text-[#172018] rounded-lg flex items-center justify-center font-bold transition"
                          title="Decrease stock by 1"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <button 
                          onClick={() => updateStock(foodId, food.stock + 5)}
                          className="bg-[#16A34A] hover:bg-[#15803D] text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-xs"
                          title="Add 5 units"
                        >
                          +5 Units
                        </button>

                        <button 
                          onClick={() => toggleFoodAvailability(foodId)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                            food.available 
                              ? 'bg-[#DCFCE7] text-[#15803D] border-[#16A34A]/30 hover:bg-[#DCFCE7]/80' 
                              : 'bg-slate-100 text-[#64748B] border-slate-300 hover:bg-slate-200'
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
