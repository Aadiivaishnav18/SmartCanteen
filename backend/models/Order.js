import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
  foodId: { type: String },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  subtotal: { type: Number },
  image: { type: String }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  orderId: {
    type: String
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  pickupSlot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slot'
  },
  pickupSlotId: {
    type: String,
    required: true
  },
  pickupSlotTime: {
    type: String,
    required: true
  },
  pickupTime: {
    date: { type: Date, default: Date.now },
    startTime: { type: String },
    endTime: { type: String }
  },
  status: {
    type: String,
    enum: ['placed', 'accepted', 'preparing', 'ready', 'collected', 'cancelled', 'Placed', 'Accepted', 'Preparing', 'Ready', 'Collected', 'Cancelled'],
    default: 'placed'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    default: 'fake-payment'
  },
  queuePosition: {
    type: Number,
    default: 1
  },
  counterNumber: {
    type: String,
    default: 'Counter 1 (Express Pickup)'
  },
  estimatedPrepTime: {
    type: String,
    default: '10-12 mins'
  },
  specialRequests: {
    type: String,
    default: ''
  },
  acceptedAt: { type: Date },
  preparingAt: { type: Date },
  readyAt: { type: Date },
  collectedAt: { type: Date },
  cancelledAt: { type: Date },
  cancelReason: { type: String },
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String }
  }
}, { timestamps: true });

orderSchema.pre('save', function () {
  if (this.orderNumber && !this.orderId) {
    this.orderId = this.orderNumber;
  } else if (this.orderId && !this.orderNumber) {
    this.orderNumber = this.orderId;
  }
});

export const Order = mongoose.model('Order', orderSchema);
