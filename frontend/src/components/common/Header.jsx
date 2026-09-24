import React from 'react';
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
  UserPlus,
  UserCog,
  Home
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

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-slate-100 border-b border-slate-800/80 shadow-md backdrop-blur-xl bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo & Name */}
          <div 
            onClick={() => {
              if (!currentUser) setStudentTab('landing');
              else if (currentUser.role === 'student') setStudentTab('landing');
              else if (currentUser.role === 'staff') setStaffTab('dashboard');
              else if (currentUser.role === 'admin') setAdminTab('dashboard');
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-950 group-hover:scale-105 transition transform">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-emerald-400 transition">
                  SmartCanteen
                </span>
                {currentUser && (
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                    currentUser.role === 'student' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                    currentUser.role === 'staff' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                    'bg-purple-500/10 text-purple-400 border-purple-500/30'
                  }`}>
                    {currentUser.role}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Pre-Order & Pickup Management System</p>
            </div>
          </div>

          {/* Navigation Links */}
          {currentUser && (
            <nav className="hidden md:flex items-center gap-1.5 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60">
              {currentUser.role === 'student' && (
                <>
                  <button 
                    onClick={() => setStudentTab('landing')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${studentTab === 'landing' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'}`}
                  >
                    <Home className="w-3.5 h-3.5" /> Home
                  </button>
                  <button 
                    onClick={() => setStudentTab('dashboard')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${studentTab === 'dashboard' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'}`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                  </button>
                  <button 
                    onClick={() => setStudentTab('menu')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${studentTab === 'menu' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'}`}
                  >
                    <UtensilsCrossed className="w-3.5 h-3.5" /> Menu
                  </button>
                  <button 
                    onClick={() => setStudentTab('cart')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition relative ${studentTab === 'cart' || studentTab === 'checkout' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'}`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Cart
                    {totalCartCount > 0 && (
                      <span className="bg-emerald-400 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                        {totalCartCount}
                      </span>
                    )}
                  </button>
                  <button 
                    onClick={() => setStudentTab('history')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${studentTab === 'history' || studentTab === 'tracking' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'}`}
                  >
                    <Clock className="w-3.5 h-3.5" /> My Orders
                  </button>
                </>
              )}

              {currentUser.role === 'staff' && (
                <>
                  <button 
                    onClick={() => setStaffTab('dashboard')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${staffTab === 'dashboard' || staffTab === 'orders' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'}`}
                  >
                    <ChefHat className="w-4 h-4" /> Kitchen Queue
                  </button>
                  <button 
                    onClick={() => setStaffTab('inventory')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${staffTab === 'inventory' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'}`}
                  >
                    <Package className="w-4 h-4" /> Stock & Inventory
                  </button>
                </>
              )}

              {currentUser.role === 'admin' && (
                <>
                  <button 
                    onClick={() => setAdminTab('dashboard')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${adminTab === 'dashboard' || adminTab === 'analytics' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'}`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" /> Analytics Overview
                  </button>
                  <button 
                    onClick={() => setAdminTab('menu-mgmt')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${adminTab === 'menu-mgmt' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'}`}
                  >
                    <UtensilsCrossed className="w-3.5 h-3.5" /> Food Menu
                  </button>
                  <button 
                    onClick={() => setAdminTab('pickup-slots')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${adminTab === 'pickup-slots' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'}`}
                  >
                    <Layers className="w-3.5 h-3.5" /> Pickup Slots
                  </button>
                  <button 
                    onClick={() => setAdminTab('orders')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${adminTab === 'orders' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'}`}
                  >
                    <ListOrdered className="w-3.5 h-3.5" /> Orders Audit
                  </button>
                </>
              )}
            </nav>
          )}

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            
            {/* Role Switcher (Only available for logged-in accounts) */}
            {currentUser && (
              <div className="relative group">
                <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3.5 py-2 rounded-xl border border-slate-700/80 flex items-center gap-2 transition font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="hidden xs:inline">Role:</span>
                  <span className="text-white capitalize font-bold">{currentUser.role}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <div className="absolute right-0 top-full mt-1.5 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-1.5 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button 
                    onClick={() => switchRoleDemo('student')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${currentUser?.role === 'student' ? 'bg-emerald-600/30 text-emerald-300 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
                  >
                    <span className="flex items-center gap-2"><User className="w-3.5 h-3.5 text-emerald-400" /> Switch Student</span>
                  </button>
                  <button 
                    onClick={() => switchRoleDemo('staff')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${currentUser?.role === 'staff' ? 'bg-amber-600/30 text-amber-300 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
                  >
                    <span className="flex items-center gap-2"><ChefHat className="w-3.5 h-3.5 text-amber-400" /> Switch Staff</span>
                  </button>
                  <button 
                    onClick={() => switchRoleDemo('admin')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${currentUser?.role === 'admin' ? 'bg-purple-600/30 text-purple-300 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
                  >
                    <span className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Switch Admin</span>
                  </button>
                </div>
              </div>
            )}

            {/* Reset Database Seed */}
            {currentUser && (
              <button 
                onClick={resetDemoData}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
                title="Reset Database to Fresh State"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {/* Unauthenticated Actions */}
            {!currentUser ? (
              <button 
                onClick={() => setStudentTab('login')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setIsEditProfileOpen(true)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-700/80 transition flex items-center gap-2 text-xs font-semibold group"
                  title="Edit Account Profile & Photo"
                >
                  <img 
                    src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                    alt="Avatar" 
                    className="w-6 h-6 rounded-lg object-cover border border-emerald-500/60 shadow-xs" 
                  />
                  <span className="hidden xl:inline text-white font-bold">{currentUser?.name?.split(' ')[0]}</span>
                  <UserCog className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-45 transition transform" />
                </button>

                {/* Logout Action */}
                <button 
                  onClick={logoutUser}
                  className="text-slate-400 hover:text-rose-400 p-2 rounded-xl hover:bg-slate-800 transition flex items-center gap-1"
                  title="Sign out of account"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-xs font-semibold hidden lg:inline">Sign Out</span>
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
