import React from 'react';
import { 
  UtensilsCrossed, 
  Clock, 
  ShoppingBag, 
  ArrowRight, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  QrCode, 
  Sparkles,
  RotateCcw,
  UserCog
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FoodCard } from '../common/FoodCard';

export const StudentDashboard = () => {
  const { 
    currentUser, 
    orders, 
    foodItems, 
    setStudentTab, 
    setTrackedOrderId,
    setSelectedFoodModal,
    addToCart,
    setIsEditProfileOpen
  } = useApp();

  const currentUserId = currentUser ? (currentUser.id || currentUser._id) : null;
  const currentUserEmail = currentUser?.email?.toLowerCase();

  // Active order for logged-in user
  const activeOrder = orders.find(
    o => (currentUserId && (o.userId === currentUserId || o.userEmail?.toLowerCase() === currentUserEmail)) &&
         ['Placed', 'Accepted', 'Preparing', 'Ready'].includes(o.status)
  );

  const pastOrders = orders.filter(
    o => (currentUserId && (o.userId === currentUserId || o.userEmail?.toLowerCase() === currentUserEmail)) &&
         ['Collected', 'Cancelled'].includes(o.status)
  );

  const popularFoods = foodItems.filter(f => f.popular || f.rating >= 4.7).slice(0, 4);
  const lowStockFoods = foodItems.filter(f => f.stock > 0 && f.stock <= 5);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Placed':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Accepted':
        return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
      case 'Preparing':
        return 'bg-[#FFEDD5] text-[#C2410C] border border-[#F97316]/30 animate-pulse';
      case 'Ready':
        return 'bg-[#DCFCE7] text-[#15803D] font-extrabold border border-[#16A34A]/40 shadow-xs';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Greeting & Header Card */}
      <div className="bg-gradient-to-r from-[#172018] via-[#166534] to-[#15803D] p-6 sm:p-8 rounded-[24px] text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative group cursor-pointer" onClick={() => setIsEditProfileOpen(true)}>
            <img 
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
              alt="Avatar"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-md group-hover:opacity-80 transition"
            />
            <div className="absolute inset-0 bg-[#172018]/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <UserCog className="w-5 h-5 text-emerald-300" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Good day, {currentUser?.name?.split(' ')[0] || 'Student'}! 👋
              </h1>
              <button 
                onClick={() => setIsEditProfileOpen(true)}
                className="bg-white/10 hover:bg-white/20 text-emerald-200 p-1.5 rounded-xl text-xs flex items-center gap-1 border border-white/20 transition"
                title="Edit Profile"
              >
                <UserCog className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-semibold">Edit</span>
              </button>
            </div>
            <p className="text-emerald-100/80 text-xs sm:text-sm">
              Ready for your next meal? • Roll No: <span className="text-white font-bold">{currentUser?.rollNumber || 'CS2024-089'}</span>
            </p>
          </div>
        </div>

        {/* Wallet Balance & Action */}
        <div className="flex items-center gap-3 relative z-10 w-full md:w-auto justify-between md:justify-end">
          <div className="bg-[#172018]/60 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-white/10 text-right">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-300 block">Campus Wallet</span>
            <span className="text-xl font-black text-emerald-400">₹{currentUser?.balance || 1000}</span>
          </div>

          <button 
            onClick={() => setStudentTab('menu')}
            className="bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold px-5 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md transition transform hover:scale-105"
          >
            <UtensilsCrossed className="w-4 h-4" />
            Order Food
          </button>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => setStudentTab('menu')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#16A34A]/40 transition cursor-pointer flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#16A34A] group-hover:scale-105 transition">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#172018]">Order Food</h3>
            <p className="text-xs text-[#64748B]">Browse fresh canteen menu</p>
          </div>
        </div>

        <div 
          onClick={() => {
            if (activeOrder) setTrackedOrderId(activeOrder.orderId || activeOrder._id);
            setStudentTab('tracking');
          }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#16A34A]/40 transition cursor-pointer flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#FFEDD5] flex items-center justify-center text-[#F97316] group-hover:scale-105 transition">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#172018]">Track Order</h3>
            <p className="text-xs text-[#64748B]">View queue & status ticket</p>
          </div>
        </div>

        <div 
          onClick={() => setStudentTab('history')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#16A34A]/40 transition cursor-pointer flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-105 transition">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#172018]">Order History</h3>
            <p className="text-xs text-[#64748B]">Reorder previous favorites</p>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockFoods.length > 0 && (
        <div className="bg-[#FFEDD5] border border-[#F97316]/30 p-4 rounded-2xl flex items-center justify-between gap-4 text-xs text-[#C2410C]">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#F97316] flex-shrink-0 animate-pulse" />
            <div>
              <span className="font-bold">High Demand Alert:</span> {lowStockFoods.map(f => `${f.name} (${f.stock} left)`).join(', ')} are running low on stock!
            </div>
          </div>
          <button 
            onClick={() => setStudentTab('menu')}
            className="bg-[#F97316] text-white font-bold px-3 py-1.5 rounded-xl whitespace-nowrap hover:bg-[#C2410C] transition"
          >
            Order Fast
          </button>
        </div>
      )}

      {/* CURRENT ACTIVE ORDER CARD */}
      {activeOrder ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#16A34A]/30 shadow-md relative overflow-hidden space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#16A34A] animate-ping"></span>
              <span className="text-xs uppercase font-extrabold text-[#94A3B8] tracking-wider">Current Active Order</span>
              <span className="font-mono text-sm font-black text-[#172018]">#{activeOrder.orderId || activeOrder.id}</span>
            </div>

            <span className={`text-xs px-3.5 py-1.5 rounded-full font-bold ${getStatusBadge(activeOrder.status)}`}>
              {activeOrder.status === 'Ready' ? '🎉 READY FOR PICKUP!' : `Status: ${activeOrder.status}`}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="space-y-1.5">
              <div className="text-xs text-[#64748B] font-semibold">Pickup Time Slot</div>
              <div className="text-lg font-black text-[#172018] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#16A34A]" />
                {activeOrder.pickupSlotTime}
              </div>
              <div className="text-xs text-[#64748B]">
                Station: <strong className="text-[#172018]">{activeOrder.counterNumber}</strong>
              </div>
            </div>

            <div className="space-y-1.5 bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200">
              <div className="text-xs text-[#64748B] font-semibold">Ordered Items</div>
              <div className="text-xs font-bold text-[#172018]">
                {activeOrder.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
              </div>
              <div className="text-xs text-[#16A34A] font-extrabold mt-1">
                Total Paid: ₹{activeOrder.totalAmount}
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button 
                onClick={() => {
                  setTrackedOrderId(activeOrder.orderId || activeOrder._id || activeOrder.id);
                  setStudentTab('tracking');
                }}
                className="w-full sm:w-auto bg-[#172018] hover:bg-slate-800 text-white font-semibold text-xs px-5 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition"
              >
                <QrCode className="w-4 h-4 text-emerald-400" />
                Track & Show Pass
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 space-y-3 shadow-xs">
          <ShoppingBag className="w-10 h-10 text-[#16A34A] mx-auto" />
          <h3 className="text-lg font-bold text-[#172018]">No active orders right now</h3>
          <p className="text-xs text-[#64748B] max-w-md mx-auto">
            Your canteen queue status is clear. Pre-order your next meal from the menu!
          </p>
          <button 
            onClick={() => setStudentTab('menu')}
            className="bg-[#16A34A] text-white font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-[#15803D] transition"
          >
            Explore Menu
          </button>
        </div>
      )}

      {/* POPULAR / AVAILABLE FOOD GRID */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-[#172018] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#F59E0B]" />
              Popular Campus Favorites
            </h2>
            <p className="text-[#64748B] text-xs">Freshly prepared meals available right now</p>
          </div>

          <button 
            onClick={() => setStudentTab('menu')}
            className="text-xs font-bold text-[#16A34A] hover:underline flex items-center gap-1"
          >
            View Full Menu <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularFoods.map(food => (
            <FoodCard key={food._id || food.id} food={food} onSelectDetail={setSelectedFoodModal} />
          ))}
        </div>
      </div>

    </div>
  );
};
