import React, { useState } from 'react';
import { UtensilsCrossed, Lock, Mail, ArrowRight, User, UserCheck, ChefHat, ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StudentLogin = () => {
  const { loginUser, registerUser, switchRoleDemo } = useApp();
  const [isRegistering, setIsRegistering] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [role, setRole] = useState('student');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (isRegistering) {
      const res = await registerUser({ name, email, password, role, rollNumber, department });
      if (!res.success) {
        setErrorMsg(res.error);
      }
    } else {
      const res = await loginUser(email, password);
      if (!res.success) {
        setErrorMsg(res.error);
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Branding Side (Desktop) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#172018] to-[#166534] text-white p-8 flex flex-col justify-between relative overflow-hidden hidden lg:flex">
          <div className="space-y-4 relative z-10">
            <div className="w-12 h-12 bg-[#16A34A] rounded-2xl flex items-center justify-center text-white shadow-md">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-2xl tracking-tight">Smart<span className="text-[#16A34A]">Canteen</span></span>
              <p className="text-slate-300 text-xs mt-1">Campus Food Pre-Order & Pickup</p>
            </div>
          </div>

          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300">
              <Sparkles className="w-3.5 h-3.5" />
              Fast Canteen Dispatch
            </div>
            <h3 className="text-xl font-bold leading-snug">
              Order meals from your classroom & collect instantly.
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              No long queue lines. Select a 15-minute pickup slot and scan your QR pass at Counter 1.
            </p>
          </div>

          <p className="text-[11px] text-slate-400 relative z-10">
            © SmartCanteen Campus Services
          </p>
        </div>

        {/* Right Authentication Form Card */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center space-y-6 max-w-md mx-auto w-full">
          
          <div className="text-left space-y-1">
            <h2 className="text-2xl font-black text-[#172018]">
              {isRegistering ? 'Create Campus Account' : 'Welcome Back'}
            </h2>
            <p className="text-xs text-[#64748B]">
              {isRegistering ? 'Sign up to pre-order food & reserve pickup slots' : 'Sign in to order your next meal'}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-[#FEE2E2] border border-[#EF4444]/30 text-[#B91C1C] text-xs rounded-xl font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isRegistering && (
              <>
                <div>
                  <label className="block text-xs font-bold text-[#172018] mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input 
                      type="text" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      placeholder="Aditya Sharma"
                      className="w-full h-11 bg-white border border-slate-300 rounded-xl pl-10 pr-4 text-xs text-[#172018] placeholder-slate-400 focus:outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#172018] mb-1">Roll / Staff ID</label>
                    <input 
                      type="text" 
                      value={rollNumber}
                      onChange={e => setRollNumber(e.target.value)}
                      placeholder="CS2024-089"
                      className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-xs text-[#172018] placeholder-slate-400 focus:outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#172018] mb-1">Role</label>
                    <select 
                      value={role}
                      onChange={e => setRole(e.target.value)}
                      className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-xs text-[#172018] focus:outline-none focus:border-[#16A34A]"
                    >
                      <option value="student">Student</option>
                      <option value="staff">Kitchen Staff</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-[#172018] mb-1">Campus Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="student@college.edu"
                  className="w-full h-11 bg-white border border-slate-300 rounded-xl pl-10 pr-4 text-xs text-[#172018] placeholder-slate-400 focus:outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172018] mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full h-11 bg-white border border-slate-300 rounded-xl pl-10 pr-4 text-xs text-[#172018] placeholder-slate-400 focus:outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full h-11 bg-[#16A34A] hover:bg-[#15803D] active:scale-95 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition"
            >
              {isRegistering ? 'Create Account & Sign In' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle Sign In / Register */}
          <p className="text-center text-xs text-[#64748B]">
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setErrorMsg('');
              }}
              className="text-[#16A34A] font-bold hover:underline ml-1"
            >
              {isRegistering ? 'Sign In' : 'Create Account'}
            </button>
          </p>

          {/* Demo Shortcuts */}
          <div className="pt-4 border-t border-slate-200">
            <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block text-center mb-2">
              Quick Fill Demo Accounts
            </span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <button 
                type="button"
                onClick={() => {
                  setIsRegistering(false);
                  setEmail('student@college.edu');
                  setPassword('password123');
                }}
                className="p-2 bg-[#F8FAFC] hover:bg-slate-100 rounded-xl text-xs border border-slate-200 transition"
              >
                <UserCheck className="w-4 h-4 text-[#16A34A] mx-auto mb-1" />
                <span className="block font-bold text-[11px] text-[#172018]">Student</span>
              </button>

              <button 
                type="button"
                onClick={() => {
                  setIsRegistering(false);
                  setEmail('staff@canteen.edu');
                  setPassword('password123');
                }}
                className="p-2 bg-[#F8FAFC] hover:bg-slate-100 rounded-xl text-xs border border-slate-200 transition"
              >
                <ChefHat className="w-4 h-4 text-[#F97316] mx-auto mb-1" />
                <span className="block font-bold text-[11px] text-[#172018]">Staff</span>
              </button>

              <button 
                type="button"
                onClick={() => {
                  setIsRegistering(false);
                  setEmail('admin@canteen.edu');
                  setPassword('password123');
                }}
                className="p-2 bg-[#F8FAFC] hover:bg-slate-100 rounded-xl text-xs border border-slate-200 transition"
              >
                <ShieldCheck className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                <span className="block font-bold text-[11px] text-[#172018]">Admin</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
