import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  QrCode,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OrderTracking = () => {
  const { orders, trackedOrderId, updateOrderStatus, setStudentTab } = useApp();

  const currentOrder = orders.find(o => (o.id === trackedOrderId || o._id === trackedOrderId || o.orderId === trackedOrderId)) || orders[0];

  if (!currentOrder) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <p className="text-[#64748B] text-sm">No order selected for tracking.</p>
        <button onClick={() => setStudentTab('history')} className="mt-4 bg-[#16A34A] text-white font-semibold px-4 py-2 rounded-xl text-xs">
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
  const orderNumber = currentOrder.orderId || currentOrder.id || currentOrder._id;

  // Demo shortcut to advance order status
  const handleSimulateNextState = () => {
    const nextMap = {
      'Placed': 'Accepted',
      'Accepted': 'Preparing',
      'Preparing': 'Ready',
      'Ready': 'Collected'
    };
    const next = nextMap[currentOrder.status];
    if (next) {
      updateOrderStatus(orderNumber, next);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Info Banner */}
      <div className="bg-gradient-to-r from-[#172018] to-[#166534] text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-extrabold text-emerald-400 tracking-wider">Live Queue Tracker</span>
            <span className="font-mono text-sm font-black text-slate-300">#{orderNumber}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Order Progress & Counter Pass</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Pickup Window: <strong className="text-white">{currentOrder.pickupSlotTime}</strong> at <strong className="text-emerald-300">{currentOrder.counterNumber}</strong>
          </p>
        </div>

        {/* Status Highlight */}
        <div className="bg-[#172018]/80 backdrop-blur-xs p-4 rounded-2xl border border-white/10 text-right w-full md:w-auto">
          <div className="text-[10px] uppercase font-bold text-slate-400">Current Order Status</div>
          <div className={`text-lg font-extrabold mt-0.5 ${
            currentOrder.status === 'Ready' ? 'text-emerald-400' :
            currentOrder.status === 'Preparing' ? 'text-[#F97316]' :
            'text-emerald-300'
          }`}>
            {currentOrder.status === 'Ready' ? 'READY AT COUNTER 1!' : currentOrder.status}
          </div>
        </div>
      </div>

      {/* Real-time Ready Alert Banner */}
      {currentOrder.status === 'Ready' && (
        <div className="bg-[#DCFCE7] border border-[#16A34A]/40 text-[#15803D] p-6 rounded-3xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#16A34A] flex items-center justify-center text-white flex-shrink-0">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Order Ready for Pickup!</h2>
              <p className="text-xs font-semibold text-[#15803D]/80">Please present your digital pass at Counter 1 (Express Pickup).</p>
            </div>
          </div>
          <span className="bg-[#16A34A] text-white font-bold text-xs px-4 py-2 rounded-xl">
            Show Pass Below
          </span>
        </div>
      )}

      {/* Visual 5-Step Progress Tracker Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-8">
        <h2 className="text-base font-bold text-[#172018] border-b border-slate-100 pb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#16A34A]" />
          5-Stage Kitchen Lifecycle Progress
        </h2>

        {/* Stepper bar (Desktop: Horizontal / Mobile: Responsive) */}
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between max-w-2xl mx-auto py-2 gap-6 md:gap-0">
          
          {/* Desktop Background Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
          
          {/* Desktop Active Colored Line */}
          <div 
            className="hidden md:block absolute top-1/2 left-0 h-1 bg-[#16A34A] -translate-y-1/2 z-0 transition-all duration-500"
            style={{ width: `${(Math.max(0, currentIndex) / (steps.length - 1)) * 100}%` }}
          ></div>

          {steps.map((step, idx) => {
            const isDone = idx < currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <div key={step} className="relative z-10 flex md:flex-col items-center gap-3 md:gap-0 w-full md:w-auto">
                <div className={`w-10 h-10 rounded-full font-bold text-xs flex items-center justify-center transition-all duration-300 ${
                  isDone ? 'bg-[#16A34A] text-white shadow-xs' :
                  isCurrent ? 'bg-[#16A34A] text-white ring-4 ring-emerald-500/20 shadow-md scale-110' :
                  'bg-slate-100 text-slate-400 border border-slate-200'
                }`}>
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>

                <span className={`text-xs font-bold md:mt-2.5 transition ${
                  isCurrent ? 'text-[#16A34A] font-extrabold' :
                  isDone ? 'text-[#172018]' : 'text-slate-400'
                }`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {/* Queue Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          <div className="bg-[#F8FAFC] p-4 rounded-2xl text-center border border-slate-200">
            <span className="text-[11px] text-[#64748B] font-semibold block uppercase">Queue Status</span>
            <span className="text-xl font-extrabold text-[#172018]">
              {currentOrder.status === 'Ready' || currentOrder.status === 'Collected' ? 'At Counter' : `#${currentOrder.queuePosition} in queue`}
            </span>
          </div>

          <div className="bg-[#F8FAFC] p-4 rounded-2xl text-center border border-slate-200">
            <span className="text-[11px] text-[#64748B] font-semibold block uppercase">Estimated Prep</span>
            <span className="text-xl font-extrabold text-[#16A34A]">{currentOrder.estimatedPrepTime}</span>
          </div>

          <div className="bg-[#F8FAFC] p-4 rounded-2xl text-center border border-slate-200">
            <span className="text-[11px] text-[#64748B] font-semibold block uppercase">Pickup Station</span>
            <span className="text-xl font-extrabold text-[#172018]">{currentOrder.counterNumber}</span>
          </div>
        </div>
      </div>

      {/* QR Pass & Items Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* QR Code Pass */}
        <div className="bg-[#172018] text-white p-6 rounded-3xl border border-slate-800 text-center space-y-4 shadow-md">
          <h3 className="text-xs uppercase font-bold text-slate-300 flex items-center justify-center gap-2 tracking-wider">
            <QrCode className="w-4 h-4 text-emerald-400" />
            Digital Pickup Ticket
          </h3>

          <div className="bg-white p-4 rounded-2xl inline-block">
            <svg className="w-32 h-32 mx-auto" viewBox="0 0 100 100" fill="none">
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
              <rect x="45" y="45" width="10" height="10" fill="#16A34A" />
            </svg>
          </div>
          <span className="block text-xs font-mono text-emerald-400 font-bold">PASS: #{orderNumber}</span>
        </div>

        {/* Order Items Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#172018] border-b border-slate-100 pb-2">
            Items in Order #{orderNumber}
          </h3>

          <div className="space-y-3">
            {currentOrder.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs text-[#172018]">
                <span className="font-semibold">{item.name} <span className="text-[#64748B]">x{item.quantity}</span></span>
                <span className="font-bold">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 flex justify-between font-black text-sm text-[#172018]">
            <span>Total Paid</span>
            <span className="text-[#16A34A]">₹{currentOrder.totalAmount}</span>
          </div>
        </div>

      </div>

      {/* Demo Workflow Shortcut */}
      <div className="bg-[#FFEDD5] p-4 rounded-2xl border border-[#F97316]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-[#C2410C] font-semibold">
          <Sparkles className="w-4 h-4 text-[#F97316] flex-shrink-0" />
          <span>Demo Controller: Advance this order state through kitchen queue</span>
        </div>

        {currentOrder.status !== 'Collected' ? (
          <button 
            onClick={handleSimulateNextState}
            className="bg-[#F97316] hover:bg-[#C2410C] text-white font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap"
          >
            Advance to "{steps[currentIndex + 1]}" state <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <span className="text-[#15803D] font-bold bg-[#DCFCE7] px-3 py-1 rounded-lg border border-[#16A34A]/30">
            Order Lifecycle Completed
          </span>
        )}
      </div>

    </div>
  );
};
