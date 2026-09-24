import React, { useState } from 'react';
import { ListOrdered, Search, Clock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminOrders = () => {
  const { orders, updateOrderStatus, cancelOrder } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) || 
                          o.userName.toLowerCase().includes(search.toLowerCase()) ||
                          o.userEmail.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Master Orders Audit Log</h1>
          <p className="text-slate-500 text-xs sm:text-sm">Complete record of student pre-orders across all counters</p>
        </div>

        <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 text-xs text-slate-600 font-semibold">
          Total Records: <strong className="text-purple-600">{orders.length}</strong>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text" 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search Order ID, Student Name..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-900 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['All', 'Placed', 'Accepted', 'Preparing', 'Ready', 'Collected', 'Cancelled'].map(st => (
            <button 
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                statusFilter === st ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Audit Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-extrabold">
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
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-4 font-mono font-black text-slate-900">#{order.id}</td>

                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-900 block">{order.userName}</span>
                    <span className="text-slate-400 text-[10px]">{order.userEmail}</span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-slate-800 font-semibold line-clamp-1 max-w-xs">
                      {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-slate-700 font-semibold">{order.pickupSlotTime}</td>

                  <td className="px-6 py-4 font-black text-slate-900">₹{order.totalAmount}</td>

                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    {order.status !== 'Collected' && order.status !== 'Cancelled' && (
                      <button 
                        onClick={() => cancelOrder(order.id)}
                        className="text-xs text-rose-600 hover:text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100 font-semibold transition"
                      >
                        Cancel & Restore Stock
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
