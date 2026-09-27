import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    default: 10
  },
  bookedCount: {
    type: Number,
    default: 0
  },
  ordersCount: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  estimatedPrepTime: {
    type: Number,
    default: 15
  }
}, { timestamps: true });

slotSchema.pre('save', function () {
  this.ordersCount = this.bookedCount;
  this.isActive = this.active;
});

export const Slot = mongoose.model('Slot', slotSchema);
export const PickupSlot = Slot;
