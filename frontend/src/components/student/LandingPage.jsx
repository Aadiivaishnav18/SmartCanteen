import React from 'react';
import { 
  UtensilsCrossed, 
  Clock, 
  QrCode, 
  ShieldCheck, 
  ArrowRight, 
  ChefHat, 
  UserCheck, 
  TrendingUp,
  Zap,
  Sparkles,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LandingPage = () => {
  const { setStudentTab, switchRoleDemo, foodItems } = useApp();

  const previewFood = foodItems[0] || {
    name: 'Veg Burger',
    category: 'Snacks',
    price: 80,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    description: 'Crispy vegetable patty with fresh lettuce and mayo.'
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172018] flex flex-col">
      
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#FFFDF7] via-[#F8FAFC] to-[#F8FAFC] border-b border-slate-200">
        
        {/* Subtle Background Accent */}
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-[#DCFCE7] blur-[100px] rounded-full pointer-events-none opacity-60"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <div className="inline-flex items-center gap-2 bg-[#DCFCE7] border border-[#16A34A]/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#15803D]">
              <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
              Smart Campus Food Ordering
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#172018] leading-[1.15]">
              Skip the Queue.<br />
              <span className="text-[#16A34A]">Order Smart.</span><br />
              Pick Up Fast.
            </h1>

            <p className="text-[#64748B] text-base sm:text-lg max-w-2xl leading-relaxed">
              Order your favorite campus meals, choose a pickup slot, and collect your food without waiting in line.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button 
                onClick={() => setStudentTab('login')}
                className="bg-[#16A34A] hover:bg-[#15803D] active:scale-95 text-white font-semibold px-7 py-3.5 rounded-xl text-sm sm:text-base flex items-center gap-2.5 shadow-md shadow-emerald-600/20 transition"
              >
                <UtensilsCrossed className="w-5 h-5" />
                Order Food Now
                <ArrowRight className="w-5 h-5" />
              </button>

              <button 
                onClick={() => setStudentTab('menu')}
                className="bg-white hover:bg-slate-50 text-[#172018] font-semibold px-6 py-3.5 rounded-xl text-sm border border-slate-300 transition"
              >
                Explore Menu
              </button>
            </div>

            {/* Role Switcher Demo Shortcuts */}
            <div className="pt-6 border-t border-slate-200/80">
              <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-3">
                Quick Role Access Portals
              </span>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setStudentTab('login')}
                  className="bg-white hover:bg-slate-50 text-[#172018] font-semibold px-4 py-2 rounded-xl text-xs border border-slate-200 flex items-center gap-1.5 transition"
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#16A34A]" /> Student Portal
                </button>
                <button 
                  onClick={() => switchRoleDemo('staff')}
                  className="bg-white hover:bg-slate-50 text-[#172018] font-semibold px-4 py-2 rounded-xl text-xs border border-slate-200 flex items-center gap-1.5 transition"
                >
                  <ChefHat className="w-3.5 h-3.5 text-[#F97316]" /> Staff Kitchen Portal
                </button>
                <button 
                  onClick={() => switchRoleDemo('admin')}
                  className="bg-white hover:bg-slate-50 text-[#172018] font-semibold px-4 py-2 rounded-xl text-xs border border-slate-200 flex items-center gap-1.5 transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" /> Admin Portal
                </button>
              </div>
            </div>

          </div>

          {/* Right Hero Preview Composition */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white rounded-[24px] p-6 border border-slate-200 shadow-[0_8px_30px_rgba(15,23,42,0.10)] space-y-5 relative">
              
              {/* Floating Live Badge */}
              <div className="absolute -top-3 -right-3 bg-[#172018] text-white px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping"></span>
                <span>Live Campus Canteen</span>
              </div>

              {/* Sample Food Card Preview */}
              <div className="flex items-center gap-4 p-3.5 bg-[#F8FAFC] rounded-2xl border border-slate-200">
                <img 
                  src={previewFood.image} 
                  alt={previewFood.name} 
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-md">
                      {previewFood.category}
                    </span>
                    <span className="text-xs font-extrabold text-[#172018]">₹{previewFood.price}</span>
                  </div>
                  <h4 className="font-bold text-base text-[#172018] mt-1">{previewFood.name}</h4>
                  <p className="text-xs text-[#64748B] line-clamp-1">{previewFood.description}</p>
                </div>
              </div>

              {/* Live Order Tracker Widget Preview */}
              <div className="bg-[#172018] text-white p-4.5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Active Order #SC-9401</span>
                  <span className="bg-[#16A34A] text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                    Preparing
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#16A34A]" />
                    <span>Slot: <strong>1:00 PM – 1:15 PM</strong></span>
                  </div>
                  <span className="text-slate-300 font-medium">Counter 1</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#16A34A] rounded-full w-3/4"></div>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 gap-3 text-center text-xs">
                <div className="bg-[#F0FDF4] p-3 rounded-xl border border-[#16A34A]/20">
                  <span className="text-[10px] text-[#64748B] font-bold block uppercase">Estimated Wait</span>
                  <span className="text-base font-extrabold text-[#15803D]">&lt; 5 Mins</span>
                </div>
                <div className="bg-[#FFEDD5] p-3 rounded-xl border border-[#F97316]/20">
                  <span className="text-[10px] text-[#64748B] font-bold block uppercase">Pickup Slot</span>
                  <span className="text-base font-extrabold text-[#C2410C]">Reserved</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172018]">Why SmartCanteen?</h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">Built specifically for high-volume college dining halls</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-[20px] border border-slate-200 shadow-xs hover:border-[#16A34A]/40 transition space-y-3">
            <div className="w-11 h-11 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#16A34A]">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#172018]">Fast Pickup</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Staggered 15-minute pickup slots eliminate rush hour crowding at canteen counters.
            </p>
          </div>

          <div className="bg-white p-6 rounded-[20px] border border-slate-200 shadow-xs hover:border-[#16A34A]/40 transition space-y-3">
            <div className="w-11 h-11 rounded-xl bg-[#FFEDD5] flex items-center justify-center text-[#F97316]">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#172018]">Fresh Food</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Kitchen staff receives orders in advance so your meals are prepared fresh right on schedule.
            </p>
          </div>

          <div className="bg-white p-6 rounded-[20px] border border-slate-200 shadow-xs hover:border-[#16A34A]/40 transition space-y-3">
            <div className="w-11 h-11 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#16A34A]">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#172018]">Smart Ordering</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Automated stock deduction ensures available food items are strictly capacity-controlled.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};
