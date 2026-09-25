import React, { useState } from 'react';
import { Plus, Clock, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PickupSlotManagement = () => {
  const { pickupSlots, createPickupSlot, updateSlotCapacity, toggleSlotActive } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startTime, setStartTime] = useState('2:00 PM');
  const [endTime, setEndTime] = useState('2:15 PM');
  const [capacity, setCapacity] = useState(10);

  const handleCreate = (e) => {
    e.preventDefault();
    createPickupSlot({ startTime, endTime, capacity });
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#172018]">Pickup Slot Management</h1>
          <p className="text-[#64748B] text-xs sm:text-sm">Configure 15-minute time windows, booking capacities, and active slots</p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold px-5 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition"
        >
          <Plus className="w-4 h-4" /> Create New Time Slot
        </button>
      </div>

      {/* Slots Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pickupSlots.map(slot => {
          const slotId = slot.id || slot._id;
          const available = Math.max(0, slot.capacity - slot.bookedCount);
          const isFull = slot.bookedCount >= slot.capacity;
          const isNearlyFull = available > 0 && available <= 3;

          return (
            <div 
              key={slotId}
              className={`bg-white rounded-3xl p-6 border transition flex flex-col justify-between space-y-4 ${
                !slot.active ? 'border-slate-200 opacity-60 bg-[#F8FAFC]' :
                isFull ? 'border-[#EF4444]/40 shadow-xs' :
                isNearlyFull ? 'border-[#F97316]/40 shadow-xs' : 'border-slate-200 shadow-xs hover:border-[#16A34A]/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <div className="font-extrabold text-[#172018] text-base flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#16A34A]" />
                    {slot.startTime} – {slot.endTime}
                  </div>

                  <button 
                    onClick={() => toggleSlotActive(slotId)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
                      slot.active 
                        ? 'bg-[#DCFCE7] text-[#15803D] border-[#16A34A]/30' 
                        : 'bg-slate-100 text-[#64748B] border-slate-300'
                    }`}
                  >
                    {slot.active ? 'Active' : 'Disabled'}
                  </button>
                </div>

                {/* Capacity Stats Box */}
                <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between text-[#64748B]">
                    <span>Capacity Limit:</span>
                    <strong className="text-[#172018] font-bold">{slot.capacity} orders</strong>
                  </div>
                  <div className="flex justify-between text-[#64748B]">
                    <span>Booked Orders:</span>
                    <strong className="text-[#172018] font-bold">{slot.bookedCount} booked</strong>
                  </div>
                  <div className="flex justify-between text-[#64748B]">
                    <span>Slots Available:</span>
                    <strong className={isFull ? 'text-[#B91C1C] font-extrabold' : isNearlyFull ? 'text-[#C2410C] font-bold' : 'text-[#15803D] font-bold'}>
                      {available} left
                    </strong>
                  </div>

                  {/* Booking Progress Bar */}
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mt-2">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        isFull ? 'bg-[#EF4444]' : isNearlyFull ? 'bg-[#F97316]' : 'bg-[#16A34A]'
                      }`}
                      style={{ width: `${Math.min(100, (slot.bookedCount / slot.capacity) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Action to update capacity */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[#64748B] font-medium">Capacity Adjust</span>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => updateSlotCapacity(slotId, Math.max(1, slot.capacity - 2))}
                    className="w-8 h-8 bg-slate-100 hover:bg-slate-200 text-[#172018] rounded-lg font-bold transition"
                  >
                    -2
                  </button>
                  <button 
                    onClick={() => updateSlotCapacity(slotId, slot.capacity + 2)}
                    className="w-8 h-8 bg-[#DCFCE7] hover:bg-[#DCFCE7]/80 text-[#15803D] rounded-lg font-bold transition"
                  >
                    +2
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal to Create Slot */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#172018]/60 backdrop-blur-md flex items-center justify-center p-4 animate-pop-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4 relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#172018] p-2 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-[#172018]">Create Pickup Slot Window</h2>

            <form onSubmit={handleCreate} className="space-y-4 text-xs font-semibold text-[#172018]">
              <div>
                <label className="block mb-1">Start Time (e.g. 2:00 PM)</label>
                <input 
                  type="text" 
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  required
                  className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-[#172018] focus:outline-none focus:border-[#16A34A]"
                />
              </div>

              <div>
                <label className="block mb-1">End Time (e.g. 2:15 PM)</label>
                <input 
                  type="text" 
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  required
                  className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-[#172018] focus:outline-none focus:border-[#16A34A]"
                />
              </div>

              <div>
                <label className="block mb-1">Order Capacity Limit</label>
                <input 
                  type="number" 
                  value={capacity}
                  onChange={e => setCapacity(Number(e.target.value))}
                  required
                  min="1"
                  className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-[#172018] focus:outline-none focus:border-[#16A34A]"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold py-3.5 rounded-xl text-sm transition shadow-sm"
              >
                Create Pickup Slot
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
