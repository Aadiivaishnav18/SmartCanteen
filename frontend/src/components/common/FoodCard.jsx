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
    <div className={`group bg-white rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-xl ${
      isOutOfStock ? 'border-slate-200 opacity-80' : 'border-slate-100 hover:border-emerald-200 hover:-translate-y-1'
    }`}>
      
      {/* Top Image & Badge Section */}
      <div className="relative overflow-hidden cursor-pointer" onClick={() => onSelectDetail(food)}>
        <img 
          src={food.image} 
          alt={food.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60"></div>

        {food.popular && (
          <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow flex items-center gap-1">
            <Flame className="w-3 h-3 text-slate-950 fill-current" /> Popular
          </span>
        )}

        <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          {food.rating}
        </span>

        <div className="absolute bottom-2.5 left-3 text-white text-[11px] font-medium flex items-center gap-1 drop-shadow">
          <Clock className="w-3 h-3 text-emerald-400" />
          <span>~{food.prepTimeMinutes || 10} mins prep</span>
        </div>

        <div className="absolute bottom-2.5 right-3 text-slate-200 text-[11px] bg-slate-900/70 px-2 py-0.5 rounded-full font-medium border border-slate-700/50">
          {food.category}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 
              onClick={() => onSelectDetail(food)}
              className="font-extrabold text-base text-slate-900 group-hover:text-emerald-600 transition cursor-pointer line-clamp-1"
            >
              {food.name}
            </h3>
          </div>

          <p className="text-slate-500 text-xs line-clamp-2 mb-3 leading-relaxed">
            {food.description}
          </p>
        </div>

        {/* Stock Status Indicator */}
        <div className="mb-3">
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 animate-soft-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              Low Stock: {food.stock} left!
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              In Stock ({food.stock})
            </span>
          )}
        </div>

        {/* Footer: Price & Add to Cart Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div>
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Price</span>
            <span className="text-lg font-black text-slate-900">₹{food.price}</span>
          </div>

          {isOutOfStock ? (
            <button 
              disabled
              className="bg-slate-100 text-slate-400 px-3 py-2 rounded-xl text-xs font-semibold cursor-not-allowed border border-slate-200"
            >
              Unavailable
            </button>
          ) : currentCartQty > 0 ? (
            <div className="flex items-center bg-emerald-50 border border-emerald-300 rounded-xl p-0.5">
              <button 
                onClick={() => updateCartQuantity(foodId, currentCartQty - 1)}
                className="w-7 h-7 bg-white text-emerald-700 font-bold rounded-lg flex items-center justify-center hover:bg-emerald-100 transition shadow-xs"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2.5 text-xs font-black text-emerald-950">
                {currentCartQty}
              </span>
              <button 
                onClick={() => addToCart(foodId, 1)}
                className="w-7 h-7 bg-emerald-600 text-white font-bold rounded-lg flex items-center justify-center hover:bg-emerald-700 transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => addToCart(foodId, 1)}
              className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
