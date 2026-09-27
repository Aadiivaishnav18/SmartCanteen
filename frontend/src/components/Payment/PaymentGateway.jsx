import React, { useState } from 'react';
import { 
  CreditCard, 
  Wallet, 
  Coins, 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  ShieldCheck, 
  AlertTriangle,
  Lock,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PaymentGateway = ({ order, onPaymentSuccess, onCancel }) => {
  const { processPayment, cancelOrder, showToast } = useApp();
  
  const [selectedMethod, setSelectedMethod] = useState(order?.paymentMethod || 'Campus Wallet');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentResult, setPaymentResult] = useState(null);

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    setPaymentError('');
    setPaymentResult(null);

    // Short processing delay for realistic payment gateway loading feel
    setTimeout(async () => {
      const orderIdToPay = order?.orderNumber || order?.orderId || order?._id;
      const res = await processPayment(orderIdToPay, selectedMethod);
      setIsProcessing(false);

      if (res.success) {
        setPaymentResult('success');
        if (onPaymentSuccess) onPaymentSuccess(res.order);
      } else {
        setPaymentResult('failed');
        setPaymentError(res.error || 'Payment failed. Please retry or pick another method.');
      }
    }, 1200);
  };

  const handleCancelPayment = async () => {
    const orderIdToCancel = order?.orderNumber || order?.orderId || order?._id;
    await cancelOrder(orderIdToCancel, 'Cancelled during payment');
    if (onCancel) onCancel();
  };

  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Gateway Top Bar */}
        <div className="bg-[#172018] text-white p-6 space-y-2 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              Secure Campus Payment Gateway (90% Success Rate Simulation)
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black px-2.5 py-0.5 rounded-full">
              LIVE DEMO
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-2">
            <div>
              <span className="text-slate-400 text-xs block">Total Payable Amount</span>
              <h2 className="text-3xl font-black text-white">₹{order.totalAmount}</h2>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-[11px] block">Order Number</span>
              <span className="font-mono text-xs text-emerald-300 font-bold">#{order.orderNumber || order.orderId}</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Order Summary Chips */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Items ({order.items?.length || 0})</span>
              <span className="font-semibold text-slate-900">
                {order.items?.map(i => `${i.name} (x${i.quantity})`).join(', ')}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Pickup Slot Window</span>
              <span className="font-bold text-emerald-700">{order.pickupSlotTime}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          {!paymentResult && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                Select Payment Method
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('Campus Wallet')}
                  className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 ${
                    selectedMethod === 'Campus Wallet'
                      ? 'border-[#16A34A] bg-[#F0FDF4] ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <Wallet className={`w-5 h-5 ${selectedMethod === 'Campus Wallet' ? 'text-[#16A34A]' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Campus Wallet</div>
                    <div className="text-[10px] text-slate-500">Auto Debit</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('UPI')}
                  className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 ${
                    selectedMethod === 'UPI'
                      ? 'border-[#16A34A] bg-[#F0FDF4] ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <QrCode className={`w-5 h-5 ${selectedMethod === 'UPI' ? 'text-[#16A34A]' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-xs font-bold text-slate-900">UPI / GPay / PhonePe</div>
                    <div className="text-[10px] text-slate-500">Instant QR</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('Card')}
                  className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 ${
                    selectedMethod === 'Card'
                      ? 'border-[#16A34A] bg-[#F0FDF4] ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <CreditCard className={`w-5 h-5 ${selectedMethod === 'Card' ? 'text-[#16A34A]' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Debit / Credit Card</div>
                    <div className="text-[10px] text-slate-500">All Banks</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('Pay at Counter')}
                  className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 ${
                    selectedMethod === 'Pay at Counter'
                      ? 'border-[#16A34A] bg-[#F0FDF4] ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <Coins className={`w-5 h-5 ${selectedMethod === 'Pay at Counter' ? 'text-[#16A34A]' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Pay Cash at Counter</div>
                    <div className="text-[10px] text-slate-500">On Pickup</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Payment Failed Display */}
          {paymentResult === 'failed' && (
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-xs space-y-2">
              <div className="flex items-center gap-2 text-rose-700 font-bold">
                <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <span>Payment Failed (Simulated 10% Chance Failure)</span>
              </div>
              <p className="text-rose-600 text-[11px] leading-relaxed">
                {paymentError || 'Your payment was declined by the simulated bank server. You can retry immediately or choose a different payment method.'}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {!paymentResult && (
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleSimulatePayment}
                className="w-full bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.99] disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg transition"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Processing Payment Gateway...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Pay ₹{order.totalAmount} Now (Simulate Gateway)
                  </>
                )}
              </button>
            )}

            {paymentResult === 'failed' && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  className="bg-[#16A34A] hover:bg-[#15803D] text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry Payment
                </button>

                <button
                  type="button"
                  onClick={handleCancelPayment}
                  className="bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel Order
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleCancelPayment}
              className="w-full text-slate-500 hover:text-slate-700 font-medium text-xs py-1 transition"
            >
              Cancel Payment & Order
            </button>
          </div>

          <div className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            256-Bit SSL Encrypted Campus Payment Endpoint
          </div>

        </div>
      </div>
    </div>
  );
};
