import React from 'react';
import { Star, Plus, Minus, Clock, Flame, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FoodCard = ({ food, onSelectDetail }) => {
  const { cart, addToCart, updateCartQuantity } = useApp();

  const foodId = food._id || food.id;
  const cartItem = cart.find(c => c.foodId === foodId);
  const currentCartQty = cartItem ? cartItem.quantity : 0;

  const isOutOfStock = !food.available || food.stock <= 0;
  const isLowStock = food.stock > 0 && food.stock <= 5;

  return (
    <div className={`group bg-white rounded-[18px] border transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-[0_4px_20px_rgba(15,23,42,0.05)] hover:shadow-[0_8px_30px_rgba(15,23,42,0.10)] ${
      isOutOfStock ? 'border-slate-200 opacity-80' : 'border-slate-200 hover:border-[#16A34A]/40 hover:-translate-y-0.5'
    }`}>
      
      {/* Top Image & Badge Section */}
      <div className="relative overflow-hidden cursor-pointer aspect-[16/10]" onClick={() => onSelectDetail(food)}>
        <img 
          src={food.image} 
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#172018]/70 via-transparent to-transparent opacity-70"></div>

        {food.popular && (
          <span className="absolute top-3 left-3 bg-[#FEF3C7] text-[#B45309] border border-[#F59E0B]/30 font-bold text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-[#D97706] fill-current" /> Popular
          </span>
        )}

        <span className="absolute top-3 right-3 bg-[#172018]/80 backdrop-blur-sm text-white font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/10">
          <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
          {food.rating}
        </span>

        <div className="absolute bottom-2.5 left-3 text-white text-xs font-semibold flex items-center gap-1 drop-shadow-sm">
          <Clock className="w-3.5 h-3.5 text-[#DCFCE7]" />
          <span>~{food.prepTimeMinutes || 10} mins</span>
        </div>

        <div className="absolute bottom-2.5 right-3 text-slate-100 text-[11px] bg-[#172018]/80 backdrop-blur-xs px-2.5 py-0.5 rounded-full font-semibold border border-white/10">
          {food.category}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 
            onClick={() => onSelectDetail(food)}
            className="font-bold text-lg text-[#172018] group-hover:text-[#16A34A] transition cursor-pointer line-clamp-1"
          >
            {food.name}
          </h3>

          <p className="text-[#64748B] text-xs sm:text-sm line-clamp-2 mt-1 leading-relaxed">
            {food.description}
          </p>
        </div>

        {/* Stock Status Indicator */}
        <div>
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FEE2E2] text-[#B91C1C] border border-[#EF4444]/30">
              <AlertCircle className="w-3.5 h-3.5 text-[#EF4444]" />
              Unavailable / Sold Out
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FFEDD5] text-[#C2410C] border border-[#F97316]/30 animate-soft-pulse">
              <span className="w-2 h-2 rounded-full bg-[#F97316] animate-ping"></span>
              Only {food.stock} left!
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#DCFCE7] text-[#15803D] border border-[#16A34A]/30">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
              Fresh & Available ({food.stock})
            </span>
          )}
        </div>

        {/* Footer: Price & Add to Cart Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div>
            <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider block">Price</span>
            <span className="text-lg font-extrabold text-[#172018]">₹{food.price}</span>
          </div>

          {isOutOfStock ? (
            <button 
              disabled
              className="bg-slate-100 text-slate-400 px-3 py-2 rounded-xl text-xs font-semibold cursor-not-allowed border border-slate-200"
            >
              Out of Stock
            </button>
          ) : currentCartQty > 0 ? (
            <div className="flex items-center bg-[#F0FDF4] border border-[#16A34A]/40 rounded-xl p-0.5">
              <button 
                onClick={() => updateCartQuantity(foodId, currentCartQty - 1)}
                className="w-7 h-7 bg-white text-[#15803D] font-bold rounded-lg flex items-center justify-center hover:bg-[#DCFCE7] transition shadow-xs"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2.5 text-xs font-extrabold text-[#15803D]">
                {currentCartQty}
              </span>
              <button 
                onClick={() => addToCart(foodId, 1)}
                className="w-7 h-7 bg-[#16A34A] text-white font-bold rounded-lg flex items-center justify-center hover:bg-[#15803D] transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => addToCart(foodId, 1)}
              className="bg-[#16A34A] hover:bg-[#15803D] active:scale-95 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
