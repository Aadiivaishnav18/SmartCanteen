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
  Lock, 
  Sparkles 
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

  // Find first available slot by default
  const defaultSlot = pickupSlots.find(s => s.active && s.bookedCount < s.capacity);
  const [selectedSlotId, setSelectedSlotId] = useState(defaultSlot ? defaultSlot.id : '');
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
        <p className="text-slate-500">Your cart is empty.</p>
        <button onClick={() => setStudentTab('menu')} className="mt-4 bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs">
          Return to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setStudentTab('cart')}
          className="bg-white p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Checkout & Slot Reservation</h1>
          <p className="text-slate-500 text-xs sm:text-sm">Select a pickup time window to avoid canteen crowds</p>
        </div>
      </div>

      {errorState && (
        <div className="p-4 bg-rose-950/90 border border-rose-800 text-rose-200 rounded-2xl text-xs font-semibold flex items-center gap-3 animate-bounce-short">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <span>{errorState}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Main Content: Pickup Slot Selection & Payment */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* STEP 1: PICKUP SLOT SELECTION */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                Select Pickup Time Slot
              </h2>
              <span className="text-xs text-slate-500 font-medium">15-Minute Windows</span>
            </div>

            <p className="text-slate-500 text-xs leading-relaxed">
              To keep counter queues moving fast, each slot has a maximum order capacity limit. Disabled slots have reached full booking capacity.
            </p>

            {/* Slots Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pickupSlots.map(slot => {
                const isFull = slot.bookedCount >= slot.capacity;
                const isSelected = selectedSlotId === slot.id;

                return (
                  <div
                    key={slot.id}
                    onClick={() => {
                      if (!isFull && slot.active) {
                        setSelectedSlotId(slot.id);
                        setErrorState('');
                      }
                    }}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                      isFull
                        ? 'bg-slate-50 border-slate-200 opacity-65 cursor-not-allowed'
                        : isSelected
                        ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                        {slot.startTime} – {slot.endTime}
                      </div>

                      <div className="text-[11px] font-semibold mt-1">
                        {isFull ? (
                          <span className="text-rose-600 font-extrabold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                            FULL ({slot.bookedCount} / {slot.capacity} booked)
                          </span>
                        ) : (
                          <span className={`${isSelected ? 'text-emerald-700' : 'text-slate-500'}`}>
                            {slot.bookedCount} / {slot.capacity} orders booked ({slot.capacity - slot.bookedCount} left)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center">
                      {isFull ? (
                        <span className="text-[10px] uppercase font-bold text-rose-500 bg-rose-100 px-2 py-1 rounded-md">
                          Disabled
                        </span>
                      ) : (
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
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
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Wallet className="w-5 h-5 text-emerald-600" />
              Choose Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              <div 
                onClick={() => setPaymentMethod('Campus Wallet')}
                className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                  paymentMethod === 'Campus Wallet'
                    ? 'bg-emerald-50 border-emerald-500 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <Wallet className={`w-6 h-6 mb-2 ${paymentMethod === 'Campus Wallet' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Campus Wallet</span>
                  <span className="text-[10px] text-slate-500">Balance: ₹850</span>
                </div>
              </div>

              <div 
                onClick={() => setPaymentMethod('UPI')}
                className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                  paymentMethod === 'UPI'
                    ? 'bg-emerald-50 border-emerald-500 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <CreditCard className={`w-6 h-6 mb-2 ${paymentMethod === 'UPI' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div>
                  <span className="font-bold text-xs text-slate-900 block">GPay / PhonePe UPI</span>
                  <span className="text-[10px] text-slate-500">Instant QR scan</span>
                </div>
              </div>

              <div 
                onClick={() => setPaymentMethod('Pay at Counter')}
                className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                  paymentMethod === 'Pay at Counter'
                    ? 'bg-emerald-50 border-emerald-500 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <Coins className={`w-6 h-6 mb-2 ${paymentMethod === 'Pay at Counter' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Pay Cash at Counter</span>
                  <span className="text-[10px] text-slate-500">Upon pickup</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Side: Order Summary & Confirm Action */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-6">
          <h2 className="text-lg font-bold border-b border-slate-800 pb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Final Confirmation
          </h2>

          <div className="space-y-3">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Ordered Items</div>
            {items.map(i => (
              <div key={i.id} className="flex justify-between text-xs text-slate-200">
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
              <span>Taxes (GST 5%)</span>
              <span>₹{tax}</span>
            </div>
            <div className="border-t border-slate-800 pt-2 flex justify-between text-base font-black text-white">
              <span>Total Payable</span>
              <span className="text-emerald-400">₹{total}</span>
            </div>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 text-xs space-y-1">
            <div className="text-slate-400 font-medium text-[11px]">Selected Pickup Window</div>
            <div className="font-bold text-emerald-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              {pickupSlots.find(s => s.id === selectedSlotId)?.startTime || 'Select a slot'} – {pickupSlots.find(s => s.id === selectedSlotId)?.endTime || ''}
            </div>
          </div>

          <button 
            onClick={handlePlaceOrder}
            className="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-extrabold py-4 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition transform"
          >
            <Lock className="w-4 h-4" />
            Confirm & Place Order
          </button>
        </div>

      </div>
    </div>
  );
};
