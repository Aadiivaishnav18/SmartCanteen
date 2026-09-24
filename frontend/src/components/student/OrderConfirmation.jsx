import React from 'react';
import { CheckCircle2, Clock, QrCode, ArrowRight, UtensilsCrossed, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OrderConfirmation = () => {
  const { orders, trackedOrderId, setStudentTab, setTrackedOrderId } = useApp();

  const currentOrder = orders.find(o => o.id === trackedOrderId) || orders[0];

  if (!currentOrder) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl text-center space-y-6 relative overflow-hidden">
        
        {/* Glow Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/10 blur-2xl pointer-events-none"></div>

        {/* Animated Success Badge */}
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce-short">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs uppercase font-extrabold text-emerald-600 tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Order Successfully Placed
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-2">Order #{currentOrder.id}</h1>
          <p className="text-slate-500 text-xs mt-1">Stock deducted & pickup slot reserved in kitchen database</p>
        </div>

        {/* Simulated QR Code Box */}
        <div className="bg-slate-950 text-white p-6 rounded-3xl border border-slate-800 max-w-xs mx-auto space-y-3 shadow-lg">
          <div className="bg-white p-4 rounded-2xl inline-block shadow-inner">
            {/* SVG Simulated QR Code */}
            <svg className="w-36 h-36 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="5" width="30" height="30" rx="4" fill="#0f172a" />
              <rect x="10" y="10" width="20" height="20" rx="2" fill="#ffffff" />
              <rect x="15" y="15" width="10" height="10" fill="#0f172a" />

              <rect x="65" y="5" width="30" height="30" rx="4" fill="#0f172a" />
              <rect x="70" y="10" width="20" height="20" rx="2" fill="#ffffff" />
              <rect x="75" y="15" width="10" height="10" fill="#0f172a" />

              <rect x="5" y="65" width="30" height="30" rx="4" fill="#0f172a" />
              <rect x="10" y="70" width="20" height="20" rx="2" fill="#ffffff" />
              <rect x="15" y="75" width="10" height="10" fill="#0f172a" />

              {/* Internal Matrix Patterns */}
              <rect x="42" y="10" width="8" height="8" fill="#059669" />
              <rect x="52" y="20" width="8" height="8" fill="#0f172a" />
              <rect x="42" y="30" width="8" height="8" fill="#0f172a" />
              <rect x="10" y="42" width="8" height="8" fill="#059669" />
              <rect x="25" y="42" width="12" height="8" fill="#0f172a" />
              <rect x="45" y="45" width="10" height="10" fill="#059669" />
              <rect x="60" y="42" width="8" height="8" fill="#0f172a" />
              <rect x="75" y="42" width="12" height="8" fill="#059669" />
              <rect x="42" y="65" width="8" height="8" fill="#0f172a" />
              <rect x="55" y="75" width="10" height="10" fill="#059669" />
              <rect x="75" y="75" width="15" height="15" fill="#0f172a" />
            </svg>
          </div>
          <span className="block text-[11px] font-mono text-emerald-400 font-bold">
            Scan at Counter for Fast Collection
          </span>
        </div>

        {/* Order Details Summary */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left text-xs space-y-2 max-w-md mx-auto">
          <div className="flex justify-between text-slate-600">
            <span>Pickup Time Slot:</span>
            <strong className="text-slate-900 font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              {currentOrder.pickupSlotTime}
            </strong>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Counter Station:</span>
            <strong className="text-slate-900 font-bold">{currentOrder.counterNumber}</strong>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Estimated Preparation:</span>
            <strong className="text-emerald-700 font-bold">{currentOrder.estimatedPrepTime}</strong>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Total Amount Paid:</span>
            <strong className="text-slate-900 font-black text-sm">₹{currentOrder.totalAmount}</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button 
            onClick={() => {
              setTrackedOrderId(currentOrder.id);
              setStudentTab('tracking');
            }}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition"
          >
            <QrCode className="w-4 h-4" />
            Track Order Status
            <ArrowRight className="w-4 h-4" />
          </button>

          <button 
            onClick={() => setStudentTab('menu')}
            className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-5 py-3.5 rounded-2xl text-xs flex items-center justify-center gap-1.5 transition"
          >
            <UtensilsCrossed className="w-4 h-4 text-slate-600" />
            Back to Menu
          </button>
        </div>

      </div>
    </div>
  );
};
