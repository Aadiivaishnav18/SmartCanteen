import React, { useState } from 'react';
import { X, Star, Clock, ShoppingBag, Plus, Minus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FoodDetailModal = ({ food, onClose }) => {
  const { cart, addToCart } = useApp();
  const [qty, setQty] = useState(1);

  if (!food) return null;

  const foodId = food._id || food.id;
  const isOutOfStock = !food.available || food.stock <= 0;
  const isLowStock = food.stock > 0 && food.stock <= 5;

  const handleAdd = () => {
    addToCart(foodId, qty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#172018]/60 backdrop-blur-md flex items-center justify-center p-4 animate-pop-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-[#172018]/70 hover:bg-[#172018] text-white p-2 rounded-full backdrop-blur-xs transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* LEFT: Food Image Panel */}
          <div className="relative h-64 md:h-auto w-full">
            <img 
              src={food.image} 
              alt={food.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#172018]/80 via-transparent to-transparent md:bg-gradient-to-r"></div>

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
              <span className="bg-[#16A34A] text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                {food.category}
              </span>
              <div className="flex items-center gap-1 bg-[#172018]/80 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold border border-white/10">
                <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                {food.rating} / 5.0
              </div>
            </div>
          </div>

          {/* RIGHT: Modal Details & Ordering Controls */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h2 className="text-2xl font-black text-[#172018]">{food.name}</h2>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-[#16A34A]">₹{food.price}</span>
                </div>
              </div>

              <p className="text-[#64748B] text-xs sm:text-sm leading-relaxed mb-4">
                {food.description}
              </p>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-[#F8FAFC] rounded-2xl border border-slate-200 text-xs">
                <div className="flex items-center gap-2 text-[#172018] font-medium">
                  <Clock className="w-4 h-4 text-[#16A34A]" />
                  <span>Prep: ~{food.prepTimeMinutes || 10} mins</span>
                </div>
                <div className="flex items-center gap-2 text-[#172018] font-medium">
                  {isOutOfStock ? (
                    <AlertCircle className="w-4 h-4 text-[#EF4444]" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                  )}
                  <span>
                    {isOutOfStock ? 'Sold Out' : `${food.stock} available`}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            {isOutOfStock ? (
              <div className="bg-[#FEE2E2] text-[#B91C1C] p-3.5 rounded-2xl text-center text-xs font-bold border border-[#EF4444]/30">
                Currently out of stock. The kitchen staff will restock soon!
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#64748B]">Select Quantity</span>
                  <div className="flex items-center bg-[#F8FAFC] border border-slate-200 rounded-xl p-1">
                    <button 
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-8 h-8 bg-white text-[#172018] rounded-lg flex items-center justify-center font-bold hover:bg-slate-100 transition shadow-xs"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-extrabold text-[#172018] text-sm">
                      {qty}
                    </span>
                    <button 
                      onClick={() => setQty(Math.min(food.stock, qty + 1))}
                      className="w-8 h-8 bg-white text-[#172018] rounded-lg flex items-center justify-center font-bold hover:bg-slate-100 transition shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleAdd}
                  className="w-full bg-[#16A34A] hover:bg-[#15803D] active:scale-95 text-white py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart • ₹{food.price * qty}
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
