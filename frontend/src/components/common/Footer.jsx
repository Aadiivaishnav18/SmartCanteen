import React from 'react';
import { UtensilsCrossed, Clock, ShieldCheck, Zap, ArrowRight, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer = () => {
  const { setStudentTab, currentUser, setStaffTab, setAdminTab } = useApp();

  const handleNav = (tab) => {
    if (!currentUser || currentUser.role === 'student') {
      setStudentTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentUser.role === 'staff') {
      setStaffTab(tab === 'menu' ? 'inventory' : 'dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentUser.role === 'admin') {
      setAdminTab(tab === 'menu' ? 'menu-mgmt' : 'dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#172018] text-slate-300 border-t border-slate-800/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Column 1: Brand & Bio */}
          <div className="md:col-span-1 space-y-4">
            <div 
              onClick={() => handleNav('landing')} 
              className="flex items-center gap-2.5 cursor-pointer group w-fit"
            >
              <div className="w-9 h-9 rounded-xl bg-[#16A34A] flex items-center justify-center text-white shadow-md shadow-emerald-950 group-hover:scale-105 transition">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Smart<span className="text-[#16A34A]">Canteen</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Smart campus food ordering for a faster, simpler canteen experience. Pre-order meals and collect without waiting in line.
            </p>

            <div className="inline-flex items-center gap-2 bg-[#16A34A]/10 border border-[#16A34A]/30 px-3 py-1 rounded-full text-[11px] font-semibold text-emerald-400">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Campus Food-Tech Solution
            </div>
          </div>

          {/* Column 2: Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => handleNav('menu')} 
                  className="hover:text-emerald-400 transition flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-[#16A34A]" /> Canteen Menu
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('history')} 
                  className="hover:text-emerald-400 transition flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-[#16A34A]" /> Order History
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('tracking')} 
                  className="hover:text-emerald-400 transition flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-[#16A34A]" /> Live Queue Tracking
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-white cursor-pointer transition">About SmartCanteen</li>
              <li className="hover:text-white cursor-pointer transition">Campus Dining Services</li>
              <li className="hover:text-white cursor-pointer transition">Help & Support</li>
            </ul>
          </div>

          {/* Column 4: Campus Benefits */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Campus Canteen</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span> Quick Staggered Pickup
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span> Fresh Cooked Meals
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span> Zero Counter Waiting
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SmartCanteen. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for smarter campus dining.
          </p>
        </div>

      </div>
    </footer>
  );
};
