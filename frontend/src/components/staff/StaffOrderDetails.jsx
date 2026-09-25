import React from 'react';
import { ArrowLeft, Clock, User, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StaffOrderDetails = () => {
  const { 
    orders, 
    staffSelectedOrderId, 
    updateOrderStatus, 
    setStaffTab 
  } = useApp();

  const order = orders.find(o => (o.id === staffSelectedOrderId || o._id === staffSelectedOrderId || o.orderId === staffSelectedOrderId)) || orders[0];

  if (!order) return null;

  const orderIdStr = order.orderId || order.id || order._id;
  const steps = ['Placed', 'Accepted', 'Preparing', 'Ready', 'Collected'];
  const currentIndex = steps.indexOf(order.status);

  const getNextAction = (status) => {
    switch (status) {
      case 'Placed': return { label: 'Accept Order', target: 'Accepted' };
      case 'Accepted': return { label: 'Start Preparing', target: 'Preparing' };
      case 'Preparing': return { label: 'Mark Ready for Pickup', target: 'Ready' };
      case 'Ready': return { label: 'Mark Collected by Student', target: 'Collected' };
      default: return null;
    }
  };

  const action = getNextAction(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setStaffTab('dashboard')}
          className="bg-white p-2 rounded-xl border border-slate-200 text-[#172018] hover:bg-slate-50 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-[#172018]">Kitchen Order Checklist #{orderIdStr}</h1>
          <p className="text-[#64748B] text-xs">Operational details & Preparation checklist</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        
        {/* Top Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs text-[#64748B] font-semibold block">Student Info</span>
            <strong className="text-sm font-bold text-[#172018] block">{order.userName}</strong>
            <span className="text-xs text-[#64748B]">{order.userEmail}</span>
          </div>

          <div>
            <span className="text-xs text-[#64748B] font-semibold block">Pickup Time Slot</span>
            <strong className="text-sm font-bold text-[#16A34A] block">{order.pickupSlotTime}</strong>
            <span className="text-xs text-[#64748B]">{order.counterNumber}</span>
          </div>

          <div>
            <span className="text-xs text-[#64748B] font-semibold block">Current Lifecycle State</span>
            <span className="inline-block mt-1 px-3 py-1 bg-[#16A34A] text-white font-bold text-xs rounded-full">
              {order.status}
            </span>
          </div>
        </div>

        {/* Timeline Progress */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase font-bold text-[#94A3B8] tracking-wider">Order Lifecycle Progress</h3>
          <div className="grid grid-cols-5 gap-2 text-center">
            {steps.map((st, idx) => {
              const active = idx <= currentIndex;
              return (
                <div key={st} className={`p-3 rounded-2xl border text-xs font-bold ${
                  idx === currentIndex ? 'bg-[#16A34A] text-white border-[#16A34A] shadow-xs' :
                  active ? 'bg-[#DCFCE7] text-[#15803D] border-[#16A34A]/30' :
                  'bg-[#F8FAFC] text-[#94A3B8] border-slate-200'
                }`}>
                  <span className="block text-[10px] opacity-75">Step {idx + 1}</span>
                  {st}
                </div>
              );
            })}
          </div>
        </div>

        {/* Ordered Items Table */}
        <div>
          <h3 className="text-xs uppercase font-bold text-[#94A3B8] tracking-wider mb-3">Preparation Checklist</h3>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
            {order.items.map((item, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between bg-[#F8FAFC]">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <span className="font-bold text-[#172018] text-sm block">{item.name}</span>
                    <span className="text-xs text-[#64748B]">₹{item.price} per unit</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-[#64748B] block">Quantity Needed</span>
                  <span className="text-lg font-black text-[#16A34A]">x{item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        {action && (
          <div className="pt-4 border-t border-slate-100">
            <button 
              onClick={() => updateOrderStatus(orderIdStr, action.target)}
              className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold py-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition"
            >
              Advance Order State to "{action.label}"
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
