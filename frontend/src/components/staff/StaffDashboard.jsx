import React, { useState } from 'react';
import { 
  ChefHat, 
  Clock, 
  CheckCircle2, 
  Flame, 
  User, 
  ArrowRight,
  Package,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StaffDashboard = () => {
  const { 
    orders, 
    foodItems, 
    updateOrderStatus, 
    setStaffSelectedOrderId, 
    setStaffTab 
  } = useApp();

  const [statusFilter, setStatusFilter] = useState('All');

  // Low Stock Items for Staff Alert
  const lowStockItems = foodItems.filter(f => f.stock <= 5);

  // Statistics counters
  const counts = {
    Placed: orders.filter(o => o.status === 'Placed').length,
    Accepted: orders.filter(o => o.status === 'Accepted').length,
    Preparing: orders.filter(o => o.status === 'Preparing').length,
    Ready: orders.filter(o => o.status === 'Ready').length,
    Collected: orders.filter(o => o.status === 'Collected').length,
  };

  // Sorted by pickup time (or creation time)
  const sortedOrders = [...orders].sort((a, b) => {
    if (a.pickupSlotTime && b.pickupSlotTime) {
      return a.pickupSlotTime.localeCompare(b.pickupSlotTime);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const filteredOrders = sortedOrders.filter(o => {
    if (statusFilter === 'All') return o.status !== 'Cancelled';
    return o.status === statusFilter;
  });

  const getNextAction = (status) => {
    switch (status) {
      case 'Placed':
        return { label: 'Accept Order', target: 'Accepted', color: 'bg-indigo-600 hover:bg-indigo-700 text-white' };
      case 'Accepted':
        return { label: 'Start Preparing', target: 'Preparing', color: 'bg-amber-600 hover:bg-amber-700 text-white' };
      case 'Preparing':
        return { label: 'Mark Ready for Pickup', target: 'Ready', color: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30' };
      case 'Ready':
        return { label: 'Mark Collected', target: 'Collected', color: 'bg-slate-900 hover:bg-slate-800 text-white' };
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Placed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Accepted': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Preparing': return 'bg-amber-100 text-amber-800 border-amber-200 animate-pulse';
      case 'Ready': return 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-200 animate-bounce-short';
      case 'Collected': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Staff Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-500/20 border border-amber-500/40 rounded-2xl flex items-center justify-center text-amber-400">
            <ChefHat className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">Kitchen Dispatch Queue</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">Orders organized chronologically by Pickup Time Window</p>
          </div>
        </div>

        <button 
          onClick={() => setStaffTab('inventory')}
          className="bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold px-5 py-3 rounded-2xl text-xs flex items-center gap-2 border border-slate-700 transition"
        >
          <Package className="w-4 h-4 text-amber-400" />
          Manage Stock & Inventory
        </button>
      </div>

      {/* Low-Stock Alert Banner for Staff */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-950/80 border border-amber-800 p-4 rounded-3xl flex items-center justify-between gap-4 text-amber-200 text-xs shadow-md">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 animate-pulse" />
            <div>
              <span className="font-extrabold text-amber-100">Low Kitchen Inventory Alert:</span>{' '}
              {lowStockItems.map(item => `${item.name} (${item.stock} left)`).join(', ')}. Restock before lunch rush!
            </div>
          </div>

          <button 
            onClick={() => setStaffTab('inventory')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl whitespace-nowrap transition"
          >
            Restock Now
          </button>
        </div>
      )}

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div 
          onClick={() => setStatusFilter('Placed')}
          className={`p-4 rounded-2xl border cursor-pointer transition text-center ${
            statusFilter === 'Placed' ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white border-slate-200 text-slate-900 hover:border-blue-300'
          }`}
        >
          <span className="text-[11px] font-semibold block uppercase tracking-wider">Placed</span>
          <span className="text-2xl font-black">{counts.Placed}</span>
        </div>

        <div 
          onClick={() => setStatusFilter('Accepted')}
          className={`p-4 rounded-2xl border cursor-pointer transition text-center ${
            statusFilter === 'Accepted' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white border-slate-200 text-slate-900 hover:border-indigo-300'
          }`}
        >
          <span className="text-[11px] font-semibold block uppercase tracking-wider">Accepted</span>
          <span className="text-2xl font-black">{counts.Accepted}</span>
        </div>

        <div 
          onClick={() => setStatusFilter('Preparing')}
          className={`p-4 rounded-2xl border cursor-pointer transition text-center ${
            statusFilter === 'Preparing' ? 'bg-amber-600 text-white border-amber-600 shadow-md' : 'bg-white border-slate-200 text-slate-900 hover:border-amber-300'
          }`}
        >
          <span className="text-[11px] font-semibold block uppercase tracking-wider">In Prep</span>
          <span className="text-2xl font-black">{counts.Preparing}</span>
        </div>

        <div 
          onClick={() => setStatusFilter('Ready')}
          className={`p-4 rounded-2xl border cursor-pointer transition text-center ${
            statusFilter === 'Ready' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white border-slate-200 text-slate-900 hover:border-emerald-300'
          }`}
        >
          <span className="text-[11px] font-semibold block uppercase tracking-wider">Ready</span>
          <span className="text-2xl font-black">{counts.Ready}</span>
        </div>

        <div 
          onClick={() => setStatusFilter('Collected')}
          className={`p-4 rounded-2xl border cursor-pointer transition text-center col-span-2 sm:col-span-1 ${
            statusFilter === 'Collected' ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white border-slate-200 text-slate-900 hover:border-slate-300'
          }`}
        >
          <span className="text-[11px] font-semibold block uppercase tracking-wider">Collected</span>
          <span className="text-2xl font-black">{counts.Collected}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto">
          {['All', 'Placed', 'Accepted', 'Preparing', 'Ready', 'Collected'].map(st => (
            <button 
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                statusFilter === st ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
          Showing {filteredOrders.length} order(s) sorted by Pickup Window
        </span>
      </div>

      {/* Orders Queue Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map(order => {
          const action = getNextAction(order.status);

          return (
            <div 
              key={order._id || order.orderId}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <div>
                    <span className="font-mono text-base font-black text-slate-900">#{order.orderId || order.id}</span>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      Placed: {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <span className={`text-xs px-3 py-1 rounded-full font-bold border ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* Student Info */}
                <div className="flex items-center gap-2 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <User className="w-4 h-4 text-slate-500" />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">{order.userName}</span>
                    <span className="text-slate-500 text-[10px]">{order.userEmail}</span>
                  </div>
                </div>

                {/* Pickup Window Highlight */}
                <div className="text-xs text-slate-700 font-semibold mb-3 flex items-center gap-1.5 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-100">
                  <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Pickup Slot: <strong className="text-emerald-900 font-black">{order.pickupSlotTime}</strong></span>
                </div>

                {/* Items List */}
                <div className="space-y-1.5 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ordered Items</div>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs font-bold text-slate-800">
                      <span>• {item.name}</span>
                      <span className="text-emerald-700 font-extrabold">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Lifecycle Transition Button */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-400">Total: <strong className="text-slate-900">₹{order.totalAmount}</strong></span>
                  <button 
                    onClick={() => {
                      setStaffSelectedOrderId(order.orderId || order._id);
                      setStaffTab('details');
                    }}
                    className="text-xs font-bold text-amber-600 hover:underline"
                  >
                    View Details
                  </button>
                </div>

                {action ? (
                  <button 
                    onClick={() => updateOrderStatus(order.orderId || order._id, action.target)}
                    className={`w-full py-3 px-4 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition ${action.color}`}
                  >
                    <span>{action.label}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="text-center py-2 text-xs font-bold text-slate-400 bg-slate-100 rounded-xl">
                    Order Completed
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
