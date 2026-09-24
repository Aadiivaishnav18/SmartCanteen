import React, { useState } from 'react';
import { UtensilsCrossed, Lock, Mail, ArrowRight, User, BookOpen, UserCheck, ChefHat, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StudentLogin = () => {
  const { loginUser, registerUser, switchRoleDemo, setStudentTab } = useApp();
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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto mb-3">
            <UtensilsCrossed className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-white">SmartCanteen</h2>
          <p className="text-slate-400 text-xs mt-1">
            {isRegistering ? 'Create a campus pre-ordering account' : 'Sign in to pre-order food & track pickup slots'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-950/80 border border-rose-800 text-rose-200 text-xs rounded-xl text-center font-medium">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isRegistering && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    placeholder="Aditya Sharma"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Roll / Staff ID</label>
                  <input 
                    type="text" 
                    value={rollNumber}
                    onChange={e => setRollNumber(e.target.value)}
                    placeholder="CS2024-089"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Role</label>
                  <select 
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
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
            <label className="block text-xs font-semibold text-slate-300 mb-1">Campus Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="student@college.edu"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition"
          >
            {isRegistering ? 'Create Account & Sign In' : 'Sign In to SmartCanteen'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Sign In / Sign Up */}
        <p className="text-center text-slate-400 text-xs mt-6">
          {isRegistering ? 'Already have an account?' : "Don't have a campus account?"}{' '}
          <button 
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setErrorMsg('');
              setEmail('');
              setPassword('');
              setName('');
              setRollNumber('');
            }}
            className="text-emerald-400 font-bold hover:underline ml-1"
          >
            {isRegistering ? 'Sign In Here' : 'Register New Account'}
          </button>
        </p>

        {/* Quick Role Login Shortcuts */}
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <p className="text-[10px] font-semibold text-slate-500 text-center uppercase tracking-wider mb-2">
            Quick Fill Demo Login Credentials
          </p>

          <div className="grid grid-cols-3 gap-2">
            <button 
              type="button"
              onClick={() => {
                setIsRegistering(false);
                setEmail('student@college.edu');
                setPassword('password123');
              }}
              className="p-2 bg-slate-950 hover:bg-slate-800 rounded-xl text-center text-slate-300 border border-slate-800 hover:border-emerald-500/40 transition"
            >
              <UserCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <span className="block text-[11px] font-bold text-white">Student Demo</span>
            </button>

            <button 
              type="button"
              onClick={() => {
                setIsRegistering(false);
                setEmail('staff@canteen.edu');
                setPassword('password123');
              }}
              className="p-2 bg-slate-950 hover:bg-slate-800 rounded-xl text-center text-slate-300 border border-slate-800 hover:border-amber-500/40 transition"
            >
              <ChefHat className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <span className="block text-[11px] font-bold text-white">Staff Demo</span>
            </button>

            <button 
              type="button"
              onClick={() => {
                setIsRegistering(false);
                setEmail('admin@canteen.edu');
                setPassword('password123');
              }}
              className="p-2 bg-slate-950 hover:bg-slate-800 rounded-xl text-center text-slate-300 border border-slate-800 hover:border-purple-500/40 transition"
            >
              <ShieldCheck className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <span className="block text-[11px] font-bold text-white">Admin Demo</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
