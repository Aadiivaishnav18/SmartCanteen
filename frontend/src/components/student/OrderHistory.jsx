import React from 'react';
import { Clock, RotateCcw, QrCode, ArrowRight, Calendar, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
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
      case 'Placed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Accepted': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Preparing': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Ready': return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
      case 'Collected': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Cancelled': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Order History</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Server-side paginated audit of active & past canteen pre-orders</p>
        </div>

        <button 
          onClick={() => setStudentTab('menu')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-sm transition"
        >
          + New Pre-Order
        </button>
      </div>

      {/* Date Range & Status Filter Control Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-semibold text-slate-700">
          
          {/* Date Filtering Inputs */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Start Date:</span>
              <input 
                type="date"
                value={orderFilters.startDate}
                onChange={e => setOrderFilters({ ...orderFilters, startDate: e.target.value, page: 1 })}
                className="bg-transparent focus:outline-none text-slate-900"
              />
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>End Date:</span>
              <input 
                type="date"
                value={orderFilters.endDate}
                onChange={e => setOrderFilters({ ...orderFilters, endDate: e.target.value, page: 1 })}
                className="bg-transparent focus:outline-none text-slate-900"
              />
            </div>

            {(orderFilters.startDate || orderFilters.endDate || orderFilters.status !== 'All') && (
              <button 
                onClick={() => setOrderFilters({ status: 'All', startDate: '', endDate: '', page: 1, limit: 10, sortBy: 'createdAt' })}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold underline"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Sort By Selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Sort By:</span>
            <select 
              value={orderFilters.sortBy}
              onChange={e => setOrderFilters({ ...orderFilters, sortBy: e.target.value, page: 1 })}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-900 font-bold focus:outline-none"
            >
              <option value="createdAt">Date Placed (Latest)</option>
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
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                orderFilters.status === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
          {orders.map(order => (
            <div 
              key={order._id || order.orderId}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-emerald-200 transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-base font-black text-slate-900">#{order.orderId || order.id}</span>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold border ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  Pickup Window: <strong className="text-slate-800 font-bold">{order.pickupSlotTime}</strong>
                </div>
              </div>

              {/* Items Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="md:col-span-2 space-y-1">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Ordered Items</div>
                  <div className="text-xs font-bold text-slate-800">
                    {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Payment Method: <strong className="text-slate-700">{order.paymentMethod}</strong> • Counter: <strong>{order.counterNumber}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Total Amount</span>
                    <span className="text-xl font-black text-slate-900">₹{order.totalAmount}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {['Placed', 'Accepted', 'Preparing', 'Ready'].includes(order.status) && (
                      <button 
                        onClick={() => {
                          setTrackedOrderId(order.orderId || order._id);
                          setStudentTab('tracking');
                        }}
                        className="bg-slate-900 hover:bg-slate-800 text-white p-2.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition"
                        title="Track live order status"
                      >
                        <QrCode className="w-4 h-4 text-emerald-400" />
                      </button>
                    )}

                    <button 
                      onClick={() => {
                        order.items.forEach(item => addToCart(item.foodId || item._id, item.quantity));
                        setStudentTab('cart');
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-xs transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reorder
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))}

          {/* Server-Side Pagination Controls */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-600">
            <div>
              Showing page <strong className="text-slate-900">{pagination.page}</strong> of <strong className="text-slate-900">{pagination.totalPages || 1}</strong> ({pagination.total} total orders)
            </div>

            <div className="flex items-center gap-2">
              <button 
                disabled={pagination.page <= 1}
                onClick={() => setOrderFilters({ ...orderFilters, page: pagination.page - 1 })}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <button 
                disabled={!pagination.hasMore}
                onClick={() => setOrderFilters({ ...orderFilters, page: pagination.page + 1 })}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <p className="text-slate-500 text-sm">No orders matching the selected filter criteria.</p>
        </div>
      )}

    </div>
  );
};
