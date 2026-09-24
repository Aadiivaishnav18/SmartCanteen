import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  UtensilsCrossed, 
  ChefHat, 
  ShoppingBag, 
  Sparkles, 
  AlertCircle,
  QrCode,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OrderTracking = () => {
  const { orders, trackedOrderId, updateOrderStatus, setStudentTab } = useApp();

  const currentOrder = orders.find(o => o.id === trackedOrderId) || orders[0];

  if (!currentOrder) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <p className="text-slate-500">No order selected for tracking.</p>
        <button onClick={() => setStudentTab('history')} className="mt-4 bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs">
          View Order History
        </button>
      </div>
    );
  }

  const steps = ['Placed', 'Accepted', 'Preparing', 'Ready', 'Collected'];

  const getStepIndex = (status) => {
    return steps.indexOf(status);
  };

  const currentIndex = getStepIndex(currentOrder.status);

  // Quick staff simulation for demo ease
  const handleSimulateNextState = () => {
    const nextMap = {
      'Placed': 'Accepted',
      'Accepted': 'Preparing',
      'Preparing': 'Ready',
      'Ready': 'Collected'
    };
    const next = nextMap[currentOrder.status];
    if (next) {
      updateOrderStatus(currentOrder.id, next);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Info Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl pointer-events-none"></div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-extrabold text-emerald-400 tracking-wider">Live Queue Tracker</span>
            <span className="font-mono text-sm font-black text-slate-300">#{currentOrder.id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Order Progress & Counter Ticket</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Pickup Window: <strong className="text-white">{currentOrder.pickupSlotTime}</strong> at <strong className="text-emerald-400">{currentOrder.counterNumber}</strong>
          </p>
        </div>

        {/* Status Highlight Banner */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-right w-full md:w-auto">
          <div className="text-[11px] font-semibold text-slate-400">Current Order Status</div>
          <div className={`text-lg font-black mt-0.5 ${
            currentOrder.status === 'Ready' ? 'text-emerald-400 animate-bounce-short' :
            currentOrder.status === 'Preparing' ? 'text-amber-400 animate-pulse' :
            'text-blue-400'
          }`}>
            {currentOrder.status === 'Ready' ? '🎉 READY AT COUNTER 1!' : currentOrder.status}
          </div>
        </div>
      </div>

      {/* Real-time Ready Alert Banner */}
      {currentOrder.status === 'Ready' && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-slate-950 p-6 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-bounce-short">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-slate-950 flex-shrink-0">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-black">Order Ready for Collection!</h2>
              <p className="text-xs font-semibold text-slate-950/80">Please present your QR code ticket at Counter 1 (Express Pickup).</p>
            </div>
          </div>
          <span className="bg-slate-950 text-emerald-400 font-extrabold text-xs px-4 py-2 rounded-xl border border-slate-800">
            Show QR Below
          </span>
        </div>
      )}

      {/* Visual 5-Step Progress Tracker Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
        <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-600" />
          5-Stage Kitchen Lifecycle Progress
        </h2>

        {/* Stepper bar */}
        <div className="relative flex items-center justify-between max-w-2xl mx-auto py-4">
          {/* Background Connecting Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
          
          {/* Active Colored Line */}
          <div 
            className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500"
            style={{ width: `${(Math.max(0, currentIndex) / (steps.length - 1)) * 100}%` }}
          ></div>

          {steps.map((step, idx) => {
            const isDone = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isUpcoming = idx > currentIndex;

            return (
              <div key={step} className="relative z-10 flex flex-col items-center group">
                <div className={`w-10 h-10 rounded-full font-bold text-xs flex items-center justify-center transition-all duration-300 ${
                  isDone ? 'bg-emerald-600 text-white shadow-md' :
                  isCurrent ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/30 shadow-lg scale-110' :
                  'bg-slate-100 text-slate-400 border border-slate-200'
                }`}>
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>

                <span className={`text-[11px] font-bold mt-2.5 transition ${
                  isCurrent ? 'text-emerald-700 font-extrabold' :
                  isDone ? 'text-slate-800' : 'text-slate-400'
                }`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {/* Queue Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
            <span className="text-[11px] text-slate-400 font-semibold block">Queue Position</span>
            <span className="text-xl font-black text-slate-900">
              {currentOrder.status === 'Ready' || currentOrder.status === 'Collected' ? 'At Counter' : `#${currentOrder.queuePosition} in queue`}
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
            <span className="text-[11px] text-slate-400 font-semibold block">Estimated Prep Time</span>
            <span className="text-xl font-black text-emerald-600">{currentOrder.estimatedPrepTime}</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
            <span className="text-[11px] text-slate-400 font-semibold block">Pickup Counter</span>
            <span className="text-xl font-black text-slate-900">{currentOrder.counterNumber}</span>
          </div>
        </div>
      </div>

      {/* QR Ticket & Items Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* QR Code Ticket */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 text-center space-y-4 shadow-lg">
          <h3 className="text-sm font-bold text-slate-200 flex items-center justify-center gap-2">
            <QrCode className="w-4 h-4 text-emerald-400" />
            Digital Pickup Pass
          </h3>

          <div className="bg-white p-4 rounded-2xl inline-block shadow-inner">
            <svg className="w-32 h-32 mx-auto" viewBox="0 0 100 100" fill="none">
              <rect x="5" y="5" width="30" height="30" rx="4" fill="#0f172a" />
              <rect x="10" y="10" width="20" height="20" rx="2" fill="#ffffff" />
              <rect x="15" y="15" width="10" height="10" fill="#0f172a" />
              <rect x="65" y="5" width="30" height="30" rx="4" fill="#0f172a" />
              <rect x="70" y="10" width="20" height="20" rx="2" fill="#ffffff" />
              <rect x="75" y="15" width="10" height="10" fill="#0f172a" />
              <rect x="5" y="65" width="30" height="30" rx="4" fill="#0f172a" />
              <rect x="10" y="70" width="20" height="20" rx="2" fill="#ffffff" />
              <rect x="15" y="75" width="10" height="10" fill="#0f172a" />
              <rect x="42" y="10" width="8" height="8" fill="#059669" />
              <rect x="52" y="20" width="8" height="8" fill="#0f172a" />
              <rect x="45" y="45" width="10" height="10" fill="#059669" />
            </svg>
          </div>
          <span className="block text-xs font-mono text-emerald-300 font-bold">PASS: #{currentOrder.id}</span>
        </div>

        {/* Order Items Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Items in Order #{currentOrder.id}
          </h3>

          <div className="space-y-3">
            {currentOrder.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs text-slate-800">
                <span className="font-semibold">{item.name} <span className="text-slate-400">x{item.quantity}</span></span>
                <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 flex justify-between font-black text-sm text-slate-900">
            <span>Total Paid</span>
            <span className="text-emerald-600">₹{currentOrder.totalAmount}</span>
          </div>
        </div>

      </div>

      {/* Presenter Shortcut: Simulate Kitchen Workflow */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-amber-900 font-semibold">
          <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>Hackathon Demo Control: Simulate staff advancing this order through kitchen states</span>
        </div>

        {currentOrder.status !== 'Collected' ? (
          <button 
            onClick={handleSimulateNextState}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-4 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 whitespace-nowrap"
          >
            Advance to "{steps[currentIndex + 1]}" state <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <span className="text-emerald-700 font-bold bg-emerald-100 px-3 py-1 rounded-lg">
            Order Lifecycle Completed!
          </span>
        )}
      </div>

    </div>
  );
};
