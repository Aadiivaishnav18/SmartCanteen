import React from 'react';
import { CheckCircle2, Clock, QrCode, ArrowRight, UtensilsCrossed } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OrderConfirmation = () => {
  const { orders, trackedOrderId, setStudentTab, setTrackedOrderId } = useApp();

  const currentOrder = orders.find(o => (o.id === trackedOrderId || o._id === trackedOrderId || o.orderId === trackedOrderId)) || orders[0];

  if (!currentOrder) return null;

  const orderNumber = currentOrder.orderId || currentOrder.id || currentOrder._id;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl text-center space-y-6 relative overflow-hidden">
        
        {/* Glow Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#DCFCE7] blur-3xl pointer-events-none"></div>

        {/* Success Badge */}
        <div className="w-20 h-20 bg-[#DCFCE7] text-[#16A34A] rounded-full flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs uppercase font-extrabold text-[#15803D] tracking-wider bg-[#DCFCE7] px-3 py-1 rounded-full border border-[#16A34A]/30">
            Order Confirmed!
          </span>
          <h1 className="text-3xl font-black text-[#172018] mt-2">Order #{orderNumber}</h1>
          <p className="text-[#64748B] text-xs sm:text-sm mt-1">Stock deducted & pickup slot reserved in canteen system</p>
        </div>

        {/* Simulated QR Code Pass */}
        <div className="bg-[#172018] text-white p-6 rounded-2xl border border-slate-800 max-w-xs mx-auto space-y-3 shadow-md">
          <div className="bg-white p-4 rounded-xl inline-block">
            <svg className="w-36 h-36 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="5" width="30" height="30" rx="4" fill="#172018" />
              <rect x="10" y="10" width="20" height="20" rx="2" fill="#ffffff" />
              <rect x="15" y="15" width="10" height="10" fill="#172018" />

              <rect x="65" y="5" width="30" height="30" rx="4" fill="#172018" />
              <rect x="70" y="10" width="20" height="20" rx="2" fill="#ffffff" />
              <rect x="75" y="15" width="10" height="10" fill="#172018" />

              <rect x="5" y="65" width="30" height="30" rx="4" fill="#172018" />
              <rect x="10" y="70" width="20" height="20" rx="2" fill="#ffffff" />
              <rect x="15" y="75" width="10" height="10" fill="#172018" />

              <rect x="42" y="10" width="8" height="8" fill="#16A34A" />
              <rect x="52" y="20" width="8" height="8" fill="#172018" />
              <rect x="42" y="30" width="8" height="8" fill="#172018" />
              <rect x="10" y="42" width="8" height="8" fill="#16A34A" />
              <rect x="25" y="42" width="12" height="8" fill="#172018" />
              <rect x="45" y="45" width="10" height="10" fill="#16A34A" />
              <rect x="60" y="42" width="8" height="8" fill="#172018" />
              <rect x="75" y="42" width="12" height="8" fill="#16A34A" />
              <rect x="42" y="65" width="8" height="8" fill="#172018" />
              <rect x="55" y="75" width="10" height="10" fill="#16A34A" />
              <rect x="75" y="75" width="15" height="15" fill="#172018" />
            </svg>
          </div>
          <span className="block text-xs font-mono text-emerald-400 font-bold">
            Scan Pass at Canteen Counter
          </span>
        </div>

        {/* Order Details Summary */}
        <div className="bg-[#F8FAFC] p-4.5 rounded-2xl border border-slate-200 text-left text-xs space-y-2.5 max-w-md mx-auto">
          <div className="flex justify-between text-[#64748B]">
            <span>Pickup Time Slot:</span>
            <strong className="text-[#172018] font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#16A34A]" />
              {currentOrder.pickupSlotTime}
            </strong>
          </div>
          <div className="flex justify-between text-[#64748B]">
            <span>Counter Station:</span>
            <strong className="text-[#172018] font-bold">{currentOrder.counterNumber}</strong>
          </div>
          <div className="flex justify-between text-[#64748B]">
            <span>Estimated Preparation:</span>
            <strong className="text-[#15803D] font-bold">{currentOrder.estimatedPrepTime}</strong>
          </div>
          <div className="flex justify-between text-[#64748B] pt-1 border-t border-slate-200">
            <span>Total Amount Paid:</span>
            <strong className="text-[#172018] font-extrabold text-sm">₹{currentOrder.totalAmount}</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button 
            onClick={() => {
              setTrackedOrderId(orderNumber);
              setStudentTab('tracking');
            }}
            className="w-full sm:w-auto bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold px-6 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition"
          >
            <QrCode className="w-4 h-4" />
            Track Order
            <ArrowRight className="w-4 h-4" />
          </button>

          <button 
            onClick={() => setStudentTab('menu')}
            className="w-full sm:w-auto bg-white hover:bg-slate-50 text-[#172018] font-semibold px-5 py-3 rounded-xl text-xs border border-slate-300 flex items-center justify-center gap-1.5 transition"
          >
            <UtensilsCrossed className="w-4 h-4 text-[#64748B]" />
            Back to Menu
          </button>
        </div>

      </div>
    </div>
  );
};
