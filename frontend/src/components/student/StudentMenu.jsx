import React, { useState } from 'react';
import { Search, UtensilsCrossed, AlertCircle, ShoppingBag } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FoodCard } from '../common/FoodCard';

export const StudentMenu = () => {
  const { foodItems, cart, setSelectedFoodModal, setStudentTab } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Snacks', 'Meals', 'Beverages', 'Desserts'];

  const filteredFoods = foodItems.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          food.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const cartTotalItems = cart.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#172018]">Today's Menu</h1>
          <p className="text-[#64748B] text-xs sm:text-sm mt-1">Fresh meals, ready when you are.</p>
        </div>

        {cartTotalItems > 0 && (
          <button 
            onClick={() => setStudentTab('cart')}
            className="bg-[#16A34A] hover:bg-[#15803D] text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition"
          >
            <ShoppingBag className="w-4 h-4" />
            View Cart ({cartTotalItems} items)
          </button>
        )}
      </div>

      {/* Search & Category Filter Control Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-4 top-3.5" />
          <input 
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search Veg Burger, Cold Coffee, Masala Dosa..."
            className="w-full h-11 bg-white border border-slate-300 rounded-xl py-2.5 pl-11 pr-4 text-sm text-[#172018] placeholder-[#94A3B8] focus:outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-emerald-500/20"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-2.5 text-xs text-[#64748B] hover:text-[#172018] bg-slate-100 px-2 py-1 rounded-md"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(category => (
            <button 
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-[#16A34A] text-white shadow-xs'
                  : 'bg-[#F8FAFC] text-[#64748B] hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

      </div>

      {/* Food Grid */}
      {filteredFoods.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFoods.map(food => (
            <FoodCard 
              key={food._id || food.id} 
              food={food} 
              onSelectDetail={setSelectedFoodModal} 
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-3">
          <AlertCircle className="w-10 h-10 text-[#94A3B8] mx-auto" />
          <h3 className="text-lg font-bold text-[#172018]">No Food Items Found</h3>
          <p className="text-xs text-[#64748B]">We couldn't find any food items matching "{searchQuery}". Try searching another keyword or resetting filters.</p>
          <button 
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="bg-[#16A34A] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#15803D] transition"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
};
