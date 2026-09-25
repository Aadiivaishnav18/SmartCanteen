import React from 'react';
import { Clock, RotateCcw, QrCode, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OrderHistory = () => {
  const { 
    orders, 
    pagination, 
    orderFilters, 
    setOrderFilters, 
    addToCart, 
    setStudentTab, 
    setTrackedOrderId 
  } = useApp();

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Placed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Accepted': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Preparing': return 'bg-[#FFEDD5] text-[#C2410C] border border-[#F97316]/30';
      case 'Ready': return 'bg-[#DCFCE7] text-[#15803D] border border-[#16A34A]/40 font-bold';
      case 'Collected': return 'bg-slate-100 text-[#172018] border-slate-200';
      case 'Cancelled': return 'bg-[#FEE2E2] text-[#B91C1C] border border-[#EF4444]/30';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#172018]">Your Orders</h1>
          <p className="text-[#64748B] text-xs sm:text-sm mt-1">Review active and previous canteen pre-orders</p>
        </div>

        <button 
          onClick={() => setStudentTab('menu')}
          className="bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition"
        >
          + New Pre-Order
        </button>
      </div>

      {/* Date Range & Status Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-semibold text-[#172018]">
          
          {/* Date Filtering */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2">
              <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
              <span>Start Date:</span>
              <input 
                type="date"
                value={orderFilters.startDate}
                onChange={e => setOrderFilters({ ...orderFilters, startDate: e.target.value, page: 1 })}
                className="bg-transparent focus:outline-none text-[#172018]"
              />
            </div>

            <div className="flex items-center gap-2 bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2">
              <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
              <span>End Date:</span>
              <input 
                type="date"
                value={orderFilters.endDate}
                onChange={e => setOrderFilters({ ...orderFilters, endDate: e.target.value, page: 1 })}
                className="bg-transparent focus:outline-none text-[#172018]"
              />
            </div>

            {(orderFilters.startDate || orderFilters.endDate || orderFilters.status !== 'All') && (
              <button 
                onClick={() => setOrderFilters({ status: 'All', startDate: '', endDate: '', page: 1, limit: 10, sortBy: 'createdAt' })}
                className="text-xs text-[#EF4444] hover:underline font-bold"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <span className="text-[#64748B]">Sort:</span>
            <select 
              value={orderFilters.sortBy}
              onChange={e => setOrderFilters({ ...orderFilters, sortBy: e.target.value, page: 1 })}
              className="bg-[#F8FAFC] border border-slate-200 rounded-xl px-2.5 py-1.5 text-[#172018] font-semibold focus:outline-none"
            >
              <option value="createdAt">Date (Latest)</option>
              <option value="pickupSlotTime">Pickup Window</option>
            </select>
          </div>

        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100">
          {['All', 'Placed', 'Accepted', 'Preparing', 'Ready', 'Collected', 'Cancelled'].map(st => (
            <button 
              key={st}
              onClick={() => setOrderFilters({ ...orderFilters, status: st, page: 1 })}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                orderFilters.status === st
                  ? 'bg-[#172018] text-white shadow-xs'
                  : 'bg-[#F8FAFC] text-[#64748B] hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Orders List */}
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map(order => {
            const orderIdStr = order.orderId || order.id || order._id;

            return (
              <div 
                key={orderIdStr}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:border-[#16A34A]/30 transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-black text-[#172018]">#{orderIdStr}</span>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="text-xs text-[#64748B] font-medium flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#16A34A]" />
                    Pickup Window: <strong className="text-[#172018] font-bold">{order.pickupSlotTime}</strong>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="md:col-span-2 space-y-1">
                    <div className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">Ordered Items</div>
                    <div className="text-xs font-bold text-[#172018]">
                      {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                    </div>
                    <div className="text-[11px] text-[#64748B]">
                      Payment: <strong className="text-[#172018]">{order.paymentMethod}</strong> • Counter: <strong>{order.counterNumber}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4">
                    <div className="text-right">
                      <span className="text-[10px] text-[#94A3B8] block uppercase font-bold">Total Amount</span>
                      <span className="text-xl font-black text-[#172018]">₹{order.totalAmount}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {['Placed', 'Accepted', 'Preparing', 'Ready'].includes(order.status) && (
                        <button 
                          onClick={() => {
                            setTrackedOrderId(orderIdStr);
                            setStudentTab('tracking');
                          }}
                          className="bg-[#172018] hover:bg-slate-800 text-white p-2.5 rounded-xl text-xs font-semibold flex items-center gap-1 shadow-xs transition"
                          title="Track live order status"
                        >
                          <QrCode className="w-4 h-4 text-emerald-400" />
                        </button>
                      )}

                      <button 
                        onClick={() => {
                          order.items.forEach(item => addToCart(item.foodId || item._id || item.id, item.quantity));
                          setStudentTab('cart');
                        }}
                        className="bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-xs transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Reorder
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}

          {/* Pagination Controls */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between text-xs font-semibold text-[#64748B]">
            <div>
              Showing page <strong className="text-[#172018]">{pagination.page}</strong> of <strong className="text-[#172018]">{pagination.totalPages || 1}</strong> ({pagination.total} orders)
            </div>

            <div className="flex items-center gap-2">
              <button 
                disabled={pagination.page <= 1}
                onClick={() => setOrderFilters({ ...orderFilters, page: pagination.page - 1 })}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 text-[#172018]"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <button 
                disabled={!pagination.hasMore}
                onClick={() => setOrderFilters({ ...orderFilters, page: pagination.page + 1 })}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 text-[#172018]"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <p className="text-[#64748B] text-sm">No orders matching the selected filter criteria.</p>
        </div>
      )}

    </div>
  );
};
