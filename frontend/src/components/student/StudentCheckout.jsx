import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Wallet, 
  CreditCard, 
  Coins, 
  ArrowLeft, 
  ShieldCheck, 
  Lock 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StudentCheckout = () => {
  const { 
    pickupSlots, 
    getCartDetails, 
    placeOrder, 
    setStudentTab,
    showToast
  } = useApp();

  const { items, subtotal, tax, total } = getCartDetails();

  // Find first available active slot
  const defaultSlot = pickupSlots.find(s => s.active && s.bookedCount < s.capacity);
  const [selectedSlotId, setSelectedSlotId] = useState(defaultSlot ? (defaultSlot.id || defaultSlot._id) : '');
  const [paymentMethod, setPaymentMethod] = useState('Campus Wallet');
  const [errorState, setErrorState] = useState('');

  const handlePlaceOrder = () => {
    setErrorState('');

    if (!selectedSlotId) {
      setErrorState('Please select an available pickup slot window.');
      return;
    }

    const res = placeOrder({ pickupSlotId: selectedSlotId, paymentMethod });

    if (!res.success) {
      setErrorState(res.error);
      showToast(res.error, 'error');
    } else {
      setStudentTab('order-confirmation');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <p className="text-[#64748B] text-sm">Your cart is empty.</p>
        <button onClick={() => setStudentTab('menu')} className="mt-4 bg-[#16A34A] text-white font-semibold px-4 py-2 rounded-xl text-xs">
          Return to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setStudentTab('cart')}
          className="bg-white p-2 rounded-xl border border-slate-200 text-[#172018] hover:bg-slate-50 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#172018]">Checkout</h1>
          <p className="text-[#64748B] text-xs sm:text-sm">Select a pickup slot window and payment method</p>
        </div>
      </div>

      {errorState && (
        <div className="p-4 bg-[#FEE2E2] border border-[#EF4444]/30 text-[#B91C1C] rounded-2xl text-xs font-semibold flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0" />
          <span>{errorState}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Main Content: Pickup Slot & Payment Selection */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* STEP 1: PICKUP SLOT SELECTION */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-[#172018] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#16A34A]" />
                1. Select Pickup Time Slot
              </h2>
              <span className="text-xs text-[#64748B] font-medium">15-Min Windows</span>
            </div>

            <p className="text-[#64748B] text-xs leading-relaxed">
              Slots are capacity-controlled to ensure instant counter collection without lines.
            </p>

            {/* Slots Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pickupSlots.map(slot => {
                const slotKey = slot.id || slot._id;
                const isFull = slot.bookedCount >= slot.capacity;
                const isSelected = selectedSlotId === slotKey;
                const available = Math.max(0, slot.capacity - slot.bookedCount);
                const isNearlyFull = available > 0 && available <= 3;

                return (
                  <div
                    key={slotKey}
                    onClick={() => {
                      if (!isFull && slot.active) {
                        setSelectedSlotId(slotKey);
                        setErrorState('');
                      }
                    }}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                      isFull
                        ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                        : isSelected
                        ? 'bg-[#F0FDF4] border-[#16A34A] shadow-xs ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="font-bold text-[#172018] text-sm flex items-center gap-1.5">
                        <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-[#16A34A]' : 'text-slate-400'}`} />
                        {slot.startTime} – {slot.endTime}
                      </div>

                      <div className="text-[11px] font-semibold">
                        {isFull ? (
                          <span className="text-[#B91C1C] font-bold bg-[#FEE2E2] px-2 py-0.5 rounded-md border border-[#EF4444]/20">
                            FULL ({slot.bookedCount}/{slot.capacity})
                          </span>
                        ) : isNearlyFull ? (
                          <span className="text-[#C2410C] font-bold bg-[#FFEDD5] px-2 py-0.5 rounded-md border border-[#F97316]/20">
                            {available} left ({slot.bookedCount}/{slot.capacity} booked)
                          </span>
                        ) : (
                          <span className={`${isSelected ? 'text-[#15803D]' : 'text-[#64748B]'}`}>
                            {available} left ({slot.bookedCount}/{slot.capacity} booked)
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      {isFull ? (
                        <span className="text-[10px] uppercase font-bold text-rose-500 bg-rose-100 px-2 py-1 rounded-md">
                          Disabled
                        </span>
                      ) : (
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#16A34A] bg-[#16A34A] text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: PAYMENT METHOD */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-[#172018] flex items-center gap-2 border-b border-slate-100 pb-3">
              <Wallet className="w-5 h-5 text-[#16A34A]" />
              2. Select Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              <div 
                onClick={() => setPaymentMethod('Campus Wallet')}
                className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                  paymentMethod === 'Campus Wallet'
                    ? 'bg-[#F0FDF4] border-[#16A34A] shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <Wallet className={`w-6 h-6 mb-2 ${paymentMethod === 'Campus Wallet' ? 'text-[#16A34A]' : 'text-slate-400'}`} />
                <div>
                  <span className="font-bold text-xs text-[#172018] block">Campus Wallet</span>
                  <span className="text-[10px] text-[#64748B]">Auto debit from balance</span>
                </div>
              </div>

              <div 
                onClick={() => setPaymentMethod('UPI')}
                className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                  paymentMethod === 'UPI'
                    ? 'bg-[#F0FDF4] border-[#16A34A] shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <CreditCard className={`w-6 h-6 mb-2 ${paymentMethod === 'UPI' ? 'text-[#16A34A]' : 'text-slate-400'}`} />
                <div>
                  <span className="font-bold text-xs text-[#172018] block">UPI / GPay / PhonePe</span>
                  <span className="text-[10px] text-[#64748B]">Instant QR scanner</span>
                </div>
              </div>

              <div 
                onClick={() => setPaymentMethod('Pay at Counter')}
                className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                  paymentMethod === 'Pay at Counter'
                    ? 'bg-[#F0FDF4] border-[#16A34A] shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <Coins className={`w-6 h-6 mb-2 ${paymentMethod === 'Pay at Counter' ? 'text-[#16A34A]' : 'text-slate-400'}`} />
                <div>
                  <span className="font-bold text-xs text-[#172018] block">Pay Cash at Counter</span>
                  <span className="text-[10px] text-[#64748B]">Upon order collection</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Side: Order Summary & Place Order */}
        <div className="bg-[#172018] text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-6">
          <h2 className="text-lg font-bold border-b border-slate-800 pb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#16A34A]" />
            Final Confirmation
          </h2>

          <div className="space-y-3">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Items Breakdown</div>
            {items.map(i => (
              <div key={i.id || i._id} className="flex justify-between text-xs text-slate-200">
                <span>{i.name} (x{i.quantity})</span>
                <span className="font-bold text-white">₹{i.subtotal}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-4 space-y-2 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>GST & Taxes (5%)</span>
              <span>₹{tax}</span>
            </div>
            <div className="border-t border-slate-800 pt-2 flex justify-between text-base font-black text-white">
              <span>Total Amount</span>
              <span className="text-emerald-400">₹{total}</span>
            </div>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 text-xs space-y-1">
            <div className="text-slate-400 font-medium text-[11px]">Selected Pickup Window</div>
            <div className="font-bold text-emerald-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#16A34A]" />
              {pickupSlots.find(s => (s.id === selectedSlotId || s._id === selectedSlotId))?.startTime || 'Select slot'} – {pickupSlots.find(s => (s.id === selectedSlotId || s._id === selectedSlotId))?.endTime || ''}
            </div>
          </div>

          <button 
            onClick={handlePlaceOrder}
            className="w-full bg-[#16A34A] hover:bg-[#15803D] active:scale-95 text-white font-semibold py-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition"
          >
            <Lock className="w-4 h-4" />
            Place Order
          </button>
        </div>

      </div>
    </div>
  );
};
