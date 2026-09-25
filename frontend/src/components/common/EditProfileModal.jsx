import React, { useState } from 'react';
import { X, User, Mail, BookOpen, Camera, Phone, Check, Sparkles, Building } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const PRESET_AVATARS = [
  { name: 'Student 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { name: 'Student 2', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
  { name: 'Student 3', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { name: 'Student 4', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { name: 'Student 5', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
  { name: 'Chef / Staff', url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80' }
];

export const EditProfileModal = ({ onClose }) => {
  const { currentUser, updateUserProfile } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [rollNumber, setRollNumber] = useState(currentUser?.rollNumber || '');
  const [department, setDepartment] = useState(currentUser?.department || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || PRESET_AVATARS[0].url);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const finalAvatar = customAvatarUrl.trim() ? customAvatarUrl.trim() : avatar;

    const res = await updateUserProfile({
      name,
      email,
      rollNumber,
      department,
      phone,
      avatar: finalAvatar
    });

    setLoading(false);
    if (res.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172018]/60 backdrop-blur-md animate-pop-in">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-[#172018] max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-[#94A3B8] hover:text-[#172018] p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-[#16A34A] text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" /> Account Settings
          </div>
          <h2 className="text-2xl font-black text-[#172018]">Edit Profile Details</h2>
          <p className="text-[#64748B] text-xs mt-1">
            Update avatar photo, roll number, department, and contact info.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Avatar Selection */}
          <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200">
            <label className="block text-xs font-bold text-[#172018] mb-3 flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#16A34A]" /> Profile Photo
            </label>

            <div className="flex items-center gap-4 mb-3">
              <div className="relative">
                <img 
                  src={customAvatarUrl.trim() || avatar} 
                  alt="Profile Avatar Preview"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#16A34A] shadow-xs"
                  onError={(e) => {
                    e.target.src = PRESET_AVATARS[0].url;
                  }}
                />
                <div className="absolute -bottom-1 -right-1 bg-[#16A34A] text-white p-1 rounded-full text-[10px]">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              </div>

              <div className="flex-1">
                <span className="text-xs font-semibold text-[#64748B] block mb-1.5">Preset Campus Avatars</span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_AVATARS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setAvatar(p.url);
                        setCustomAvatarUrl('');
                      }}
                      className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition ${
                        avatar === p.url && !customAvatarUrl ? 'border-[#16A34A] scale-105 shadow-xs' : 'border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                      title={p.name}
                    >
                      <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Image URL Input */}
            <div>
              <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                Or Paste Image / Photo URL
              </label>
              <input 
                type="url" 
                value={customAvatarUrl}
                onChange={e => setCustomAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full h-10 bg-white border border-slate-300 rounded-xl px-3 text-xs text-[#172018] placeholder-slate-400 focus:outline-none focus:border-[#16A34A]"
              />
            </div>
          </div>

          {/* Full Name */}
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
                className="w-full h-11 bg-white border border-slate-300 rounded-xl pl-10 pr-4 text-xs text-[#172018] focus:outline-none focus:border-[#16A34A]"
              />
            </div>
          </div>

          {/* Email */}
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
                className="w-full h-11 bg-white border border-slate-300 rounded-xl pl-10 pr-4 text-xs text-[#172018] focus:outline-none focus:border-[#16A34A]"
              />
            </div>
          </div>

          {/* Roll Number & Department Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#172018] mb-1">Roll / ID Number</label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input 
                  type="text" 
                  value={rollNumber}
                  onChange={e => setRollNumber(e.target.value)}
                  placeholder="CS2024-089"
                  className="w-full h-11 bg-white border border-slate-300 rounded-xl pl-9 pr-3 text-xs text-[#172018] focus:outline-none focus:border-[#16A34A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172018] mb-1">Department</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input 
                  type="text" 
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  placeholder="Computer Science"
                  className="w-full h-11 bg-white border border-slate-300 rounded-xl pl-9 pr-3 text-xs text-[#172018] focus:outline-none focus:border-[#16A34A]"
                />
              </div>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-[#172018] mb-1">Phone Number (Optional)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input 
                type="tel" 
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full h-11 bg-white border border-slate-300 rounded-xl pl-10 pr-4 text-xs text-[#172018] focus:outline-none focus:border-[#16A34A]"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#64748B] hover:text-[#172018] hover:bg-slate-100 transition"
            >
              Cancel
            </button>

            <button 
              type="submit"
              disabled={loading}
              className="bg-[#16A34A] hover:bg-[#15803D] disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-xs transition"
            >
              {loading ? 'Saving Profile...' : 'Save Profile Changes'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
