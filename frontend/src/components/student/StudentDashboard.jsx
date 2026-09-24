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
  Star,
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

  // Find active order specifically for THIS logged-in user
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
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'Accepted':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case 'Preparing':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse';
      case 'Ready':
        return 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 animate-bounce-short shadow-md shadow-emerald-500/30';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="relative group cursor-pointer" onClick={() => setIsEditProfileOpen(true)}>
            <img 
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
              alt="Avatar"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/50 shadow-md group-hover:opacity-80 transition"
            />
            <div className="absolute inset-0 bg-slate-950/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <UserCog className="w-5 h-5 text-emerald-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Welcome back, {currentUser?.name?.split(' ')[0] || 'Student'}! 👋
              </h1>
              <button 
                onClick={() => setIsEditProfileOpen(true)}
                className="bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white p-1.5 rounded-xl text-xs flex items-center gap-1 border border-slate-700/60 transition"
                title="Edit Profile & Photo"
              >
                <UserCog className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline font-semibold">Edit Profile</span>
              </button>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Roll No: <span className="text-slate-200 font-semibold">{currentUser?.rollNumber || 'CS2024-089'}</span> • {currentUser?.department || 'Computer Science'}
            </p>
          </div>
        </div>

        {/* Campus Wallet Balance & Quick CTA */}
        <div className="flex items-center gap-3 relative z-10 w-full md:w-auto justify-between md:justify-end">
          <div className="bg-slate-950/80 px-4 py-3 rounded-2xl border border-slate-800 text-right">
            <span className="text-[11px] font-semibold text-slate-400 block">Campus Wallet</span>
            <span className="text-xl font-black text-emerald-400">₹{currentUser?.balance || 1000}</span>
          </div>

          <button 
            onClick={() => setStudentTab('menu')}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition transform hover:scale-105"
          >
            <UtensilsCrossed className="w-4 h-4" />
            Order Food Now
          </button>
        </div>
      </div>

      {/* Low Stock Awareness Alert */}
      {lowStockFoods.length > 0 && (
        <div className="bg-amber-950/60 border border-amber-800/80 p-4 rounded-2xl flex items-center justify-between gap-4 text-xs text-amber-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 animate-pulse" />
            <div>
              <span className="font-bold">High Demand Alert:</span> {lowStockFoods.map(f => `${f.name} (${f.stock} left)`).join(', ')} are running low on stock! Pre-order now before sold out.
            </div>
          </div>
          <button 
            onClick={() => setStudentTab('menu')}
            className="bg-amber-500 text-slate-950 font-extrabold px-3 py-1.5 rounded-xl whitespace-nowrap hover:bg-amber-400 transition"
          >
            Grab Now
          </button>
        </div>
      )}

      {/* Active Order Live Status Widget */}
      {activeOrder ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
              <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Active Live Order</span>
              <span className="font-mono text-sm font-black text-slate-900">#{activeOrder.orderId || activeOrder.id}</span>
            </div>

            <span className={`text-xs px-3.5 py-1.5 rounded-full font-bold border ${getStatusBadge(activeOrder.status)}`}>
              {activeOrder.status === 'Ready' ? '🎉 READY FOR PICKUP!' : `Status: ${activeOrder.status}`}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            
            <div className="space-y-2">
              <div className="text-xs text-slate-400 font-medium">Pickup Window</div>
              <div className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                {activeOrder.pickupSlotTime}
              </div>
              <div className="text-xs text-slate-500">
                Counter: <strong className="text-slate-800">{activeOrder.counterNumber}</strong>
              </div>
            </div>

            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="text-xs text-slate-400 font-medium">Ordered Items</div>
              <div className="text-xs font-semibold text-slate-800">
                {activeOrder.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
              </div>
              <div className="text-xs text-slate-500 font-bold mt-1">
                Total: ₹{activeOrder.totalAmount}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => {
                  setTrackedOrderId(activeOrder.orderId || activeOrder._id || activeOrder.id);
                  setStudentTab('tracking');
                }}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-md transition"
              >
                <QrCode className="w-4 h-4 text-emerald-400" />
                Track & Show QR Code
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      ) : (
        <div className="bg-slate-900 rounded-3xl p-8 text-center border border-slate-800 text-slate-300 space-y-3 shadow-md">
          <ShoppingBag className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">No active orders right now</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Your account is clean and ready. Browse our campus canteen menu to place your pre-order!
          </p>
          <button 
            onClick={() => setStudentTab('menu')}
            className="bg-emerald-500 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl hover:bg-emerald-400 transition"
          >
            Explore Menu
          </button>
        </div>
      )}

      {/* Popular Food Items Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Popular Campus Favorites
            </h2>
            <p className="text-slate-500 text-xs">Top picks among students today</p>
          </div>

          <button 
            onClick={() => setStudentTab('menu')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
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

      {/* Quick Reorder & Recent History */}
      {pastOrders.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-emerald-600" />
            Recent Orders & Quick Reorder
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastOrders.slice(0, 2).map(order => (
              <div key={order._id || order.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">#{order.orderId || order.id} • {order.pickupSlotTime}</span>
                  <span className="text-xs font-bold text-slate-800 block mt-0.5">
                    {order.items.map(i => i.name).join(', ')}
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">₹{order.totalAmount}</span>
                </div>

                <button 
                  onClick={() => {
                    order.items.forEach(item => addToCart(item.foodId || item._id, item.quantity));
                    setStudentTab('cart');
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reorder
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
