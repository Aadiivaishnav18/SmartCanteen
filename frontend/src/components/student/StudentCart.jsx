import React from 'react';
import { Trash2, Plus, Minus, ArrowLeft, ArrowRight, ShoppingBag, ShieldCheck, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StudentCart = () => {
  const { cart, updateCartQuantity, removeFromCart, clearCart, getCartDetails, setStudentTab } = useApp();

  const { items, subtotal, tax, total } = getCartDetails();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-xs max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-[#DCFCE7] rounded-full flex items-center justify-center mx-auto text-[#16A34A]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-[#172018]">Your cart is hungry</h2>
          <p className="text-[#64748B] text-xs leading-relaxed">
            Add something delicious from the menu to get started with your canteen pre-order.
          </p>
          <button 
            onClick={() => setStudentTab('menu')}
            className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold py-3 px-6 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#172018]">Your Food Cart</h1>
          <p className="text-[#64748B] text-xs sm:text-sm mt-1">Review selected items before choosing a pickup slot</p>
        </div>

        <button 
          onClick={clearCart}
          className="text-xs text-[#EF4444] hover:text-[#B91C1C] font-semibold flex items-center gap-1 bg-[#FEE2E2] px-3 py-1.5 rounded-xl border border-[#EF4444]/30 transition"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div 
              key={item.id || item._id}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center gap-4 hover:border-[#16A34A]/30 transition"
            >
              <img 
                src={item.image} 
                alt={item.name}
                className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[#172018] text-base truncate">{item.name}</h3>
                <span className="text-xs text-[#64748B] block mb-1">Category: {item.category}</span>
                <span className="text-sm font-extrabold text-[#16A34A]">₹{item.price} each</span>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center bg-[#F8FAFC] border border-slate-200 rounded-xl p-1">
                <button 
                  onClick={() => updateCartQuantity(item.id || item._id, item.quantity - 1)}
                  className="w-7 h-7 bg-white text-[#172018] rounded-lg flex items-center justify-center font-bold hover:bg-slate-100 transition shadow-xs"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-extrabold text-xs text-[#172018]">
                  {item.quantity}
                </span>
                <button 
                  onClick={() => updateCartQuantity(item.id || item._id, item.quantity + 1)}
                  className="w-7 h-7 bg-white text-[#172018] rounded-lg flex items-center justify-center font-bold hover:bg-slate-100 transition shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Item Subtotal & Delete */}
              <div className="text-right">
                <span className="text-base font-black text-[#172018] block">₹{item.subtotal}</span>
                <button 
                  onClick={() => removeFromCart(item.id || item._id)}
                  className="text-xs text-[#94A3B8] hover:text-[#EF4444] mt-1 transition"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4 ml-auto" />
                </button>
              </div>
            </div>
          ))}

          <button 
            onClick={() => setStudentTab('menu')}
            className="text-[#16A34A] hover:text-[#15803D] font-semibold text-xs flex items-center gap-1.5 pt-2"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </button>
        </div>

        {/* Order Summary Side Card */}
        <div className="bg-[#172018] text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-6">
          <h2 className="text-lg font-bold border-b border-slate-800 pb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#16A34A]" />
            Order Summary
          </h2>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-semibold text-white">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>GST & Service Charge (5%)</span>
              <span className="font-semibold text-white">₹{tax}</span>
            </div>
            <div className="border-t border-slate-800 pt-3 flex justify-between text-base font-black text-white">
              <span>Total Amount</span>
              <span className="text-emerald-400">₹{total}</span>
            </div>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60 text-[11px] text-slate-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-[#F97316] flex-shrink-0 mt-0.5" />
            <span>Stock reservation occurs upon slot selection during checkout.</span>
          </div>

          <button 
            onClick={() => setStudentTab('checkout')}
            className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition"
          >
            Proceed to Checkout
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
