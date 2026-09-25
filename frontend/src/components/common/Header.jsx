import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  ShoppingBag, 
  LayoutDashboard, 
  Clock, 
  User, 
  LogOut, 
  ChevronDown,
  Package,
  Layers,
  BarChart3,
  ListOrdered,
  ChefHat,
  ShieldCheck,
  RotateCcw,
  LogIn,
  UserCog,
  Home,
  Menu as MenuIcon,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header = () => {
  const { 
    currentUser, 
    switchRoleDemo, 
    logoutUser, 
    cart, 
    studentTab, 
    setStudentTab, 
    staffTab, 
    setStaffTab, 
    adminTab, 
    setAdminTab,
    resetDemoData,
    setIsEditProfileOpen
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogoClick = () => {
    if (!currentUser) setStudentTab('landing');
    else if (currentUser.role === 'student') setStudentTab('landing');
    else if (currentUser.role === 'staff') setStaffTab('dashboard');
    else if (currentUser.role === 'admin') setAdminTab('dashboard');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 h-[72px] bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full gap-4">
          
          {/* Brand Logo & Name */}
          <div 
            onClick={handleLogoClick}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-[#16A34A] flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:bg-[#15803D] transition transform group-hover:scale-105">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-[#172018]">
                  Smart<span className="text-[#16A34A]">Canteen</span>
                </span>
                {currentUser && (
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border ${
                    currentUser.role === 'student' ? 'bg-[#DCFCE7] text-[#15803D] border-[#16A34A]/30' :
                    currentUser.role === 'staff' ? 'bg-[#FFEDD5] text-[#C2410C] border-[#F97316]/30' :
                    'bg-purple-50 text-purple-700 border-purple-200'
                  }`}>
                    {currentUser.role}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#64748B] hidden sm:block font-medium">Campus Food Ordering & Queue Management</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          {currentUser && (
            <nav className="hidden md:flex items-center gap-1 bg-[#F8FAFC] p-1.5 rounded-xl border border-slate-200">
              {currentUser.role === 'student' && (
                <>
                  <button 
                    onClick={() => setStudentTab('landing')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${studentTab === 'landing' ? 'bg-[#16A34A] text-white shadow-xs' : 'text-[#64748B] hover:text-[#172018] hover:bg-white'}`}
                  >
                    <Home className="w-3.5 h-3.5" /> Home
                  </button>
                  <button 
                    onClick={() => setStudentTab('dashboard')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${studentTab === 'dashboard' ? 'bg-[#16A34A] text-white shadow-xs' : 'text-[#64748B] hover:text-[#172018] hover:bg-white'}`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                  </button>
                  <button 
                    onClick={() => setStudentTab('menu')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${studentTab === 'menu' ? 'bg-[#16A34A] text-white shadow-xs' : 'text-[#64748B] hover:text-[#172018] hover:bg-white'}`}
                  >
                    <UtensilsCrossed className="w-3.5 h-3.5" /> Menu
                  </button>
                  <button 
                    onClick={() => setStudentTab('cart')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition relative ${studentTab === 'cart' || studentTab === 'checkout' ? 'bg-[#16A34A] text-white shadow-xs' : 'text-[#64748B] hover:text-[#172018] hover:bg-white'}`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Cart
                    {totalCartCount > 0 && (
                      <span className="bg-[#EF4444] text-white font-extrabold text-[10px] min-w-[18px] h-4 px-1 rounded-full flex items-center justify-center">
                        {totalCartCount}
                      </span>
                    )}
                  </button>
                  <button 
                    onClick={() => setStudentTab('history')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${studentTab === 'history' || studentTab === 'tracking' ? 'bg-[#16A34A] text-white shadow-xs' : 'text-[#64748B] hover:text-[#172018] hover:bg-white'}`}
                  >
                    <Clock className="w-3.5 h-3.5" /> Orders
                  </button>
                </>
              )}

              {currentUser.role === 'staff' && (
                <>
                  <button 
                    onClick={() => setStaffTab('dashboard')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${staffTab === 'dashboard' || staffTab === 'orders' || staffTab === 'details' ? 'bg-[#16A34A] text-white shadow-xs' : 'text-[#64748B] hover:text-[#172018] hover:bg-white'}`}
                  >
                    <ChefHat className="w-4 h-4" /> Kitchen Queue
                  </button>
                  <button 
                    onClick={() => setStaffTab('inventory')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${staffTab === 'inventory' ? 'bg-[#16A34A] text-white shadow-xs' : 'text-[#64748B] hover:text-[#172018] hover:bg-white'}`}
                  >
                    <Package className="w-4 h-4" /> Stock & Inventory
                  </button>
                </>
              )}

              {currentUser.role === 'admin' && (
                <>
                  <button 
                    onClick={() => setAdminTab('dashboard')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${adminTab === 'dashboard' || adminTab === 'analytics' ? 'bg-[#16A34A] text-white shadow-xs' : 'text-[#64748B] hover:text-[#172018] hover:bg-white'}`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" /> Analytics
                  </button>
                  <button 
                    onClick={() => setAdminTab('menu-mgmt')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${adminTab === 'menu-mgmt' ? 'bg-[#16A34A] text-white shadow-xs' : 'text-[#64748B] hover:text-[#172018] hover:bg-white'}`}
                  >
                    <UtensilsCrossed className="w-3.5 h-3.5" /> Food Menu
                  </button>
                  <button 
                    onClick={() => setAdminTab('pickup-slots')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${adminTab === 'pickup-slots' ? 'bg-[#16A34A] text-white shadow-xs' : 'text-[#64748B] hover:text-[#172018] hover:bg-white'}`}
                  >
                    <Layers className="w-3.5 h-3.5" /> Pickup Slots
                  </button>
                  <button 
                    onClick={() => setAdminTab('orders')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${adminTab === 'orders' ? 'bg-[#16A34A] text-white shadow-xs' : 'text-[#64748B] hover:text-[#172018] hover:bg-white'}`}
                  >
                    <ListOrdered className="w-3.5 h-3.5" /> Orders Audit
                  </button>
                </>
              )}
            </nav>
          )}

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Role Switcher */}
            {currentUser && (
              <div className="relative">
                <button 
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="bg-[#F8FAFC] hover:bg-slate-100 text-[#172018] text-xs px-3 py-2 rounded-xl border border-slate-200 flex items-center gap-1.5 transition font-semibold"
                >
                  <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
                  <span className="hidden lg:inline text-[#64748B]">Role:</span>
                  <span className="capitalize font-bold text-[#172018]">{currentUser.role}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
                </button>

                {roleDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-50 animate-pop-in">
                    <button 
                      onClick={() => { switchRoleDemo('student'); setRoleDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 transition ${currentUser?.role === 'student' ? 'bg-[#DCFCE7] text-[#15803D] font-bold' : 'text-[#172018] hover:bg-slate-50'}`}
                    >
                      <User className="w-3.5 h-3.5 text-[#16A34A]" /> Switch to Student
                    </button>
                    <button 
                      onClick={() => { switchRoleDemo('staff'); setRoleDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 transition ${currentUser?.role === 'staff' ? 'bg-[#FFEDD5] text-[#C2410C] font-bold' : 'text-[#172018] hover:bg-slate-50'}`}
                    >
                      <ChefHat className="w-3.5 h-3.5 text-[#F97316]" /> Switch to Staff
                    </button>
                    <button 
                      onClick={() => { switchRoleDemo('admin'); setRoleDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 transition ${currentUser?.role === 'admin' ? 'bg-purple-50 text-purple-700 font-bold' : 'text-[#172018] hover:bg-slate-50'}`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-600" /> Switch to Admin
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Reset Database Seed */}
            {currentUser && (
              <button 
                onClick={resetDemoData}
                className="text-[#64748B] hover:text-[#172018] p-2 rounded-xl hover:bg-slate-100 transition"
                title="Reset Database to Fresh State"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {/* Unauthenticated Actions */}
            {!currentUser ? (
              <button 
                onClick={() => setStudentTab('login')}
                className="bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setIsEditProfileOpen(true)}
                  className="bg-[#F8FAFC] hover:bg-slate-100 text-[#172018] p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 transition flex items-center gap-2 text-xs font-semibold group"
                  title="Edit Account Profile"
                >
                  <img 
                    src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                    alt="Avatar" 
                    className="w-6 h-6 rounded-lg object-cover border border-emerald-500/60" 
                  />
                  <span className="hidden xl:inline font-bold text-[#172018]">{currentUser?.name?.split(' ')[0]}</span>
                  <UserCog className="w-3.5 h-3.5 text-[#16A34A] group-hover:rotate-45 transition transform" />
                </button>

                {/* Logout Action */}
                <button 
                  onClick={logoutUser}
                  className="text-[#64748B] hover:text-[#EF4444] p-2 rounded-xl hover:bg-rose-50 transition flex items-center gap-1"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-xs font-semibold hidden lg:inline">Sign Out</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            {currentUser && (
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-[#172018] p-2 rounded-xl hover:bg-slate-100 transition"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </button>
            )}

          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {currentUser && mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 shadow-lg animate-slide-down space-y-2">
          {currentUser.role === 'student' && (
            <>
              <button 
                onClick={() => { setStudentTab('landing'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${studentTab === 'landing' ? 'bg-[#16A34A] text-white' : 'text-[#172018] hover:bg-slate-50'}`}
              >
                <Home className="w-4 h-4" /> Home
              </button>
              <button 
                onClick={() => { setStudentTab('dashboard'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${studentTab === 'dashboard' ? 'bg-[#16A34A] text-white' : 'text-[#172018] hover:bg-slate-50'}`}
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </button>
              <button 
                onClick={() => { setStudentTab('menu'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${studentTab === 'menu' ? 'bg-[#16A34A] text-white' : 'text-[#172018] hover:bg-slate-50'}`}
              >
                <UtensilsCrossed className="w-4 h-4" /> Menu
              </button>
              <button 
                onClick={() => { setStudentTab('cart'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between ${studentTab === 'cart' ? 'bg-[#16A34A] text-white' : 'text-[#172018] hover:bg-slate-50'}`}
              >
                <span className="flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> Cart</span>
                {totalCartCount > 0 && <span className="bg-[#EF4444] text-white font-bold text-[10px] px-2 py-0.5 rounded-full">{totalCartCount}</span>}
              </button>
              <button 
                onClick={() => { setStudentTab('history'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${studentTab === 'history' ? 'bg-[#16A34A] text-white' : 'text-[#172018] hover:bg-slate-50'}`}
              >
                <Clock className="w-4 h-4" /> My Orders
              </button>
            </>
          )}

          {currentUser.role === 'staff' && (
            <>
              <button 
                onClick={() => { setStaffTab('dashboard'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${staffTab === 'dashboard' ? 'bg-[#16A34A] text-white' : 'text-[#172018] hover:bg-slate-50'}`}
              >
                <ChefHat className="w-4 h-4" /> Kitchen Queue
              </button>
              <button 
                onClick={() => { setStaffTab('inventory'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${staffTab === 'inventory' ? 'bg-[#16A34A] text-white' : 'text-[#172018] hover:bg-slate-50'}`}
              >
                <Package className="w-4 h-4" /> Stock & Inventory
              </button>
            </>
          )}

          {currentUser.role === 'admin' && (
            <>
              <button 
                onClick={() => { setAdminTab('dashboard'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${adminTab === 'dashboard' ? 'bg-[#16A34A] text-white' : 'text-[#172018] hover:bg-slate-50'}`}
              >
                <BarChart3 className="w-4 h-4" /> Analytics
              </button>
              <button 
                onClick={() => { setAdminTab('menu-mgmt'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${adminTab === 'menu-mgmt' ? 'bg-[#16A34A] text-white' : 'text-[#172018] hover:bg-slate-50'}`}
              >
                <UtensilsCrossed className="w-4 h-4" /> Food Menu
              </button>
              <button 
                onClick={() => { setAdminTab('pickup-slots'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${adminTab === 'pickup-slots' ? 'bg-[#16A34A] text-white' : 'text-[#172018] hover:bg-slate-50'}`}
              >
                <Layers className="w-4 h-4" /> Pickup Slots
              </button>
              <button 
                onClick={() => { setAdminTab('orders'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${adminTab === 'orders' ? 'bg-[#16A34A] text-white' : 'text-[#172018] hover:bg-slate-50'}`}
              >
                <ListOrdered className="w-4 h-4" /> Orders Audit
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
