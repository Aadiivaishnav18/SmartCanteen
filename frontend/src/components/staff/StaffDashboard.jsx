import React, { useState } from 'react';
import { 
  ChefHat, 
  Clock, 
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

  // Sorted by pickup time or creation time
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
        return { label: 'Start Preparing', target: 'Preparing', color: 'bg-[#F97316] hover:bg-[#C2410C] text-white' };
      case 'Preparing':
        return { label: 'Mark Ready for Pickup', target: 'Ready', color: 'bg-[#16A34A] hover:bg-[#15803D] text-white shadow-sm' };
      case 'Ready':
        return { label: 'Mark Collected', target: 'Collected', color: 'bg-[#172018] hover:bg-slate-800 text-white' };
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Placed': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Accepted': return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
      case 'Preparing': return 'bg-[#FFEDD5] text-[#C2410C] border border-[#F97316]/30 animate-pulse';
      case 'Ready': return 'bg-[#DCFCE7] text-[#15803D] font-bold border border-[#16A34A]/40';
      case 'Collected': return 'bg-slate-100 text-slate-700 border border-slate-200';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Staff Header */}
      <div className="bg-gradient-to-r from-[#172018] to-[#166534] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/40 rounded-2xl flex items-center justify-center text-amber-400">
            <ChefHat className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">Kitchen Dispatch Queue</h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">Orders organized chronologically by Pickup Time Window</p>
          </div>
        </div>

        <button 
          onClick={() => setStaffTab('inventory')}
          className="bg-white/10 hover:bg-white/20 text-emerald-300 font-semibold px-5 py-3 rounded-xl text-xs flex items-center gap-2 border border-white/20 transition"
        >
          <Package className="w-4 h-4 text-emerald-400" />
          Manage Stock & Inventory
        </button>
      </div>

      {/* Low-Stock Alert Banner for Staff */}
      {lowStockItems.length > 0 && (
        <div className="bg-[#FFEDD5] border border-[#F97316]/30 p-4 rounded-2xl flex items-center justify-between gap-4 text-[#C2410C] text-xs">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#F97316] flex-shrink-0 animate-pulse" />
            <div>
              <span className="font-bold">Low Kitchen Inventory Alert:</span>{' '}
              {lowStockItems.map(item => `${item.name} (${item.stock} left)`).join(', ')}. Restock before lunch rush!
            </div>
          </div>

          <button 
            onClick={() => setStaffTab('inventory')}
            className="bg-[#F97316] hover:bg-[#C2410C] text-white font-bold px-4 py-2 rounded-xl whitespace-nowrap transition"
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
            statusFilter === 'Placed' ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-white border-slate-200 text-[#172018] hover:border-blue-300'
          }`}
        >
          <span className="text-[10px] font-bold block uppercase tracking-wider">Placed</span>
          <span className="text-2xl font-black">{counts.Placed}</span>
        </div>

        <div 
          onClick={() => setStatusFilter('Accepted')}
          className={`p-4 rounded-2xl border cursor-pointer transition text-center ${
            statusFilter === 'Accepted' ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' : 'bg-white border-slate-200 text-[#172018] hover:border-indigo-300'
          }`}
        >
          <span className="text-[10px] font-bold block uppercase tracking-wider">Accepted</span>
          <span className="text-2xl font-black">{counts.Accepted}</span>
        </div>

        <div 
          onClick={() => setStatusFilter('Preparing')}
          className={`p-4 rounded-2xl border cursor-pointer transition text-center ${
            statusFilter === 'Preparing' ? 'bg-[#F97316] text-white border-[#F97316] shadow-xs' : 'bg-white border-slate-200 text-[#172018] hover:border-orange-300'
          }`}
        >
          <span className="text-[10px] font-bold block uppercase tracking-wider">In Prep</span>
          <span className="text-2xl font-black">{counts.Preparing}</span>
        </div>

        <div 
          onClick={() => setStatusFilter('Ready')}
          className={`p-4 rounded-2xl border cursor-pointer transition text-center ${
            statusFilter === 'Ready' ? 'bg-[#16A34A] text-white border-[#16A34A] shadow-xs' : 'bg-white border-slate-200 text-[#172018] hover:border-emerald-300'
          }`}
        >
          <span className="text-[10px] font-bold block uppercase tracking-wider">Ready</span>
          <span className="text-2xl font-black">{counts.Ready}</span>
        </div>

        <div 
          onClick={() => setStatusFilter('Collected')}
          className={`p-4 rounded-2xl border cursor-pointer transition text-center col-span-2 sm:col-span-1 ${
            statusFilter === 'Collected' ? 'bg-[#172018] text-white border-[#172018] shadow-xs' : 'bg-white border-slate-200 text-[#172018] hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold block uppercase tracking-wider">Collected</span>
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
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                statusFilter === st ? 'bg-[#172018] text-white' : 'bg-white text-[#64748B] border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <span className="text-xs text-[#64748B] font-semibold hidden sm:inline">
          Showing {filteredOrders.length} order(s)
        </span>
      </div>

      {/* Orders Queue Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map(order => {
          const action = getNextAction(order.status);
          const orderIdStr = order.orderId || order.id || order._id;

          return (
            <div 
              key={orderIdStr}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-[#16A34A]/30 transition flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <div>
                    <span className="font-mono text-base font-black text-[#172018]">#{orderIdStr}</span>
                    <span className="text-xs text-[#64748B] block mt-0.5">
                      Placed: {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <span className={`text-xs px-3 py-1 rounded-full font-bold ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* Student Info */}
                <div className="flex items-center gap-2 mb-3 bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-200">
                  <User className="w-4 h-4 text-[#64748B]" />
                  <div className="text-xs">
                    <span className="font-bold text-[#172018] block">{order.userName}</span>
                    <span className="text-[#64748B] text-[10px]">{order.userEmail}</span>
                  </div>
                </div>

                {/* Pickup Window Highlight */}
                <div className="text-xs text-[#172018] font-semibold mb-3 flex items-center gap-1.5 bg-[#DCFCE7] p-2.5 rounded-xl border border-[#16A34A]/30">
                  <Clock className="w-4 h-4 text-[#16A34A] flex-shrink-0" />
                  <span>Pickup Slot: <strong className="text-[#15803D] font-black">{order.pickupSlotTime}</strong></span>
                </div>

                {/* Items List */}
                <div className="space-y-1.5 bg-[#F8FAFC] p-3 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Ordered Items</div>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs font-bold text-[#172018]">
                      <span>• {item.name}</span>
                      <span className="text-[#16A34A] font-extrabold">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action Button */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[#64748B]">Total: <strong className="text-[#172018]">₹{order.totalAmount}</strong></span>
                  <button 
                    onClick={() => {
                      setStaffSelectedOrderId(orderIdStr);
                      setStaffTab('details');
                    }}
                    className="text-xs font-bold text-[#16A34A] hover:underline"
                  >
                    View Checklist
                  </button>
                </div>

                {action ? (
                  <button 
                    onClick={() => updateOrderStatus(orderIdStr, action.target)}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition ${action.color}`}
                  >
                    <span>{action.label}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="text-center py-2 text-xs font-bold text-[#64748B] bg-slate-100 rounded-xl">
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
