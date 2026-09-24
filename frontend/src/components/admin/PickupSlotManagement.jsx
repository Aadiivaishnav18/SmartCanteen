import React, { useState } from 'react';
import { Layers, Plus, Clock, Users, CheckCircle2, AlertCircle, Edit2, X } from 'lucide-react';
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
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Pickup Slot Management</h1>
          <p className="text-slate-500 text-xs sm:text-sm">Configure time windows, booking capacities, and active slots</p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold px-5 py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition"
        >
          <Plus className="w-4 h-4" /> Create New Time Slot
        </button>
      </div>

      {/* Slots Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pickupSlots.map(slot => {
          const available = Math.max(0, slot.capacity - slot.bookedCount);
          const isFull = slot.bookedCount >= slot.capacity;

          return (
            <div 
              key={slot.id}
              className={`bg-white rounded-3xl p-6 border transition flex flex-col justify-between space-y-4 ${
                !slot.active ? 'border-slate-200 opacity-60 bg-slate-50' :
                isFull ? 'border-amber-300 shadow-sm' : 'border-slate-200 shadow-sm hover:border-purple-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <div className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-purple-600" />
                    {slot.startTime} – {slot.endTime}
                  </div>

                  <button 
                    onClick={() => toggleSlotActive(slot.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
                      slot.active 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-slate-100 text-slate-500 border-slate-300'
                    }`}
                  >
                    {slot.active ? 'Active' : 'Disabled'}
                  </button>
                </div>

                {/* Capacity Stats Card */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Total Capacity Limit:</span>
                    <strong className="text-slate-900 font-bold">{slot.capacity} orders</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Current Bookings:</span>
                    <strong className="text-purple-600 font-bold">{slot.bookedCount} booked</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Slots Available:</span>
                    <strong className={isFull ? 'text-rose-600 font-extrabold' : 'text-emerald-600 font-bold'}>
                      {available} left
                    </strong>
                  </div>

                  {/* Booking Progress Bar */}
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mt-2">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        isFull ? 'bg-rose-500' : 'bg-purple-600'
                      }`}
                      style={{ width: `${Math.min(100, (slot.bookedCount / slot.capacity) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Action to update capacity */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Quick Capacity Adjust</span>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => updateSlotCapacity(slot.id, Math.max(1, slot.capacity - 2))}
                    className="w-7 h-7 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold"
                  >
                    -2
                  </button>
                  <button 
                    onClick={() => updateSlotCapacity(slot.id, slot.capacity + 2)}
                    className="w-7 h-7 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg font-bold"
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
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4 relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-2 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900">Create Pickup Slot Window</h2>

            <form onSubmit={handleCreate} className="space-y-4 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1">Start Time (e.g. 2:00 PM)</label>
                <input 
                  type="text" 
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div>
                <label className="block mb-1">End Time (e.g. 2:15 PM)</label>
                <input 
                  type="text" 
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-xl text-sm transition"
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
