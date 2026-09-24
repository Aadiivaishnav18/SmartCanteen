import React, { useState } from 'react';
import { X, Star, Clock, ShoppingBag, Plus, Minus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FoodDetailModal = ({ food, onClose }) => {
  const { cart, addToCart, updateCartQuantity } = useApp();
  const [qty, setQty] = useState(1);

  if (!food) return null;

  const cartItem = cart.find(c => c.foodId === food.id);
  const isOutOfStock = !food.available || food.stock <= 0;
  const isLowStock = food.stock > 0 && food.stock <= 5;

  const handleAdd = () => {
    addToCart(food.id, qty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-slate-900/70 hover:bg-slate-900 text-white p-2 rounded-full backdrop-blur-md transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Food Hero Image */}
        <div className="relative h-64 w-full">
          <img 
            src={food.image} 
            alt={food.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white">
            <span className="bg-emerald-500 text-slate-950 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              {food.category}
            </span>
            <div className="flex items-center gap-1 bg-slate-900/80 px-2.5 py-1 rounded-full text-xs font-bold">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              {food.rating} / 5.0
            </div>
          </div>
        </div>

        {/* Modal Details Body */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h2 className="text-2xl font-bold text-slate-900">{food.name}</h2>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-600">₹{food.price}</span>
            </div>
          </div>

          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            {food.description}
          </p>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 gap-3 mb-6 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Prep Time: ~{food.prepTimeMinutes} mins</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
              {isOutOfStock ? (
                <AlertCircle className="w-4 h-4 text-rose-500" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              )}
              <span>
                Stock: {isOutOfStock ? '0 (Out of Stock)' : `${food.stock} items left`}
              </span>
            </div>
          </div>

          {/* Quantity Controls & Action */}
          {isOutOfStock ? (
            <div className="bg-rose-50 text-rose-700 p-4 rounded-2xl text-center text-sm font-medium border border-rose-200">
              This item is currently out of stock in the kitchen. Staff will restock soon!
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-slate-100 border border-slate-200 rounded-2xl p-1">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-9 h-9 bg-white text-slate-800 rounded-xl flex items-center justify-center font-bold hover:bg-slate-200 transition shadow-xs"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-slate-900 text-base">
                  {qty}
                </span>
                <button 
                  onClick={() => setQty(Math.min(food.stock, qty + 1))}
                  className="w-9 h-9 bg-white text-slate-800 rounded-xl flex items-center justify-center font-bold hover:bg-slate-200 transition shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button 
                onClick={handleAdd}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Cart • ₹{food.price * qty}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
