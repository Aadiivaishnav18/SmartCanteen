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
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LandingPage = () => {
  const { setStudentTab, switchRoleDemo } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-1.5 rounded-full text-xs font-semibold text-emerald-400">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Smart Pre-Order & Pickup Queue System
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Smart<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Canteen</span>
          </h1>

          <p className="text-xl sm:text-2xl font-bold text-amber-400 max-w-2xl mx-auto">
            Skip the Queue. Order Smart. Pick Up Fast.
          </p>

          <p className="text-slate-400 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Eliminate long canteen lines and crowded pickup counters. SmartCanteen connects college students, kitchen staff, and administrators with automated inventory deduction and capacity-capped pickup slots.
          </p>

          {/* Role CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button 
              onClick={() => {
                setStudentTab('login');
              }}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold px-8 py-4 rounded-2xl text-base flex items-center gap-3 shadow-lg shadow-emerald-500/25 transition transform hover:-translate-y-0.5"
            >
              <UtensilsCrossed className="w-5 h-5" />
              Sign In / Pre-Order Food
              <ArrowRight className="w-5 h-5" />
            </button>

            <button 
              onClick={() => {
                setStudentTab('login');
              }}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-4 rounded-2xl text-sm flex items-center gap-2 border border-slate-800 transition"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              Student Portal (Login / Sign Up)
            </button>

            <button 
              onClick={() => switchRoleDemo('staff')}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-4 rounded-2xl text-sm flex items-center gap-2 border border-slate-800 transition"
            >
              <ChefHat className="w-4 h-4 text-amber-400" />
              Staff Kitchen Portal
            </button>

            <button 
              onClick={() => switchRoleDemo('admin')}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-4 rounded-2xl text-sm flex items-center gap-2 border border-slate-800 transition"
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              Admin Portal
            </button>
          </div>

        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/40 transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Campus Pre-Order</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Order meals directly from your lecture hall before breaks begin.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-amber-500/40 transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Smart Pickup Slots</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              15-minute staggered time windows with strict order capacity limits.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-teal-500/40 transition">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Live Order Tracking</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Real-time updates: Placed → Accepted → Preparing → Ready → Collected.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-purple-500/40 transition">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Real-Time Inventory</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Automated stock deduction prevents over-booking of sold out items.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500">
        <p>© 2026 SmartCanteen — Campus Pre-Order & Pickup Management Platform.</p>
      </footer>
    </div>
  );
};
