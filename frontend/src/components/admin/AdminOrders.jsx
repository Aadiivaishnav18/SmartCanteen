import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminOrders = () => {
  const { orders, cancelOrder } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredOrders = orders.filter(o => {
    const orderIdStr = o.orderId || o.id || o._id || '';
    const matchesSearch = orderIdStr.toLowerCase().includes(search.toLowerCase()) || 
                          (o.userName && o.userName.toLowerCase().includes(search.toLowerCase())) ||
                          (o.userEmail && o.userEmail.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Placed': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Accepted': return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
      case 'Preparing': return 'bg-[#FFEDD5] text-[#C2410C] border border-[#F97316]/30';
      case 'Ready': return 'bg-[#DCFCE7] text-[#15803D] border border-[#16A34A]/40 font-bold';
      case 'Collected': return 'bg-slate-100 text-[#172018] border border-slate-200';
      case 'Cancelled': return 'bg-[#FEE2E2] text-[#B91C1C] border border-[#EF4444]/30';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#172018]">Master Orders Audit Log</h1>
          <p className="text-[#64748B] text-xs sm:text-sm">Complete audit record of student pre-orders</p>
        </div>

        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs text-[#64748B] font-semibold">
          Total Records: <strong className="text-[#16A34A]">{orders.length}</strong>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5" />
          <input 
            type="text" 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search Order ID, Student Name..."
            className="w-full h-11 bg-white border border-slate-300 rounded-xl pl-10 pr-4 text-xs text-[#172018] focus:outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['All', 'Placed', 'Accepted', 'Preparing', 'Ready', 'Collected', 'Cancelled'].map(st => (
            <button 
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                statusFilter === st ? 'bg-[#172018] text-white shadow-xs' : 'bg-[#F8FAFC] text-[#64748B] hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-slate-200 text-[#64748B] uppercase tracking-wider font-extrabold">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Items Summary</th>
                <th className="px-6 py-4">Pickup Window</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Admin Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredOrders.map(order => {
                const orderIdStr = order.orderId || order.id || order._id;

                return (
                  <tr key={orderIdStr} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 font-mono font-black text-[#172018]">#{orderIdStr}</td>

                    <td className="px-6 py-4">
                      <span className="font-bold text-[#172018] block">{order.userName}</span>
                      <span className="text-[#64748B] text-[10px]">{order.userEmail}</span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-[#172018] font-semibold line-clamp-1 max-w-xs">
                        {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-[#172018] font-semibold">{order.pickupSlotTime}</td>

                    <td className="px-6 py-4 font-black text-[#172018]">₹{order.totalAmount}</td>

                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {order.status !== 'Collected' && order.status !== 'Cancelled' && (
                        <button 
                          onClick={() => cancelOrder(orderIdStr)}
                          className="text-xs text-[#EF4444] hover:text-[#B91C1C] bg-[#FEE2E2] px-2.5 py-1 rounded-lg border border-[#EF4444]/30 font-semibold transition"
                        >
                          Cancel Order
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
